// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { enableProductionProtection } from './utils/productionProtection';

import EstimatorPage from './pages/EstimatorPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  // Protection en production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      enableProductionProtection();
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EstimatorPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;