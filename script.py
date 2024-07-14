import requests
import json
url = "http://localhost:8081/auth/register"
payload = json.dumps({
    "login": "daniele@gmail.com",
    "password": "J1i%T@di2Y",
    "firstName": "daniele",
    "lastName": "daniele",
    "role": "ADMIN"
})
headers = {
'Content-Type': 'application/json'
}
response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)