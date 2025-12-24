from rendercv.data.models.cv import CurriculumVitae
from pydantic import ValidationError

phone_formats = [
    "123-456-7890",
    "+11234567890",
    "+1 123 456 7890",
    "1234567890",
    "+90 555 555 55 55", # Example from docs/some sources?
    "0011234567890",
    "123 456 7890",
    "(123) 456-7890"
]

print("Trying to import Cv...")
try:
    from rendercv.schema.models.cv.cv import Cv
    CV_CLASS = Cv
    print("Imported Cv from rendercv.schema.models.cv.cv")
except ImportError as e:
    print(f"Could not import Cv class: {e}")
    exit(1)

for phone in phone_formats:
    data = {
        "name": "Jane Doe",
        "phone": phone,
        "email": "jane@example.com",
        "location": "Test Location",
        "sections": {
            "test_section": ["Test entry"]
        }
    }
    
    try:
        # We might need to wrap it in the top-level structure if validation is strict there
        # But usually Pydantic models validate fields independently
        # However, RenderCV might use specific strict types
        
        # Let's try to instantiate just the CV part
        # Note: 'sections' might need to be valid too, this is a minimal test
        
        # Actually, let's just inspect the phone field type directly if possible
        # or just try to validate
        
        print(f"Testing phone: '{phone}'")
        # We need to construct a valid minimal object. 
        # Based on previous schemas, 'sections' is required.
        # We also need to match the 'sections' structure.
        
        # Minimal valid payload based on John_Doe_CV.yaml
        valid_minimal_sections = {
            "education": [
                {
                    "institution": "Univ",
                    "area": "CS",
                    "degree": "BS",
                    "start_date": "2020-01",
                    "end_date": "2020-02"
                }
            ]
        }
        
        cv_instance = CV_CLASS(
            name="Jane Doe",
            phone=phone,
            sections=valid_minimal_sections
        )
        print(f"  -> VALID")
    except ValidationError as e:
        # Check if phone is the error
        is_phone_error = False
        for err in e.errors():
            if "phone" in str(err['loc']):
                print(f"  -> INVALID: {err['msg']}")
                is_phone_error = True
        
        if not is_phone_error:
            print(f"  -> Error not related to phone: {e}")
    except Exception as e:
        print(f"  -> EXCEPTION: {e}")
