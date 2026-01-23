import requests
import json
import random
import string

BASE_URL = "http://localhost:5000"

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def test_registration_and_login():
    username = f"test_{generate_random_string()}"
    email = f"{username}@example.com"
    password = "TestPassword123!"
    name = "Test User"

    print(f"Testing registration for {username}...")
    reg_payload = {
        "name": name,
        "email": email,
        "username": username,
        "password": password
    }
    
    try:
        reg_response = requests.post(f"{BASE_URL}/api/register", json=reg_payload)
        print(f"Registration Status: {reg_response.status_code}")
        print(f"Registration Response: {reg_response.text}")
        
        if reg_response.status_code == 201:
            print("\nTesting login...")
            login_payload = {
                "identifier": username,
                "password": password
            }
            login_response = requests.post(f"{BASE_URL}/api/login", json=login_payload)
            print(f"Login Status: {login_response.status_code}")
            print(f"Login Response: {login_response.text}")
        else:
            print("Registration failed, skipping login test.")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_registration_and_login()
