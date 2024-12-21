import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LayoutComponent from './Components/Layout/Layout';
import WhatWeOffer from './Pages/Consumer/WhatWeOffer';
import MatchingIPP from './Pages/Consumer/MatchingIPP';
import ChatWithExpert from './Pages/Consumer/ChatWithExpert';
import ConsumptionPattern from './Pages/Consumer/ConsumptionPattern';
import IppProjectDetails from './Pages/Consumer/IPPProjectDetails';
import RequirementsPage from './Pages/Consumer/RequirenmentPage';
import AnnualSvg from './Pages/Consumer/AnnualSaving';
import SubscriptionPlans from './Pages/Consumer/SubscriptionPlan';
import WhatWeOfferG from './Pages/Generator/WhatWeOfferG';
import GenerationPortfolio from './Pages/Generator/GeneratorPortfolio';
import MatchingConsumerPage from './Pages/Generator/MatchingConsumerPage';
import SubscriptionPlanG from './Pages/Generator/SubscriptionPlanG';
import EnergyOptimizationPage from './Pages/Generator/EnergyOptimization';
import LoginC from './Pages/Consumer/LoginC';
import Dashboard from './Pages/Consumer/Dashboard';
import EnergyConsumptionForm from './Pages/Consumer/EnergyConsumptionForm';
import EnergyConsumptionTable from './Pages/Consumer/EnergyConsumptionTable';
import LoginG from './Pages/Generator/LoginG';
import UpdateProfileDetails from './Pages/Generator/UpdateProfileDetails';
import NewPage from './Pages/Generator/NewPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/consumer/login" element={<LoginC />} />
        <Route path="/generator/login" element={<LoginG />} />

        {/* Default Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Routes with shared layout */}
        <Route element={<LayoutComponent />}>
          {/* Consumer Routes */}
          <Route path="/consumer">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="what-we-offer" element={<WhatWeOffer />} />
            <Route path="matching-ipp" element={<MatchingIPP />} />
            <Route path="chat-page" element={<ChatWithExpert />} />
            <Route path="energy-consumption-form" element={<EnergyConsumptionForm />} />
            <Route path="energy-consumption-table" element={<EnergyConsumptionTable />} />
            <Route path="consumption-pattern" element={<ConsumptionPattern />} />
            <Route path="project-details" element={<IppProjectDetails />} />
            <Route path="requirenment" element={<RequirementsPage />} />
            <Route path="annual-saving" element={<AnnualSvg />} />
            <Route path="subscription-plan" element={<SubscriptionPlans />} />
          </Route>

          {/* Generator Routes */}
          <Route path="/generator">
            <Route path="what-we-offer" element={<WhatWeOfferG />} />
            <Route path="portfolio" element={<GenerationPortfolio />} />
            <Route path="matching-consumer" element={<MatchingConsumerPage />} />
            <Route path="subscription-plan" element={<SubscriptionPlanG />} />
            <Route path="energy-optimization" element={<EnergyOptimizationPage />} />
            <Route path="update-profile-details" element={<UpdateProfileDetails />} />
            <Route path="chat-page" element={<ChatWithExpert />} />
            <Route path="new-page" element={<NewPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
