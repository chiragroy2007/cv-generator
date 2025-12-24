import rendercv
import pkgutil
import importlib
import pydantic
import inspect
import json
import sys

output_file = "backend/model_schema.txt"

def find_models(package):
    path = getattr(package, '__path__', [])
    prefix = package.__name__ + "."
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(f"RenderCV version: {rendercv.__version__}\n")
        
        for _, name, ispkg in pkgutil.walk_packages(path, prefix=prefix):
            try:
                mod = importlib.import_module(name)
                for member_name, obj in inspect.getmembers(mod):
                    if inspect.isclass(obj) and issubclass(obj, pydantic.BaseModel) and obj is not pydantic.BaseModel:
                        if "rendercv" in str(obj.__module__):
                            f.write(f"Found Model: {obj.__name__} in {obj.__module__}\n")
                            if obj.__name__ in ["CurriculumVitae", "ExperienceEntry", "Phone"]:
                                 f.write(f"--- Schema for {obj.__name__} ---\n")
                                 f.write(json.dumps(obj.model_json_schema(), indent=2))
                                 f.write("\n---------------------------------\n")
            except Exception as e:
                pass

find_models(rendercv)
print(f"Schema written to {output_file}")
