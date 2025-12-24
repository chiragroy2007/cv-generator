import requests
import time
import sys

def test_render():
    url = "http://localhost:8000/api/render"
    
    # A minimal valid YAML for rendercv (based on general structure)
    # If this fails validation, we will see the error.
    yaml_content = """
cv:
  name: John Doe
  location: Model City
  email: john@example.com
  phone: +1 123 456 7890
design:
  theme: classic
"""
    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, json={"yaml_content": yaml_content})
        if response.status_code == 200:
            print("Success! PDF received.")
            print(f"Content-Type: {response.headers.get('Content-Type')}")
            print(f"Content-Length: {len(response.content)} bytes")
            with open("test_output.pdf", "wb") as f:
                f.write(response.content)
        else:
            print(f"Failed: {response.status_code}")
            # Print detail if json, else text
            try:
                print(f"Detail: {response.json()}")
            except:
                print(f"Response Text: {response.text[:2000]}") # Print first 2000 chars
            sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Wait for server to start if running immediately
    time.sleep(5)
    test_render()
