import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from 'react-bootstrap';

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    template: "",
    profile: {
      fullName: '',
      socialLinks: [{ platform: 'LinkedIn', url: '' }]
    },
    contact: {
      email: '',
      phone: '',
      address: ''
    },
    skills: [{
      category: '',
      technologies: ''
    }],
    education: [{
      level: '',
      institution: '',
      graduationYear: '',
      grade: ''
    }],
    projects: [{
      title: '',
      liveLink: '',
      technologies: '',
      description: ''
    }],
    experience: [{
      jobTitle: '',
      company: '',
      duration: '',
      description: ''
    }],
    certificates: [{
      name: '',
      issuer: '',
      date: ''
    }],
    achievements: [{
      title: '',
      description: ''
    }],
    others: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (section, index, field, value) => {
    setFormData(prev => {
      if (Array.isArray(prev[section])) {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      } else if (typeof prev[section] === 'object') {
        return {
          ...prev,
          [section]: { ...prev[section], [field]: value }
        };
      }
      return { ...prev, [section]: value };
    });
  };

  const handleSocialLinkChange = (index, field, value) => {
    setFormData(prev => {
      const newSocialLinks = [...prev.profile.socialLinks];
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      return {
        ...prev,
        profile: { ...prev.profile, socialLinks: newSocialLinks }
      };
    });
  };

  const addItem = (section) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      const emptyItem = Object.fromEntries(
        Object.keys(newArray[0]).map(key => [key, ''])
      );
      return { ...prev, [section]: [...newArray, emptyItem] };
    });
  };

  const removeItem = (section, index) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: [...prev.profile.socialLinks, { platform: 'LinkedIn', url: '' }]
      }
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: prev.profile.socialLinks.filter((_, i) => i !== index)
      }
    }));
  };

  const handleTemplateChange = (e) => {
    setFormData({ ...formData, template: e.target.value });
  };

  const data = {"template":"Template11.html", "profile":{"fullName":"Salapu Karthik","socialLinks":[{"platform":"LinkedIn","url":"https://www.linkedin.com/in/salapurakesh/"},{"platform":"GitHub","url":"https://github.com/Rakesh2569"}]},"contact":{"email":"salapurakesh865@gmail.com","phone":"8142569928","address":"Dr no: 61-2-19/5,near United Church Street, Malkapuram, Visakhapatnam."},"education":[{"level":"Bachelor's","institution":"Avanthi Institute Of Engineering and Technology","graduationYear":"2024","grade":"7.62"},{"level":"Intermediate","institution":"Ascent Classess","graduationYear":"2020","grade":"9.0"},{"level":"School","institution":"S V V High School","graduationYear":"2018","grade":"9.0"}],"projects":[{"title":"EFlora","liveLink":"https://e-flora.vercel.app/","technologies":"ReactJS, NodeJs, MongoDb","description":"A plant ecommerece store using mern stack"}],"experience":[{"jobTitle":"NxtWave Student","company":"NaxtWave","duration":"July 2024 -  present","description":"I learning the fullstack devlopment"}],"certificates":[{"name":"NxtWave Python","issuer":"NxtWave","date":"2024-11-13"},{"name":"NxtWave SQL","issuer":"NxtWave","date":"2024-12-20"}],"achievements":[{"title":"I have achieved 2nd place PPT in  tech fest In college","description":""}],"others":""}

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Form Data:', JSON.stringify(formData));
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData)
    };
    
    fetch("http://127.0.0.1:8000/generate", options)
      .then(function(response) {
        return response.json();
      })
      .then(function(jsonData) {
        console.log(jsonData);
        setLoading(false);
        navigate('/preview-resume', { state: { resumeData: jsonData } });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const templates = [
    "Template2.html", "Template3.html", "Template4.html", 
    "Template5.html", "Template6.html", "Template7.html", 
    "Template8.html", "Template9.html", "Template10.html", 
    "Template11.html", "Template12.html"
  ];

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit}>
      <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Choose a Template</h5>
          </div>
          <div className="card-body">
        <div className="d-flex templates">
          {templates.map((template) => (
            <div key={template} className="d-flex flex-column align-items-center m-2">
              <label htmlFor={template}>
                <img className="tempImage" src={`src/assets/Templates/${template.replace(".html", ".png")}`} alt={template} />
              </label>
              <br />
              <input
                type="radio"
                id={template}
                name="Template"
                value={template}
                checked={formData.template === template}
                onChange={handleTemplateChange}
              />
            </div>
          ))}
        </div>
        </div>
        </div>
        {/* Profile Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Profile</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.profile.fullName}
                onChange={(e) => handleChange('profile', null, 'fullName', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Social Links</label>
              {formData.profile.socialLinks.map((link, index) => (
                <div key={index} className="row mb-2">
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="GitHub">GitHub</option>
                      <option value="LeetCode">LeetCode</option>
                      <option value="HackerRank">HackerRank</option>
                    </select>
                  </div>
                  <div className="col-md-7">
                    <input
                      type="url"
                      className="form-control"
                      required
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      placeholder="URL"
                    />
                  </div>
                  <div className="col-md-1">
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeSocialLink(index)}
                      >
                        <MinusCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary mt-2"
                onClick={addSocialLink}
              >
                <PlusCircle size={18} className="me-1" />
                Add Social Link
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Contact</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={formData.contact.email}
                  onChange={(e) => handleChange('contact', null, 'email', e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.contact.phone}
                  onChange={(e) => handleChange('contact', null, 'phone', e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.contact.address}
                onChange={(e) => handleChange('contact', null, 'address', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Skills Section (new) */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Skills</h5>
          </div>
          <div className="card-body">
  {formData.skills.map((skill, index) => (
    <div key={index} className="border p-3 mb-3 rounded">
      <div className="mb-3">
        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-control"
          value={skill.category}
          placeholder="e.g., Programming Languages, Frontend, Backend, etc."
          onChange={(e) => handleChange('skills', index, 'category', e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Technologies/Skills</label>
        <input
          type="text"
          className="form-control"
          value={skill.technologies}
          placeholder="e.g., JavaScript, React, Node.js, etc."
          onChange={(e) => handleChange('skills', index, 'technologies', e.target.value)}
        />
      </div>
      {index > 0 && (
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => removeItem('skills', index)}
        >
          <MinusCircle size={18} className="me-1" />
          Remove Skill Category
        </button>
      )}
    </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => addItem('skills')}
            >
              <PlusCircle size={18} className="me-1" />
              Add Skill Category
            </button>
          </div>
        </div>

        {/* Education Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Education</h5>
          </div>
          <div className="card-body">
            {formData.education.map((edu, index) => (
              <div key={index} className="border p-3 mb-3 rounded">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Level</label>
                    <select
                      className="form-select"
                      value={edu.level}
                      onChange={(e) => handleChange('education', index, 'level', e.target.value)}
                    >
                      <option value="">Select Level</option>
                      <option value="Master's">Master's</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="School">School</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Dipolama">Dipolama</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Institution</label>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.institution}
                      onChange={(e) => handleChange('education', index, 'institution', e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Graduation Year</label>
                    <input
                      type="number"
                      className="form-control"
                      value={edu.graduationYear}
                      onChange={(e) => handleChange('education', index, 'graduationYear', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Grade</label>
                    <input
                      type="text"
                      className="form-control"
                      value={edu.grade}
                      onChange={(e) => handleChange('education', index, 'grade', e.target.value)}
                    />
                  </div>
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeItem('education', index)}
                  >
                    <MinusCircle size={18} className="me-1" />
                    Remove Education
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => addItem('education')}
            >
              <PlusCircle size={18} className="me-1" />
              Add Education
            </button>
          </div>
        </div>

        {/* Projects Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Projects</h5>
          </div>
          <div className="card-body">
            {formData.projects.map((project, index) => (
              <div key={index} className="border p-3 mb-3 rounded">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={project.title}
                      onChange={(e) => handleChange('projects', index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Live Link</label>
                    <input
                      type="url"
                      className="form-control"
                      value={project.liveLink}
                      onChange={(e) => handleChange('projects', index, 'liveLink', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Technologies</label>
                  <input
                    type="text"
                    className="form-control"
                    value={project.technologies}
                    onChange={(e) => handleChange('projects', index, 'technologies', e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={project.description}
                    onChange={(e) => handleChange('projects', index, 'description', e.target.value)}
                    rows="3"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeItem('projects', index)}
                  >
                    <MinusCircle size={18} className="me-1" />
                    Remove Project
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => addItem('projects')}
            >
              <PlusCircle size={18} className="me-1" />
              Add Project
            </button>
          </div>
        </div>

        {/* Experience Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Experience</h5>
          </div>
          <div className="card-body">
            {formData.experience.map((exp, index) => (
              <div key={index} className="border p-3 mb-3 rounded">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={exp.jobTitle}
                      onChange={(e) => handleChange('experience', index, 'jobTitle', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      value={exp.company}
                      onChange={(e) => handleChange('experience', index, 'company', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    value={exp.duration}
                    onChange={(e) => handleChange('experience', index, 'duration', e.target.value)}
                    placeholder="e.g., Jan 2020 - Present"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={exp.description}
                    onChange={(e) => handleChange('experience', index, 'description', e.target.value)}
                    rows="3"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeItem('experience', index)}
                  >
                    <MinusCircle size={18} className="me-1" />
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => addItem('experience')}
            >
              <PlusCircle size={18} className="me-1" />
              Add Experience
            </button>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Certificates</h5>
          </div>
          <div className="card-body">
            {formData.certificates.map((cert, index) => (
              <div key={index} className="border p-3 mb-3 rounded">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Certificate Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cert.name}
                      onChange={(e) => handleChange('certificates', index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Issuer</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cert.issuer}
                      onChange={(e) => handleChange('certificates', index, 'issuer', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={cert.date}
                    onChange={(e) => handleChange('certificates', index, 'date', e.target.value)}
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeItem('certificates', index)}
                  >
                    <MinusCircle size={18} className="me-1" />
                    Remove Certificate
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => addItem('certificates')}
            >
              <PlusCircle size={18} className="me-1" />
              Add Certificate
            </button>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Achievements</h5>
          </div>
          <div className="card-body">
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="border p-3 mb-3 rounded">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={achievement.title}
                    onChange={(e) => handleChange('achievements', index, 'title', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={achievement.description}
                    onChange={(e) => handleChange('achievements', index, 'description', e.target.value)}
                    rows="3"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeItem('achievements', index)}
                  >
                    <MinusCircle size={18} className="me-1" />
                    Remove Achievement
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => addItem('achievements')}
            >
              <PlusCircle size={18} className="me-1" />
              Add Achievement
            </button>
          </div>
        </div>

        {/* Others Section */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Others</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Additional Information</label>
              <textarea
                className="form-control"
                value={formData.others}
                onChange={(e) => handleChange('others', null, null, e.target.value)}
                rows="4"
                placeholder="Add any additional information here..."
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-5">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><Spinner size="sm" animation="border" className="me-2" /> Genrating...</> : 'Genrate Resume'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ResumeForm;