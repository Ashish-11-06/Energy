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
import DashboardG from './Pages/Generator/Dashboard';
import EnergyOptimizationPage from './Pages/Generator/EnergyOptimization';
import LoginC from './Pages/Consumer/LoginC';
import Dashboard from './Pages/Consumer/Dashboard';
import EnergyConsumptionTable from './Pages/Consumer/EnergyConsumptionTable';
import LoginG from './Pages/Generator/Auth/LoginG';
import UpdateProfileDetails from './Pages/Generator/UpdateProfileDetails';

// import NewPage from './Pages/Generator/NewPage';

import NewPage from './Pages/Generator/NewPage';
import ProfileConsumer from './Pages/Consumer/ProfileConsumer';
import ProfileGenerator from './Pages/Generator/ProfileGenerator';
import UserGen from './Pages/Generator/UserGen';
import PortfolioGen from './Pages/Generator/PortfolioGen';
import Offer from './Pages/Consumer/Offer';
import RequestedIPP from './Pages/Consumer/RequestedIPP';
import NavbarWithProgressBar from './Pages/Consumer/NavbarWithProgressBar';
import Notification from './Pages/Consumer/Notification';
import OptimizeCombination from './Pages/Generator/OptimizeCombination';
import NotificationGenerator from './Pages/Generator/NotificationGenerator';
import CombinationPattern from './Pages/Generator/CombinationPattern';


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
          <Route
            path="/consumer/*"
            element={
              <>
                {/* Include the NavbarWithProgressBar here */}
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="what-we-offer" element={<WhatWeOffer />} />
                  <Route path="matching-ipp" element={<MatchingIPP />} />
                  <Route path="chat-page" element={<ChatWithExpert />} />                
                  <Route path="energy-consumption-table" element={<EnergyConsumptionTable />} />
                  <Route path="consumption-pattern" element={<ConsumptionPattern />} />
                  <Route path="project-details" element={<IppProjectDetails />} />
                  <Route path="requirenment" element={<RequirementsPage />} />
                  <Route path="annual-saving" element={<AnnualSvg />} />
                  <Route path="subscription-plan" element={<SubscriptionPlans />} />
                  <Route path="profile" element={<ProfileConsumer />} />
                  <Route path="offer" element={<Offer />} />
                  <Route path="requested-ipp" element={<RequestedIPP />} />
                  <Route path="notification" element={<Notification />} />
                </Routes>
              </>
            }
          />

          {/* Generator Routes */}
          <Route path="/generator/*">
            <Route path="dashboard" element={<DashboardG />} />
            <Route path="what-we-offer" element={<WhatWeOfferG />} />
            <Route path="portfolio" element={<GenerationPortfolio />} />
            <Route path="matching-consumer" element={<MatchingConsumerPage />} />
            <Route path="subscription-plan" element={<SubscriptionPlanG />} />
            <Route path="energy-optimization" element={<EnergyOptimizationPage />} />
            <Route path="update-profile-details" element={<UpdateProfileDetails />} />
            <Route path="chat-page" element={<ChatWithExpert />} />
            <Route path="combination-pattern" element={<CombinationPattern />} />

            {/* <Route path="new-page" element={<NewPage />} /> */}

            <Route path="new-page" element={<NewPage />} />
            <Route path="profile" element={<ProfileGenerator />} />
            <Route path="profile/user" element={<UserGen />} />
            <Route path="profile/portfolio" element={<PortfolioGen />} />
            <Route path="combination" element={<OptimizeCombination  />} />
            <Route path="notificationgen" element={<NotificationGenerator  />} />
            
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;









