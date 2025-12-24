import os
import shutil
import tempfile
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
from pathlib import Path

app = FastAPI()

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RenderRequest(BaseModel):
    yaml_content: str

@app.get("/")
def read_root():
    return {"message": "RenderCV Backend is running"}

@app.post("/api/render")
def render_cv(request: RenderRequest):
    # Create a temporary directory for processing
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        input_file = temp_path / "cv.yaml"
        
        # Write the YAML content to a file
        with open(input_file, "w", encoding="utf-8") as f:
            f.write(request.yaml_content)
        
        # Run rendercv
        # build command: rendercv render input_file
        try:
            # Use python -c to invoke rendercv app directly to bypass CLI wrappers
            # This avoids PATH issues and correctly simulates the CLI
            import sys
            
            # Escape backslashes in paths for the python string
            input_path_str = str(input_file).replace('\\', '\\\\')
            
            script = f"""
import sys
# Try to import app.
try:
    from rendercv.cli.app import app
    sys.argv = ['rendercv', 'render', '{input_path_str}'] 
    app()
except ImportError:
    # Fallback
    from rendercv.__main__ import entry_point
    sys.argv = ['rendercv', 'render', '{input_path_str}']
    entry_point()
except SystemExit as e:
    if e.code != 0:
        raise
"""
            cmd = [sys.executable, "-c", script]
            print(f"Executing: {cmd}")
            
            # Create a copy of the environment and set utf-8 encoding for python I/O
            env = os.environ.copy()
            env["PYTHONIOENCODING"] = "utf-8"
            env["NO_COLOR"] = "1"
            env["TERM"] = "dumb"
            env["WHEEL_IN_PROCESS"] = "1" # sometimes helps with rich
            
            process = subprocess.run(
                cmd, 
                cwd=str(temp_path),
                capture_output=True, 
                text=True,
                check=True,
                env=env,
                encoding="utf-8"
            )
        except subprocess.CalledProcessError as e:
            print(f"STDOUT: {e.stdout}")
            print(f"STDERR: {e.stderr}")
            raise HTTPException(status_code=400, detail=f"RenderCV failed: {e.stderr} {e.stdout}")
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
        
        # Find the output PDF
        
        # Find the output PDF
        # RenderCV usually creates a directory named 'rendercv_output' 
        # inside the working directory or similar structure.
        # Let's check the directory structure after running.
        output_dir = temp_path / "rendercv_output"
        if not output_dir.exists():
             # Fallback: sometimes it might output directly if configured differently, 
             # but default behavior creates a folder.
             # Let's try to find any PDF in the temp_path
             pdfs = list(temp_path.glob("**/*.pdf"))
             if not pdfs:
                 raise HTTPException(status_code=500, detail="Output PDF not found after rendering.")
             pdf_path = pdfs[0]
        else:
             pdfs = list(output_dir.glob("*.pdf"))
             if not pdfs:
                 raise HTTPException(status_code=500, detail="Output PDF not found in output directory.")
             pdf_path = pdfs[0]

        # Copy PDF to a safe location before temp dir is deleted? 
        # Or stream it directly. FileResponse can stream open files?
        # Better: copy to a caching dir or just read bytes.
        # Simple for now: read bytes return Response or use FileResponse with a temp background task to delete?
        # Easiest: Copy to a 'generated' folder in the project and serve that.
        
        # Copy PDF and HTML to a safe location
        generated_dir = Path("generated_cvs")
        generated_dir.mkdir(exist_ok=True)
        
        final_pdf_path = generated_dir / pdf_path.name
        shutil.copy(pdf_path, final_pdf_path)
        
        # Look for HTML
        final_html_path_str = None
        htmls = list(output_dir.glob("*.html"))
        if htmls:
            final_html_path = generated_dir / htmls[0].name
            shutil.copy(htmls[0], final_html_path)
            final_html_path_str = f"/generated/{final_html_path.name}"
        elif (temp_path / f"{pdf_path.stem}.html").exists():
             # Fallback location
             html_source = temp_path / f"{pdf_path.stem}.html"
             final_html_path = generated_dir / html_source.name
             shutil.copy(html_source, final_html_path)
             final_html_path_str = f"/generated/{final_html_path.name}"
        
        return {
            "pdf_url": f"/generated/{final_pdf_path.name}",
            "html_url": final_html_path_str
        }

@app.get("/api/templates")
def list_templates():
    template_dir = Path("backend/template")
    if not template_dir.exists():
        return []
    templates = []
    for f in template_dir.glob("*.yaml"):
        templates.append({
            "name": f.stem.replace("_", " ").title(),
            "filename": f.name
        })
    return templates

@app.get("/api/templates/{filename}")
def get_template(filename: str):
    template_path = Path("backend/template") / filename
    if not template_path.exists():
        raise HTTPException(status_code=404, detail="Template not found")
    with open(template_path, "r", encoding="utf-8") as f:
        content = f.read()
    return {"content": content}

from fastapi.staticfiles import StaticFiles
app.mount("/generated", StaticFiles(directory="generated_cvs"), name="generated")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
