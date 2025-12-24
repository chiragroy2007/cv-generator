import rendercv
import pkgutil
import importlib
import pydantic
import inspect

print(f"RenderCV version: {rendercv.__version__}")

def find_models(package):
    path = getattr(package, '__path__', [])
    prefix = package.__name__ + "."
    
    for _, name, ispkg in pkgutil.walk_packages(path, prefix=prefix):
        try:
            mod = importlib.import_module(name)
            for name, obj in inspect.getmembers(mod):
                if inspect.isclass(obj) and issubclass(obj, pydantic.BaseModel) and obj is not pydantic.BaseModel:
                    if "rendercv" in str(obj.__module__):
                        print(f"Found Model: {obj.__name__} in {obj.__module__}")
                        if obj.__name__ == "CurriculumVitae" or obj.__name__ == "ExperienceEntry":
                             print(f"--- Schema for {obj.__name__} ---")
                             print(obj.model_json_schema())
                             print("---------------------------------")
        except Exception as e:
            # print(f"Skipping {name}: {e}")
            pass

find_models(rendercv)
