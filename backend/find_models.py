import rendercv
import pkgutil
import importlib

path = getattr(rendercv, '__path__', [])
model_modules = []

for importer, modname, ispkg in pkgutil.walk_packages(path, prefix="rendercv."):
    if "model" in modname:
        print(f"Found candidate: {modname}")
        model_modules.append(modname)

# Try to inspect one if found
if model_modules:
    print(f"\nInspecting {model_modules[0]}...")
    try:
        mod = importlib.import_module(model_modules[0])
        print(dir(mod))
    except Exception as e:
        print(f"Error importing: {e}")
