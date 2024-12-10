import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Login';  // Assuming your Login component is in the same folder
import WhatWeOffer from './Pages/Consumer/WhatWeOffer';
import './styles/theme.less'
import './App.css';
import MatchingIPP from './Pages/Consumer/MatchingIPP';
import NavBar from './Components/Navbar';
import ChatWithExpert from './Pages/Consumer/ChatWithExpert';
import ConsumptionPattern from './Components/Consumer/ConsumptionPattern';
import IppProjectDetails from './Pages/Consumer/IPPProjectDetails';

function App() {
  return (
    <Router>
      <NavBar/>  {/* Routes */}
        <Routes>
          
          <Route path="/" element={<h1>Welcome to Your React App!</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/what-we-offer" element={<WhatWeOffer />} />
          <Route path="/matching-ipp" element={<MatchingIPP />} />
          <Route path="/chat-page" element={<ChatWithExpert />} />
          <Route path="/consumption-pattern" element={<ConsumptionPattern />} />
          <Route path="/project-details" element={<IppProjectDetails />} />

        </Routes>
     
    </Router>
  );
}

export default App;

