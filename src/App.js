import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EscrowApp from './components/EscrowApp';
import LearnMorePage from './components/LearnMorePage';
import LearnMoreTimelock from './components/LearnMoreTimelock';
import AboutPage from './components/AboutPage';
import CustodyApp from './components/CustodyApp';
import FAQ from './components/FAQ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<EscrowApp />} />
        <Route path="/custody" element={<CustodyApp />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
        <Route path="/learn-more-timelock" element={<LearnMoreTimelock />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App;