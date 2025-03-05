import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigation hook

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <h1>The professional resume <br />builder</h1>
          <p>
            Only 2% of resumes win. Yours will be one of them.
            Let’s build you a resume that works.
          </p>
          <button className="get-started-btn" onClick={() => navigate('/create-resume')}>
            Get Started
          </button>
        </div>
        <div className="resume-images">
          <img src="./src/assets/resume (2).png" alt="Resume Illustration" />
        </div>
      </section>

      {/* Email Section */}
      <section className="email-section">
        <div>
          <h1>Smart Email Composer,<br /> Crafting Professional Emails with Ease</h1>
          <p>Generate Cover Letters, Leave Applications, Resignation Letters & More</p>
          <button className="get-started-btn" onClick={() => navigate('/create-email')}>
            Get Started
          </button>
        </div>
        <div className="email-image">
          <img src="./src/assets/email.png" alt="Email Illustration" />
        </div>
      </section>

      {/* Footer Section */}
    </div>
  );
};

export default Home;
