import React, { useState } from "react";

const MatchResume = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!resumeFile) {
      alert("Please upload a resume file.");
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("description", jobDescription.trim());
  
    try {
      const response = await fetch("https://resumegenerator-ab8r.onrender.com/CompareText", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setMatchResult(data);
      console.log(data);
    } catch (error) {
      console.error("Error matching resume:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(matchResult);
  return (
    <div className="container">
      <h2 className="mb-4">Resume - Job Description Matcher</h2>

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Job Description</h5>
          </div>
          <div className="card-body">
            <textarea
              className="form-control"
              rows="4"
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Upload Resume</h5>
          </div>
          <div className="card-body">
            <label className="form-label">Upload Resume (PDF)</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Processing..." : "Match Resume"}
        </button>
      </form>

      {matchResult && (
        <div className="mt-4 p-3 border rounded">
          <h4>Match Score: <span className="match-result">{matchResult.matching_percentage}%</span></h4>

          <h5>Matched Keywords:</h5>
          <p>{matchResult.matching_keywords.join(", ") || "No significant match"}</p>

          <h5>Non-Matching Keywords:</h5>
          <p>{matchResult.non_matching_keywords.join(", ") || "No missing skills"}</p>

          <h5>Corrections & Suggestions:</h5>
          <ul>
            {matchResult.corrections.map((correction, index) => (
              <li key={index}>{correction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchResume;
