import subprocess
import os

phone_formats = [
    "null", # Test empty
    "\"+1 600 000 0000\"",
    "\"+16000000000\"",
    "\"123-456-7890\"",
    "1234567890", # as number
    "\"1234567890\"", # as string
    "\"(123) 456-7890\"",
    "\"+90 555 555 55 55\""
]

template = """cv:
  name: John Doe
  location: San Francisco, CA
  email: john.doe@email.com
  phone: {PHONE_VAL}
  sections:
    education:
      - institution: Princeton University
        area: Computer Science
        degree: PhD
        start_date: 2018-09
        end_date: 2023-05
design:
  theme: classic
"""

print("Starting brute force check using CLI...")

for phone in phone_formats:
    yaml_content = template.replace("{PHONE_VAL}", phone)
    
    with open("backend/temp_test.yaml", "w", encoding="utf-8") as f:
        f.write(yaml_content)
        
    print(f"Testing phone: {phone}")
    
    # Run CLI
    try:
        result = subprocess.run(
            ["python", "-c", "from rendercv.cli.app import app; app()", "render", "backend/temp_test.yaml"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"  -> VALID! (Return code 0)")
        else:
            if "This is not a valid phone number" in result.stdout or "This is not a valid phone number" in result.stderr:
                 print(f"  -> INVALID (Validation Error)")
            else:
                 print(f"  -> FAILED with valid-looking or other error. Code: {result.returncode}")
                 # print(result.stderr[:200]) # First 200 chars of error
                 
    except Exception as e:
        print(f"  -> EXCEPTION: {e}")

