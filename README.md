# CV Generator by TeamNeuron

An open-source, self-hostable CV generator tool that creates professional, ATS-friendly resumes using YAML and LaTeX (via [RenderCV](https://github.com/rendercv/rendercv)).

![TeamNeuron CV Generator Preview](frontend/public/preview.png)

## Features

-   **Form-Based Editor**: Edit your CV content with a user-friendly form interface.
-   **YAML Support**: Full control via a split-screen YAML editor.
-   **Real-time Preview**: See changes instantly (auto-renders on load and valid updates).
-   **Multiple Templates**: Includes Classic, Modern, Sb2nov, and Engineering templates.
-   **ATS Friendly**: Generates standard LaTeX-based PDFs.

## Quick Start (Local Development)

### Prerequisites
-   Node.js & npm
-   Python 3.10+
-   LaTeX Distribution (TexLive Full recommended)

### Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Deployment

See [deployment_guide.md](deployment_guide.md) for detailed instructions on deploying to a VPS (Ubuntu/Nginx).

## Credits

-   **Created by**: [Chirag](https://www.chirag404.me)
-   **Core Engine**: [RenderCV](https://github.com/rendercv/rendercv)
