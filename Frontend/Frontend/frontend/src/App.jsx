import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResumeForm from './pages/ResumeForm';
import ResumePreview from './pages/ResumePreview';
import Navbar from './pages/Navbar'; // Import Navbar component
import EmailForm from './pages/EmailForm';
import './App.css'
import MatchResume from './pages/MatchResume';

function App() {
  return (
    <Router>
      {/* Add Navbar outside the Routes */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-resume" element={<ResumeForm />} />
        <Route path="/preview-resume" element={<ResumePreview />} />
        <Route path="/create-email" element={<EmailForm />} />
        <Route path="/match-resume" element={<MatchResume />} />
      </Routes>
    </Router>
  );
}

export default App;
