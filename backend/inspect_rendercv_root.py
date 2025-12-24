import rendercv
import pkgutil
import json

print("RenderCV dir:", dir(rendercv))

# Try to find 'data' or 'models' submodules
print("\nWalking packages:")
path = getattr(rendercv, '__path__', [])
for importer, modname, ispkg in pkgutil.walk_packages(path, prefix="rendercv."):
    print(modname)
