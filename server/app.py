# server/app.py - Flask Backend for Puresoul AI Therapist (MySQL Version)

import os
import io
import re
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, Response,send_file
from flask_cors import CORS
from sqlalchemy import or_
import bcrypt
import jwt
from dotenv import load_dotenv
from groq import Groq
from elevenlabs import ElevenLabs

from validation import validate_email, validate_username, validate_password
from models import db, User
print("🔥 RUNNING UPDATED app.py FILE 🔥")

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Extensions
db.init_app(app)

# Initialize API clients
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))
ELEVENLABS_API_KEY = os.getenv("ELEVEN_API_KEY")

if not ELEVENLABS_API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY is not set")

elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)


from functools import wraps

# JWT Secret
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')

# Create tables within app context
with app.app_context():
    db.create_all()

# ============== AUTH DECORATOR ==============

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

# ============== API ROUTES ==============

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'status': 'online',
        'message': 'Puresoul AI Backend is running',
        'endpoints': [
            '/api/register',
            '/api/login',
            '/api/get-response',
            '/api/text-to-speech'
        ]
    }), 200

@app.route('/api/register', methods=['POST'])
def register():
    """User registration endpoint."""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        username = data.get('username', '').strip()
        password = data.get('password', '')

        # Validate username
        username_errors = validate_username(username)
        if username_errors:
            return jsonify({'message': ', '.join(username_errors)}), 400

        # Validate email
        if not validate_email(email):
            return jsonify({'message': 'Invalid email format.'}), 400

        # Validate password
        password_errors = validate_password(password)
        if password_errors:
            return jsonify({'message': ', '.join(password_errors)}), 400

        # Check if user already exists
        existing_user = User.query.filter(
            or_(User.email == email.lower(), User.username == username.lower())
        ).first()
        
        if existing_user:
            return jsonify({'message': 'User with this email or username already exists.'}), 400

        # Hash password
        salt = bcrypt.gensalt(rounds=10)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        # Create and save user
        new_user = User(
            name=name,
            email=email.lower(),
            username=username.lower(),
            password=hashed_password.decode('utf-8')
        )
        
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'Account created successfully! Please login.',
            'credits': 12
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {e}")
        return jsonify({'message': 'Server error during registration.'}), 500


@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint."""
    try:
        data = request.get_json()
        identifier = data.get('identifier', '').strip()
        password = data.get('password', '')

        # Find user by email or username
        user = User.query.filter(
            or_(User.email == identifier.lower(), User.username == identifier.lower())
        ).first()

        if not user:
            return jsonify({'message': 'Invalid credentials.'}), 400

        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'message': 'Invalid credentials.'}), 400

        # Generate JWT token
        token = jwt.encode(
            {
                'id': user.id,
                'username': user.username,
                'exp': datetime.utcnow() + timedelta(hours=24)
            },
            JWT_SECRET,
            algorithm='HS256'
        )

        return jsonify({
            'token': token,
            'username': user.username,
            'credits': user.credits,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': 'Server error during login.'}), 500


@app.route('/api/credits', methods=['GET'])
@token_required
def get_credits(current_user):
    """Fetch user's current credits."""
    return jsonify({
        'username': current_user.username,
        'credits': current_user.credits
    }), 200

@app.route('/api/credits/use', methods=['POST'])
@token_required
def use_credit(current_user):
    """Deduct exactly 1 credit."""
    if current_user.credits <= 0:
        return jsonify({
            'success': False,
            'message': 'Insufficient credits',
            'credits': 0
        }), 403
        
    current_user.credits -= 1
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Credit deducted',
        'credits': current_user.credits
    }), 200

@app.route('/api/credits/buy', methods=['POST'])
@token_required
def buy_credits_v2(current_user):
    """Add purchased credits."""
    data = request.get_json()
    amount = data.get('amount', 0)
    
    if amount <= 0:
        return jsonify({'message': 'Invalid amount.'}), 400
        
    current_user.credits += amount
    current_user.total_credits_purchased += amount
    db.session.commit()
    
    return jsonify({
        'message': f'Successfully purchased {amount} credits!',
        'credits': current_user.credits
    }), 200

@app.route('/api/get-response', methods=['POST'])
@token_required
def get_response(current_user):
    """Chatbot response endpoint using Groq API."""
    try:
        # Check credits
        if current_user.credits <= 0:
            return jsonify({
                'error': 'Insufficient credits',
                'message': 'Your credits are used up 💛'
            }), 403

        data = request.get_json()
        user_message = data.get('userMessage', '')
        message_history = data.get('messageHistory', [])
        category = data.get('category', 'Mental Health')
        # Dictionary of specialized Hinglish system prompts
        system_prompts = {
            "Academic / Exam": """
You are **Dost**, a compassionate Indian mentor specializing in Academic/Exam pressure. 
Mirror the user's language (English or Hinglish). 
Focus on exam anxiety, lack of focus, and study pressure. 
Arre dost, tension mat lo! Help them manage stress and build confidence.
Keep it warm, empathetic, and under 3-4 sentences. Use emojis like 📚, ✍️, ✨.
NO asterisks (*).
""",
            "Career & Jobs": """
You are **Dost**, a career coach who understands the job market struggle in India. 
Mirror the user's language (English or Hinglish).
Focus on career confusion, job search stress, and workplace politics.
Dost, career stress real hai, but we will find a way. Provide professional yet emotional support.
Keep it natural and under 4 sentences. Use emojis like 💼, 🚀, 🤞.
NO asterisks (*).
""",
            "Relationship": """
You are **Dost**, an empathetic friend who listens to relationship problems.
Mirror the user's language (English or Hinglish).
Focus on heartbreaks, family issues, or friendship drama. 
Relationship issues dil se connected hoti hain. Give them a safe space to vent.
Keep it very gentle and validating. Under 4 sentences. Use emojis like ❤️, 🤗, 🤝.
NO asterisks (*).
""",
            "Health & Wellness": """
You are **Dost**, a wellness companion focusing on physical and mental health.
Mirror the user's language (English or Hinglish).
Focus on recovery stress, sleep issues, or general fatigue.
Health sabse pehle hai dost. Encourage healthy habits without being preachy.
Keep it soothing and encouraging. Under 4 sentences. Use emojis like 🏥, 🧘, 🌿.
NO asterisks (*).
""",
            "Personal Growth": """
You are **Dost**, a motivation-focused friend for personal expansion.
Mirror the user's language (English or Hinglish).
Focus on self-doubt, building habits, and finding purpose.
Apne aap ko grow karna ek safar hai dost. Celebrate small wins.
Keep it inspiring and positive. Under 4 sentences. Use emojis like 🌱, ⭐, 📈.
NO asterisks (*).
""",
            "Mental Health": """
You are **Dost**, a supportive companion for general mental wellness.
Mirror the user's language (English or Hinglish).
Focus on anxiety, low mood, or just needing to be heard.
Main hoon na dost, sab discuss karte hain. Provide a non-judgmental ear.
Keep it empathetic and safe. Under 4 sentences. Use emojis like 🧠, 🫂, 🕊️.
NO asterisks (*).
""",
            "Financial Stress": """
You are **Dost**, a practical friend who understands financial anxiety.
Mirror the user's language (English or Hinglish).
Focus on money worries, loan stress, or stability.
Paisa aur stress ka gehra rishta hai, but tension mat lo. Help them stay calm.
Keep it grounded and supportive. Under 4 sentences. Use emojis like 💰, 🏦, ⚓.
NO asterisks (*).
"""
        }

        current_system_prompt = system_prompts.get(category, system_prompts["Mental Health"])

        # Build conversation history
        conversation_history = [
            {"role": "system", "content": current_system_prompt}
        ]
        
        for msg in message_history:
            role = 'user' if msg.get('sender') == 'user' else 'assistant'
            conversation_history.append({"role": role, "content": msg.get('text', '')})
        
        conversation_history.append({"role": "user", "content": user_message})

        # Call Groq API
        chat_completion = groq_client.chat.completions.create(
            messages=conversation_history,
            model="llama-3.3-70b-versatile"
        )

        response_text = chat_completion.choices[0].message.content if chat_completion.choices else "I'm here to listen. Could you tell me more?"

        return jsonify({'therapistResponse': response_text})

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return jsonify({'error': 'Failed to get a response from the AI.'}), 500

@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        cleaned_text = re.sub(r'\*.*?\*', '', text)
        cleaned_text = re.sub(r'[\U0001F600-\U0001F64F]', '', cleaned_text)

        audio_stream = elevenlabs_client.text_to_speech.convert(
            voice_id="21m00Tcm4TlvDq8ikWAM",
            model_id="eleven_multilingual_v2",
            text=cleaned_text
        )

        audio_bytes = b"".join(audio_stream)

        return send_file(
            io.BytesIO(audio_bytes),
            mimetype="audio/mpeg",
            as_attachment=False
        )

    except Exception as e:
        print("Error generating speech:", e)
        return jsonify({'error': 'Failed to generate speech'}), 500



# ============== START SERVER ==============

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"Server is running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
