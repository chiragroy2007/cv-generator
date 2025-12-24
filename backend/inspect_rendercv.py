from rendercv.data.models.cv import CurriculumVitae
from rendercv.data.models.entry_types import ExperienceEntry
import json

print("ExperienceEntry fields:", ExperienceEntry.model_fields.keys())
print("\nExperienceEntry Schema:")
print(json.dumps(ExperienceEntry.model_json_schema(), indent=2))

print("\nCurriculumVitae fields:", CurriculumVitae.model_fields.keys())
