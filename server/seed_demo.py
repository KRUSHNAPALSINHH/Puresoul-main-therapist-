from app import app, db, User
import bcrypt

with app.app_context():
    # Check if demo user exists
    demo_user = User.query.filter_by(username='demo').first()
    if not demo_user:
        print("Creating demo user...")
        salt = bcrypt.gensalt(rounds=10)
        hashed_password = bcrypt.hashpw("password".encode('utf-8'), salt)
        
        demo = User(
            name="Demo User",
            email="demo@example.com",
            username="demo",
            password=hashed_password.decode('utf-8'),
            credits=12
        )
        db.session.add(demo)
        db.session.commit()
        print("Demo user created with username 'demo' and password 'password'")
    else:
        print("Demo user already exists.")
        # Ensure credits are 12
        demo_user.credits = 12
        db.session.commit()
