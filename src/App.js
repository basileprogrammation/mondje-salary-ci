// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import EstimatorPage from './pages/EstimatorPage';
import ResultsPage from './pages/ResultsPage';

function App() {

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