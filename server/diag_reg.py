import sys
import os
import traceback
sys.path.append(os.getcwd())
from app import app, db, User
import bcrypt

with app.app_context():
    try:
        print("Attempting to create a test user...")
        salt = bcrypt.gensalt(rounds=10)
        hashed_password = bcrypt.hashpw("testpassword123".encode('utf-8'), salt)
        
        test_user = User(
            name="Test User",
            email="test@example.com",
            username="testuser",
            password=hashed_password.decode('utf-8')
        )
        db.session.add(test_user)
        db.session.commit()
        print("Success! Test user created.")
        # Cleanup
        db.session.delete(test_user)
        db.session.commit()
    except Exception as e:
        print("Error caught!")
        traceback.print_exc()
        db.session.rollback()
