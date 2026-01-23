# 🌸 Puresoul AI – Your Empathetic Wellness Companion  

> 🧠💖 **Puresoul AI** is a full-stack web application designed to be an empathetic and supportive wellness companion.  
It leverages **real-time emotion detection** and a **sophisticated AI chatbot** to provide an interactive mental wellness experience.  

The heart of Puresoul AI is **"Dost"** 🤝 – a compassionate AI therapist persona that communicates like a trusted friend, adapting its language to make users feel understood and supported.  

---

## ✨ Key Features
- 🔐 **Secure User Authentication** – Sign-up & login with hashed passwords, JWT sessions, and a MySQL database.  
- 💳 **User Credit System** – Managed access via a credit-based system. Users start with 12 credits and can purchase more.
- 💬 **AI-Powered Therapy Chat** – Real-time empathetic conversations powered by **Groq LPU Inference Engine** ⚡.  
- 📊 **Wellness Dashboard** – Track your interactions and manage your profile.
- 🌐 **Adaptive Language Persona** – Detects English vs Hinglish and responds naturally.  
- 🎙️ **Voice-to-Voice Interaction**  
  - 🗣️ Speech-to-Text via Web Speech API  
  - 🔊 Text-to-Speech via **ElevenLabs** realistic voices  
- 😊 **Real-Time Emotion Detection**  
  - Uses **Google MediaPipe Face Landmarker** & **TensorFlow.js**
  - Collects readings → finds dominant emotion  
  - Smart popup with a choice to start a therapy session  

---

## 🛠️ Tech Stack

### 🎨 Frontend
- ⚛️ **React** + **Vite**
- 🎬 **Framer Motion** & **GSAP** (animations)  
- 🖌️ **Tailwind CSS**  
- 🔗 **React Context API** (state management)  
- 📈 **Recharts** (data visualization)
- 🎯 **Lucide React** (icons)  

### ⚙️ Backend
- 🐍 **Python** + **Flask**
- 🗄️ **MySQL** (SQLAlchemy ORM)  
- 🔑 **JWT Authentication** + **bcrypt** password hashing  

### 🤖 AI & External Services
- ⚡ **Groq** – Ultra-low-latency LPU inference engine  
- 🗣️ **ElevenLabs** – High-quality AI voices  
- 👀 **Google MediaPipe** – Real-time emotion & facial analysis  

---

## 🚀 Getting Started

### ✅ Prerequisites
Make sure you have:  
- [Node.js](https://nodejs.org/) v18+  
- [Python](https://www.python.org/) 3.10+
- [MySQL Server](https://dev.mysql.com/downloads/installer/)
- A **Groq AI** API key  
- An **ElevenLabs** API key  

---

### 🔧 Installation & Setup

1️⃣ **Clone the repository**
```bash
git clone https://github.com/your-username/puresoul-ai.git
cd puresoul-ai
```

2️⃣ **Backend Setup**
```bash
cd server
pip install -r requirements.txt
```

Create a `.env` file in `server/`:
```env
SQLALCHEMY_DATABASE_URI=mysql+pymysql://username:password@localhost/puresoul_db
JWT_SECRET=your_super_long_secret
GROQ_API_KEY=your_groq_api_key_here
ELEVEN_API_KEY=your_elevenlabs_api_key_here
PORT=5000
```

3️⃣ **Frontend Setup**
```bash
cd ..
npm install
```

4️⃣ **Run the App**
Open two terminals:

**Terminal 1 → Backend:**
```bash
cd server
python app.py
```

**Terminal 2 → Frontend:**
```bash
npm run dev
```
App will run at 👉 [http://localhost:5173](http://localhost:5173)

---

## 🎥 How to Use
1. **Sign Up / Log In** → Secure account creation with 12 free credits.
2. **Emotion Detection** → Allow camera access to let the app analyze your mood.
3. **Popup Prompt** → Dost will check in based on your dominant emotion.
4. **Therapy Session** → Chat with Dost via text 🎹 or voice 🎙️. Each response uses 1 credit.
5. **Dashboard** → View your usage stats and manage your credits.

---

## 📦 Core Dependencies
| Category | Packages |
| :--- | :--- |
| **Frontend** | React, Tailwind, Framer Motion, GSAP, Recharts, Lucide |
| **Backend** | Flask, Flask-SQLAlchemy, PyMySQL, bcrypt, PyJWT |
| **AI / APIs** | Groq, ElevenLabs, Google MediaPipe, TensorFlow.js |

---

## 🤝 Contributing
Contributions are welcome! 🎉  
Fork → Branch → Commit → Push → PR

