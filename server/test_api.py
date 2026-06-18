import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

print("=" * 50)
print("1. Testing if server is running...")
print("=" * 50)

try:
    response = requests.get("http://127.0.0.1:5000/")
    print(f"✅ Server is running! Status: {response.status_code}")
    print(f"✅ Response: {response.json()}")
except Exception as e:
    print(f"❌ Server is NOT running: {e}")
    exit()

print("\n" + "=" * 50)
print("2. Testing admin login...")
print("=" * 50)

login_data = {
    "email": "admin@docvault.com",
    "password": "adminpassword123"
}

try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"✅ Request sent! Status: {response.status_code}")
    print(f"✅ Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"❌ Login failed: {e}")

print("\n" + "=" * 50)
