import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Login';  // Assuming your Login component is in the same folder
import WhatWeOffer from './Pages/Consumer/WhatWeOffer';
import './App.css';

function App() {
  return (
    <Router>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<h1>Welcome to Your React App!</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/what-we-offer" element={<WhatWeOffer />} />

        </Routes>
     
    </Router>
  );
}

export default App;

