import requests
import json
import os

with open("backend/John_Doe_CV.yaml", "r", encoding="utf-8") as f:
    yaml_content = f.read()

payload = {
  "yaml_content": yaml_content
}

print(f"Sending YAML ({len(yaml_content)} chars)...")

try:
    response = requests.post("http://localhost:8000/api/render", json=payload)
    if response.status_code == 200:
        print("Success! Backend accepted the payload.")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Content-Length: {response.headers.get('content-length')}")
    else:
        print(f"Failed: {response.status_code}")
        with open("backend/last_error.txt", "w", encoding="utf-8") as f:
            f.write(response.text)
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
except Exception as e:
    print(f"Error: {e}")
