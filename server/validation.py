# server/validation.py
import re

def validate_email(email: str) -> bool:
    """Validate email format."""
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return bool(re.match(email_regex, email))


def validate_username(username: str) -> list:
    """Validate username and return list of errors."""
    errors = []
    if len(username) < 3:
        errors.append('Username must be at least 3 characters long')
    if len(username) > 20:
        errors.append('Username must be less than 20 characters')
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        errors.append('Username can only contain letters, numbers, and underscores')
    return errors


def validate_password(password: str) -> list:
    """Validate password strength and return list of errors."""
    errors = []
    if len(password) < 8:
        errors.append('Password must be at least 8 characters long')
    if not re.search(r'[a-z]', password):
        errors.append('Password must contain at least one lowercase letter')
    if not re.search(r'[A-Z]', password):
        errors.append('Password must contain at least one uppercase letter')
    if not re.search(r'\d', password):
        errors.append('Password must contain at least one number')
    if not re.search(r'[@$!%*?&]', password):
        errors.append('Password must contain at least one special character')
    return errors
