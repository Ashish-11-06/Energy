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
import EnergyConsumptionForm from './Pages/Consumer/EnergyConsumptionForm';
import EnergyConsumptionTable from './Pages/Consumer/EnergyConsumptionTable';
import LoginG from './Pages/Generator/LoginG';
import UpdateProfileDetails from './Pages/Generator/UpdateProfileDetails';
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
                  <Route path="energy-consumption-form" element={<EnergyConsumptionForm />} />
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
            <Route path="new-page" element={<NewPage />} />
            <Route path="profile" element={<ProfileGenerator />} />
            <Route path="profile/user" element={<UserGen />} />
            <Route path="profile/portfolio" element={<PortfolioGen />} />
            <Route path="combination" element={<OptimizeCombination  />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;












// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './Pages/LandingPage';
// import LayoutComponent from './Components/Layout/Layout';
// import WhatWeOffer from './Pages/Consumer/WhatWeOffer';
// import MatchingIPP from './Pages/Consumer/MatchingIPP';
// import ChatWithExpert from './Pages/Consumer/ChatWithExpert';
// import ConsumptionPattern from './Pages/Consumer/ConsumptionPattern';
// import IppProjectDetails from './Pages/Consumer/IPPProjectDetails';
// import RequirementsPage from './Pages/Consumer/RequirenmentPage';
// import AnnualSvg from './Pages/Consumer/AnnualSaving';
// import SubscriptionPlans from './Pages/Consumer/SubscriptionPlan';
// import WhatWeOfferG from './Pages/Generator/WhatWeOfferG';
// import GenerationPortfolio from './Pages/Generator/GeneratorPortfolio';
// import MatchingConsumerPage from './Pages/Generator/MatchingConsumerPage';
// import SubscriptionPlanG from './Pages/Generator/SubscriptionPlanG';
// import DashboardG from './Pages/Generator/Dashboard';
// import EnergyOptimizationPage from './Pages/Generator/EnergyOptimization';
// import LoginC from './Pages/Consumer/LoginC';
// import Dashboard from './Pages/Consumer/Dashboard';
// import EnergyConsumptionForm from './Pages/Consumer/EnergyConsumptionForm';
// import EnergyConsumptionTable from './Pages/Consumer/EnergyConsumptionTable';
// import LoginG from './Pages/Generator/LoginG';
// import UpdateProfileDetails from './Pages/Generator/UpdateProfileDetails';
// import NewPage from './Pages/Generator/NewPage';
// import ProfileConsumer from './Pages/Consumer/ProfileConsumer';
// import ProfileGenerator from './Pages/Generator/ProfileGenerator';
// import UserGen from './Pages/Generator/UserGen';
// import PortfolioGen from './Pages/Generator/PortfolioGen';
// import Offer from './Pages/Consumer/Offer';
// import RequestedIPP from './Pages/Consumer/RequestedIPP';
// import Notification from './Pages/Consumer/Notification';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/consumer/login" element={<LoginC />} />
//         <Route path="/generator/login" element={<LoginG />} />

//         {/* Default Landing Page */}
//         <Route path="/" element={<LandingPage />} />

//         {/* Routes with shared layout */}
//         <Route element={<LayoutComponent />}>
//           {/* Consumer Routes */}
//           <Route path="/consumer">
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="what-we-offer" element={<WhatWeOffer />} />
//             <Route path="matching-ipp" element={<MatchingIPP />} />
//             <Route path="chat-page" element={<ChatWithExpert />} />
//             <Route path="energy-consumption-form" element={<EnergyConsumptionForm />} />
//             <Route path="energy-consumption-table" element={<EnergyConsumptionTable />} />
//             <Route path="consumption-pattern" element={<ConsumptionPattern />} />
//             <Route path="project-details" element={<IppProjectDetails />} />
//             <Route path="requirenment" element={<RequirementsPage />} />
//             <Route path="annual-saving" element={<AnnualSvg />} />
//             <Route path="subscription-plan" element={<SubscriptionPlans />} />
//             <Route path="profile" element={<ProfileConsumer />} />
//             <Route path="offer" element={<Offer />} />
//             <Route path="requested-ipp" element={<RequestedIPP />} />
//             <Route path="-ipp" element={<Notification />} />
            
            
//           </Route>

//           {/* Generator Routes */}
//           <Route path="/generator">
//             <Route path='dashboard' element={<DashboardG />} />
//             <Route path="what-we-offer" element={<WhatWeOfferG />} />
//             <Route path="portfolio" element={<GenerationPortfolio />} />
//             <Route path="matching-consumer" element={<MatchingConsumerPage />} />
//             <Route path="subscription-plan" element={<SubscriptionPlanG />} />
//             <Route path="energy-optimization" element={<EnergyOptimizationPage />} />
//             <Route path="update-profile-details" element={<UpdateProfileDetails />} />
//             <Route path="chat-page" element={<ChatWithExpert />} />
//             <Route path="new-page" element={<NewPage />} />
//             <Route path="profile" element={<ProfileGenerator />} />
//             <Route path="profile/user" element={<UserGen />} />
//             <Route path="profile/portfolio" element={<PortfolioGen />} />
//           </Route>
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;  




// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
// import nprogress from 'nprogress';
// import 'nprogress/nprogress.css';
// import './App.css';

// import LandingPage from './Pages/LandingPage';
// import LayoutComponent from './Components/Layout/Layout';
// import WhatWeOffer from './Pages/Consumer/WhatWeOffer';
// import MatchingIPP from './Pages/Consumer/MatchingIPP';
// import ChatWithExpert from './Pages/Consumer/ChatWithExpert';
// import ConsumptionPattern from './Pages/Consumer/ConsumptionPattern';
// import IppProjectDetails from './Pages/Consumer/IPPProjectDetails';
// import RequirementsPage from './Pages/Consumer/RequirenmentPage';
// import AnnualSvg from './Pages/Consumer/AnnualSaving';
// import SubscriptionPlans from './Pages/Consumer/SubscriptionPlan';
// import WhatWeOfferG from './Pages/Generator/WhatWeOfferG';
// import GenerationPortfolio from './Pages/Generator/GeneratorPortfolio';
// import MatchingConsumerPage from './Pages/Generator/MatchingConsumerPage';
// import SubscriptionPlanG from './Pages/Generator/SubscriptionPlanG';
// import DashboardG from './Pages/Generator/Dashboard';
// import EnergyOptimizationPage from './Pages/Generator/EnergyOptimization';
// import LoginC from './Pages/Consumer/LoginC';
// import Dashboard from './Pages/Consumer/Dashboard';
// import EnergyConsumptionForm from './Pages/Consumer/EnergyConsumptionForm';
// import EnergyConsumptionTable from './Pages/Consumer/EnergyConsumptionTable';
// import LoginG from './Pages/Generator/LoginG';
// import UpdateProfileDetails from './Pages/Generator/UpdateProfileDetails';
// import NewPage from './Pages/Generator/NewPage';
// import ProfileConsumer from './Pages/Consumer/ProfileConsumer';
// import ProfileGenerator from './Pages/Generator/ProfileGenerator';
// import UserGen from './Pages/Generator/UserGen';
// import PortfolioGen from './Pages/Generator/PortfolioGen';
// import Offer from './Pages/Consumer/Offer';
// import RequestedIPP from './Pages/Consumer/RequestedIPP';

// // Progress stages for the progress bar
// const progressStages = [
//   { path: '/consumer/requirenment', percentage: 20, label: 'Requirements' },
//   { path: '/consumer/matching-ipp', percentage: 40, label: 'Matching IPP' },
//   { path: '/consumer/annual-saving', percentage: 60,label: 'Annual Saving' },
//   { path: '/consumer/subscription-plan',percentage:90,label:'Subscription-plan'},
//   { path: '/consumer/energy-consumption-table', percentage: 80,label: 'Energy Consumption' },
//   { path: '/consumer/requested-ipp', percentage: 100, label: 'Requested IPP' },
// ];

// const ProgressBar = ({ currentPath }) => {
//   const currentStageIndex = progressStages.findIndex((stage) => stage.path === currentPath);

//   return (
//     <div className="progress-bar-container">
//       <div className="progress-bar">
//         {progressStages.map((stage, index) => (
//           <div
//             key={index}
//             className={`progress-stage ${
//               index <= currentStageIndex ? 'completed' : ''
//             } ${index === currentStageIndex ? 'active' : ''}`}
//             style={{ width: `${100 / progressStages.length}%` }}
//           >
//             <span className="stage-label">{stage.label}</span>
//           </div>
//         ))}
//       </div>
//       <div
//         className="progress-indicator"
//         style={{
//           width: `${currentStageIndex >= 0 ? progressStages[currentStageIndex].percentage : 0}%`,
//           backgroundColor: currentStageIndex === progressStages.length - 1 ? 'green' : 'blue',
//         }}
//       ></div>
//     </div>
//   );
// };

// const RouteChangeHandler = () => {
//   const location = useLocation();

//   useEffect(() => {
//     nprogress.start();
//     return () => {
//       nprogress.done();
//     };
//   }, [location]);

//   return null;
// };

// function App() {
//   return (
//     <Router>
//       <RouteChangeHandler />
//       <Routes>
//         {/* Public routes */}
//         <Route path="/consumer/login" element={<LoginC />} />
//         <Route path="/generator/login" element={<LoginG />} />

//         {/* Default Landing Page */}
//         <Route path="/" element={<LandingPage />} />

//         {/* Routes with shared layout */}
//         <Route element={<LayoutComponent />}>
//           {/* Consumer Routes */}
//           <Route path="/consumer">
//             <Route
//               path="*"
//               element={
//                 <div>
//                   <ProgressBar currentPath={window.location.pathname} />
//                   <Routes>
//                     <Route path="dashboard" element={<Dashboard />} />
//                     <Route path="what-we-offer" element={<WhatWeOffer />} />
//                     <Route path="matching-ipp" element={<MatchingIPP />} />
//                     <Route path="chat-page" element={<ChatWithExpert />} />
//                     <Route path="energy-consumption-form" element={<EnergyConsumptionForm />} />
//                     <Route path="energy-consumption-table" element={<EnergyConsumptionTable />} />
//                     <Route path="consumption-pattern" element={<ConsumptionPattern />} />
//                     <Route path="project-details" element={<IppProjectDetails />} />
//                     <Route path="requirenment" element={<RequirementsPage />} />
//                     <Route path="annual-saving" element={<AnnualSvg />} />
//                     <Route path="subscription-plan" element={<SubscriptionPlans />} />
//                     <Route path="profile" element={<ProfileConsumer />} />
//                     <Route path="offer" element={<Offer />} />
//                     <Route path="requested-ipp" element={<RequestedIPP />} />
//                   </Routes>
//                 </div>
//               }
//             />
//           </Route>

//           {/* Generator Routes */}
//           <Route path="/generator">
//             <Route path="dashboard" element={<DashboardG />} />
//             <Route path="what-we-offer" element={<WhatWeOfferG />} />
//             <Route path="portfolio" element={<GenerationPortfolio />} />
//             <Route path="matching-consumer" element={<MatchingConsumerPage />} />
//             <Route path="subscription-plan" element={<SubscriptionPlanG />} />
//             <Route path="energy-optimization" element={<EnergyOptimizationPage />} />
//             <Route path="update-profile-details" element={<UpdateProfileDetails />} />
//             <Route path="chat-page" element={<ChatWithExpert />} />
//             <Route path="new-page" element={<NewPage />} />
//             <Route path="profile" element={<ProfileGenerator />} />
//             <Route path="profile/user" element={<UserGen />} />
//             <Route path="profile/portfolio" element={<PortfolioGen />} />
//           </Route>
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;



