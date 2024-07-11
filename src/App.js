import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EscrowApp from './components/EscrowApp';
import LearnMorePage from './components/LearnMorePage';
import AboutPage from './components/AboutPage';
import CustodyApp from './components/CustodyApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<EscrowApp />} />
        <Route path="/custody" element={<CustodyApp />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;