import rendercv
import os
import pkgutil

print(f"RenderCV file: {rendercv.__file__}")
package_path = os.path.dirname(rendercv.__file__)
print(f"Package path: {package_path}")

print("\nSubmodules:")
for importer, modname, ispkg in pkgutil.walk_packages([package_path], prefix="rendercv."):
    print(modname)
