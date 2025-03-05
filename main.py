from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path

app = FastAPI()

# Set up templates directory
BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

@app.get("/", response_class=HTMLResponse)
async def get_resume(request: Request):
    # Resume data from form
    data = {'profile': {'fullName': 'Abhishek Peddada', 'socialLinks': [{'platform': 'GitHub', 'url': 'https://discord.gg/GUgnbRM2'}]}, 'contact': {'email': 'abhishek455215141@gmail.com', 'phone': '09398538292', 'address': 'Dn :  59-18-15, harijana street, malkapuram'}, 'skills': [{'category': 'Backend', 'technologies': 'Python'}], 'education': [{'level': "Bachelor's", 'institution': 'GVPCE', 'graduationYear': '2025', 'grade': 'A++'}], 'projects': [{'title': 'Exam EVAL', 'liveLink': 'https://discord.gg/GUgnbRM2', 'technologies': 'HTML, css, Python', 'description': 'Exam evaluation'}], 'experience': [{'jobTitle': 'AI Engineer', 'company': 'Open AI', 'duration': '2025 - Present', 'description': 'AI Developer'}], 'certificates': [{'name': 'RPA', 'issuer': 'Blue Prism', 'date': '2025-01-22'}], 'achievements': [{'title': 'ML EXPO', 'description': '9th Place'}], 'others': 'NA'}

    return templates.TemplateResponse("Template5.html", {"request": request, **data})
