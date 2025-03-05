from jinja2 import Template
import subprocess

# Sample data
resume_data =  {"profile":{"fullName":"Salapu Rakesh","socialLinks":[{"platform":"LinkedIn","url":"https://www.linkedin.com/in/salapurakesh/"},{"platform":"GitHub","url":"https://github.com/Rakesh2569"}]},"contact":{"email":"salapurakesh865@gmail.com","phone":"8142569928","address":"Dr no: 61-2-19/5,near United Church Street, Malkapuram, Visakhapatnam."},"education":[{"level":"Bachelor's","institution":"Avanthi Institute Of Engineering and Technology","graduationYear":"2024","grade":"7.62"},{"level":"Intermediate","institution":"Ascent Classess","graduationYear":"2020","grade":"9.0"},{"level":"School","institution":"S V V High School","graduationYear":"2018","grade":"9.0"}],"projects":[{"title":"EFlora","liveLink":"https://e-flora.vercel.app/","technologies":"ReactJS, NodeJs, MongoDb","description":"A plant ecommerece store using mern stack"}],"experience":[{"jobTitle":"NxtWave Student","company":"NaxtWave","duration":"July 2024 -  present","description":"I learning the fullstack devlopment"}],"certificates":[{"name":"NxtWave Python","issuer":"NxtWave","date":"2024-11-13"},{"name":"NxtWave SQL","issuer":"NxtWave","date":"2024-12-20"}],"achievements":[{"title":"I have achieved 2nd place PPT in  tech fest In college","description":""}],"others":""}

# Load the LaTeX template
with open("Templates\RenderCV_EngineeringResume.tex", "r", encoding="utf-8") as file:
    template = Template(file.read())

# Render the LaTeX content
rendered_latex = template.render(**resume_data)

# Save the rendered LaTeX to a .tex file
with open("resume_output.tex", "w") as file:
    file.write(rendered_latex)

# Compile the LaTeX file to PDF
subprocess.run(["pdflatex", "resume_output.tex"])
