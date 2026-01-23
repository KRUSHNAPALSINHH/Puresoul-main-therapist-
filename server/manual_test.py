from app import app, db, User
import bcrypt
from sqlalchemy import inspect

with app.app_context():
    # Inspect User model
    inst = inspect(User)
    print("Model columns:", [c.key for c in inst.mapper.column_attrs])
    
    # Inspect DB table
    from sqlalchemy import text
    result = db.session.execute(text("SHOW COLUMNS FROM users"))
    db_cols = [row[0] for row in result.fetchall()]
    print("DB columns:", db_cols)
    
    try:
        u = User(name='test', email='test@test.com', username='testuser', password='hashedpassword')
        db.session.add(u)
        db.session.flush() # Try to generate the SQL
        print("Flush success")
        db.session.commit()
        print("Commit success")
        db.session.delete(u)
        db.session.commit()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
