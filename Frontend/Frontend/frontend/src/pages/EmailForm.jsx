import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    letterType: '',
    sender: { email: '', name: '' },
    recipient: { email: '', name: '', company: '' },
    subject: '',
    description: '',
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false); // State to handle copied button state

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' ? { ...prev[section], [field]: value } : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);
    setCopied(false);
    
    try {
      const response = await fetch("https://resumegenerator-ab8r.onrender.com/GetLetter", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to fetch response from server.");
      
      const jsonData = await response.json();
      console.log(jsonData);
      setResponseMessage(jsonData.letter);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponseMessage("An error occurred while fetching the letter.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseMessage) // Copy text to clipboard
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 750); // Reset button text after 2 seconds
      })
      .catch((err) => console.error('Failed to copy text:', err));
  };

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit}>
        {/* Letter Type Selection */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white"><h5 className="mb-0">Letter Type</h5></div>
          <div className="card-body">
            <select className="form-select" value={formData.letterType} onChange={(e) => handleChange('letterType', null, e.target.value)} required>
              <option value="">Select Letter Type</option>
              <option value="application">Application Letter</option>
              <option value="leave">Leave Letter</option>
              <option value="cover">Cover Letter</option>
              <option value="resignation">Resignation Letter</option>
              <option value="offer">Offer Acceptance Letter</option>
            </select>
          </div>
        </div>
        
        {/* Sender & Recipient Information */}
        {['sender', 'recipient'].map(role => (
          <div key={role} className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">{role === 'sender' ? 'From' : 'To'}</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" required value={formData[role].email} onChange={(e) => handleChange(role, 'email', e.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" required value={formData[role].name} onChange={(e) => handleChange(role, 'name', e.target.value)} />
                </div>
              </div>
              {role === 'recipient' && (
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" value={formData.recipient.company} onChange={(e) => handleChange('recipient', 'company', e.target.value)} />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Email Subject & Content */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white"><h5 className="mb-0">Email Content</h5></div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input type="text" className="form-control" required value={formData.subject} onChange={(e) => handleChange('subject', null, e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Body</label>
              <textarea className="form-control" rows="10" required value={formData.description} onChange={(e) => handleChange('description', null, e.target.value)} placeholder="Write your email content here..."></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button with Loading State */}
        <div className="text-center mb-5">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><Spinner size="sm" animation="border" className="me-2" /> Genrating...</> : 'Genrate Email'}
          </button>
        </div>
      </form>

      {/* Response Message Display */}
      {responseMessage && (
        <div className="card mt-4">
          <div className="card-header bg-primary text-white"><h5 className="mb-0">Generated Letter</h5></div>
          <div className="card-body">
            <pre className="p-3 bg-light result">{responseMessage}</pre>
            {/* Copy Button */}
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
