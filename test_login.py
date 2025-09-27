import requests

# Test login with the known user
response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={
        "username": "titarmaresharvil@gmail.com",
        "password": "test123"
    }
)

print(f"Status Code: {response.status_code}")
print("Response:", response.json())