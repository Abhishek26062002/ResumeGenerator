from fastapi import FastAPI, Request, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import tempfile
from pdfminer.high_level import extract_text
import google.generativeai as genai
import json


genai.configure(api_key = 'AIzaSyDCVrwYHeNDwycHjEvbHU89CeBSGKxjF5o')
model = genai.GenerativeModel('gemini-2.0-flash')
# Initialize FastAPI app
app = FastAPI()

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Base URL of your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up the templates directory
BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# Generate a PDF resume from JSON data
@app.post("/generate", response_class=JSONResponse)
async def generate_resume(request: Request):
    try:
        # Parse the JSON input from the frontend
        data = await request.json()
        print("Received Data:", data)
        template = f"Templates/{data['template']}"
        with open(template, 'r') as file:
            template = file.read()
        response = model.generate_content(f'{template}    update this template with this data : {data}. Reframe senctences or some data if needed. Make the code responsive and adjust the font that it fit it in one page.The data should be clean without any unnecessary special characters. Give me html code only.')
        # Render the HTML using Jinja2 template
        # rendered_html = templates.get_template("Template5.html").render(data)
        rendered_html = response.text[7:-3]
        # print("Rendered HTML:", rendered_html)

        # Generate the PDF file using WeasyPrint
        # with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
        #     HTML(string=rendered_html).write_pdf(temp_pdf.name)
        #     pdf_path = temp_pdf.name

        # Return HTML and PDF path in the response
        return {"html": rendered_html}
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Endpoint to download the generated PDF
@app.post("/GetLetter")
async def get_letter(request: Request):
    try:
        raw_body = await request.body()  # Get raw request body
        print("Raw Request Body:", raw_body.decode("utf-8"))  # Debugging log

        # Ensure the request body isn't empty
        if not raw_body:
            raise HTTPException(status_code=400, detail="Empty request body")

        Data = json.loads(raw_body) 
        
        print("Parsed Data:", Data)  # Debugging log

        # Ensure required fields exist
        required_fields = ["letterType", "sender", "recipient", "subject", "description"]
        if not all(field in Data for field in required_fields):
            raise HTTPException(status_code=400, detail="Missing required fields")

        # Constructing prompt dynamically
        prompt = f'''Generate a formal and professional letter with the following details:  
- **Sender**: {Data["sender"]["name"]} ({Data["sender"]["email"]})  
- **Recipient**: {Data["recipient"]["name"]} ({Data["recipient"]["email"]}) at {Data["recipient"].get("company", "N/A")}  
- **Subject**: {Data["subject"]}  

The letter should be **at least 150 words long**, well-structured, and follow a professional format. Ensure it includes:  
- A proper greeting  
- A clear introduction acknowledging the purpose of the letter  
- A detailed body covering key aspects such as job acceptance, excitement, onboarding details, and next steps  
- A professional closing statement  

The letter should be **fully complete and ready to send** without any modifications.  

Provide **only the letter content** without any explanations or additional instructions.'''

        # Generate content using your model
        response = model.generate_content(prompt)  # Using your existing model
        letter_text = response.text  # Extracting the generated letter

        return {"letter": letter_text}  # Sending response to frontend

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.post("/CompareText")
async def compare_resume(file: UploadFile = File(...), description: str = Form(...)):
    try:
        # Save uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            file_content = await file.read()
            tmp_file.write(file_content)
            tmp_file.flush()
        
        # Extract text from PDF
        extracted_text = extract_text(tmp_file.name)

        # Define the prompt
        prompt = f"""
{extracted_text}

Compare the resume with the given job description and return a structured JSON output with the following keys:

- 'matching_percentage': An integer representing the percentage match between the resume and job description.
- 'matching_keywords': A list of keywords/skills that are present in both the resume and job description.
- 'non_matching_keywords': A list of keywords/skills that are present in the job description but missing in the resume.
- 'corrections': A list of recommendations to improve the resume based on missing or underrepresented skills.

Job Description:
{description}

Ensure that the response is a well-structured JSON format like this example:

{{
  "matching_percentage": 65,
  "matching_keywords": [
    "Python", "Machine Learning", "Data Science", "Natural Language Processing", "NLP", "SQL",
    "GitHub", "Gemini API", "LLMs", "Data visualization", "Model evaluation", "Algorithm",
    "Data collection", "Data preparation", "Cloud computing platforms", "Software engineering best practices",
    "SDE Intern", "PostgreSQL", "FastAPI", "Version Control", "Open Source", "API", "Model deployment"
  ],
  "non_matching_keywords": [
    "Lang chain", "Semantic Kernel", "PySpark", "PyTorch", "TensorFlow", "Keras", "Neural Networks",
    "Computer Vision", "Speech Processing", "AzureML", "Google ML", "AWS AI/ML", "H2O", "DataBricks",
    "DataRobots", "Responsible AI", "Data Privacy", "NumPy", "SciPy", "Pandas", "Matplotlib",
    "Linear regression", "Logistic regression", "Decision trees", "Random forests", "Support vector machines",
    "Transformer models", "Attention mechanisms", "Word embeddings", "Convolutional neural networks",
    "Recurrent neural networks", "Object detection", "Reinforcement learning", "Motion planning",
    "Control systems", "Data ethics", "Bias in machine learning", "Fairness in algorithms", "R", "MatLab",
    "Data mining", "Statistical analysis", "Prompt Engineering", "LLM Development"
  ],
  "corrections": [
    "The resume demonstrates experience with Python, Machine Learning, and NLP, which are core skills required for the job. However, it lacks explicit mention of several key technologies like Langchain, Semantic Kernel, PyTorch, TensorFlow, Keras, AzureML, Google ML, AWS AI/ML, H2O, DataBricks, DataRobots, and Spark. The candidate should highlight any exposure to these technologies, even if through personal projects or coursework.",
    "The resume should include more detail on the specific types of machine learning algorithms used (e.g., linear regression, logistic regression, decision trees) and any practical experience using those algorithms. While 'Machine Learning' is listed, being more specific is beneficial.",
    "The resume should also emphasize knowledge and practical experience with data ethics, responsible AI, and data privacy principles, as well as experience in working with data mining and statistical analysis.",
    "While experience with cloud platforms is mentioned, the resume should quantify the candidate's experience with particular cloud platforms and their AI/ML offerings (AWS, Azure, GCP).",
    "The resume mentions Gemini API usage; this should be expanded upon to demonstrate experience with prompt engineering in Generative AI."
  ]
}}
"""



        # Ensure the model response is a valid JSON
        response = model.generate_content(prompt)
        response_text = response.text[7:-3]
        print(response_text)

        try:
            json_response = json.loads(response_text)
        except json.JSONDecodeError:
            return {"error": "Invalid response format from AI model"}
        
        return json_response

    except Exception as e:
        return {"error": str(e)}



# Example health check endpoint (optional)
@app.get("/health")
async def health_check():
    return {"status": "ok"}
