import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import './resumepreview.css';

function ResumePreview() {
  const location = useLocation();
  const { resumeData } = location.state || {};
  const [isGenerating, setIsGenerating] = useState(false);

  if (!resumeData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Data is not available. Please generate the resume first.
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'pt',
      });

      const content = document.getElementById('resume-preview');
      if (!content) return;

      pdf.html(content, {
        callback: function (doc) {
          doc.save('professional-resume.pdf');
        },
        x: 10,
        y: 10,
        width: pdf.internal.pageSize.getWidth() - 20, // Adjust to match A4 width
        autoPaging: true,
        windowWidth: content.scrollWidth,
        windowHeight: content.scrollHeight,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="preview-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="h3 mb-0">Resume Preview</h1>
            </div>
            <div className="col-auto">
              <button
                onClick={handleDownloadPDF}
                className="btn download-btn btn-lg"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin me-2" size={20} />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="me-2" size={20} />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="resume-container">
          <div
            id="resume-preview"
            className="bg-white p-3 border rounded shadow-sm responsive-resume"
            dangerouslySetInnerHTML={{ __html: resumeData.html }}
          />
        </div>
      </div>

      {isGenerating && (
        <div className="loading-overlay">
          <div className="text-center">
            <Loader className="animate-spin mb-2" size={40} />
            <p className="text-primary">Generating your PDF...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ResumePreview;
