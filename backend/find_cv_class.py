import importlib
import pkgutil
import rendercv

try:
    import rendercv.data
    print("Successfully imported rendercv.data")
    print(dir(rendercv.data))
except ImportError:
    print("Could not import rendercv.data")

try:
    import rendercv.data.models
    print("Successfully imported rendercv.data.models")
    print(dir(rendercv.data.models))
except ImportError:
    print("Could not import rendercv.data.models")

# Try to find where CurriculumVitae is
print("\nSearching for CurriculumVitae...")
def search_obj(name, module_prefix="rendercv"):
    try:
        mod = importlib.import_module(module_prefix)
    except:
        return

    if hasattr(mod, name):
        print(f"Found {name} in {module_prefix}")
        return

    if hasattr(mod, "__path__"):
        for _, submod, _ in pkgutil.iter_modules(mod.__path__):
            search_obj(name, module_prefix + "." + submod)

search_obj("CurriculumVitae")
