import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import WhatWeOffer from './Pages/Consumer/WhatWeOffer';
import ChatWithExpert from './Pages/Consumer/ChatWithExpert';
import ConsumptionPattern from './Components/Consumer/ConsumptionPattern';
import IppProjectDetails from './Pages/Consumer/IPPProjectDetails';
import RequirementsPage from './Pages/Consumer/RequirenmentPage';
import AnnualSaving from './Components/Consumer/AnnualSaving';
import MatchingIPP from './Pages/Consumer/MatchingIPP';
import Layout from './Components/Layout'; // Adjust the path as needed
import './styles/theme.less';
import './App.css';
import AnnualSvg from './Pages/Consumer/AnnualSaving';
import WhatWeOfferG from './Pages/Generator/WhatWeOfferG';
import GenerationPortfolio from './Pages/Generator/GeneratorPortfolio';
import MatchingConsumerPage from './Pages/Generator/MatchingConsumerPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Routes with the shared layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Welcome to Your App!</h1>} />
          <Route path="what-we-offer" element={<WhatWeOffer />} />
          <Route path="matching-ipp" element={<MatchingIPP />} />
          <Route path="chat-page" element={<ChatWithExpert />} />
          <Route path="consumption-pattern" element={<ConsumptionPattern />} />
          <Route path="project-details" element={<IppProjectDetails />} />
          <Route path="consumer/requirenment" element={<RequirementsPage />} />
          <Route path="consumer/annual-saving" element={<AnnualSvg />} />
          {/* -------------- */}

          <Route path="generator/what-we-offer" element={<WhatWeOfferG />} />
          <Route path="generator/portfolio" element={<GenerationPortfolio />} />
          <Route path="generator/matching-consumer" element={<MatchingConsumerPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
