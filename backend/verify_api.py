import requests
import json

payload = {
  "yaml_content": """
cv:
  name: John Doe
  location: Stockholm, Sweden
  phone: "650-253-0000"
  sections:
    education:
      - institution: University of Example
        area: Computer Science
        degree: BS
        start_date: "2020-09"
        end_date: "2024-06"
    experience:
      - company: Tech Corp
        position: Software Engineer
        start_date: "2024-06"
        end_date: "present"
  """
}

try:
    response = requests.post("http://localhost:8000/api/render", json=payload)
    if response.status_code == 200:
        print("Success! Backend accepted the payload.")
    else:
        print(f"Failed: {response.status_code}")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
except Exception as e:
    print(f"Error: {e}")
