from app import app, db
from sqlalchemy import text
with app.app_context():
    result = db.session.execute(text("SHOW COLUMNS FROM users"))
    for row in result:
        print(f"Column: {row[0]}, Type: {row[1]}, Default: {row[4]}")
