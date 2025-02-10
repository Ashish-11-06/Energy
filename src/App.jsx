import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from "react-redux";
import LandingPage from './Pages/LandingPage';
import LayoutComponent from './Components/Layout/Layout';
import WhatWeOffer from './Pages/Consumer/WhatWeOffer';
import MatchingIPP from './Pages/Consumer/MatchingIPP';
import ChatWithExpert from './Pages/Consumer/ChatWithExpert';
import CombinationPatternC from './Pages/Consumer/CombinationPattern';
import IppProjectDetails from './Pages/Consumer/IPPProjectDetails';
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
import NewPage from './Pages/Generator/NewPage';
import ProfileConsumer from './Pages/Consumer/ProfileConsumer';
import ProfileGenerator from './Pages/Generator/ProfileGenerator';
import UserGen from './Pages/Generator/UserGen';
import PortfolioGen from './Pages/Generator/PortfolioGen';
import RequestedIPP from './Pages/Consumer/RequestedIPP';
import RequestedIPPOfGen from './Pages/Generator/RequestedIPPOfGen';
import OfferRecieved from './Pages/Consumer/Offers';
import OfferRecievedFromCons from './Pages/Generator/OfferRecievedFromCons';
import Notification from './Pages/Consumer/Notification';
import OptimizeCombination from './Pages/Generator/OptimizeCombination';
import NotificationGenerator from './Pages/Generator/NotificationGenerator';
import CombinationPattern from './Pages/Generator/CombinationPattern';
import TransactionWindow from './Pages/Consumer/TransactionWindow';
import TransactionMainPage from './Pages/Consumer/TransactionMainPage';
import TransactionMainPageGen from './Pages/Generator/TransactionMainPageGen';
import TransactionWindowGen from './Pages/Generator/TransactionWindowgen';
import RequirementsPage from './Pages/Consumer/RequirementPage';
import InvoicePage from './Pages/InvoicePage';
import { lastVisitedPage } from './Redux/Slices/Consumer/lastVisitedPageSlice';
import EmailVerification from './Pages/EmailVerification';

const CurrentPath = () => {
  const location = useLocation(); // useLocation must be inside a component
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'))?.user || null;
  //  console.log(requirementId);
 const userId=user?.id;


  useEffect(() => {
    const path=location.pathname;
    console.log("Current Path:", location.pathname);
    const data={
      last_visited_page:path,
      user_id:userId
    }
    const response=dispatch(lastVisitedPage(data));
    // console.log(response);
  }, [location]);
  return null; // This component does not need to render anything
};

function App() {
  return (
    <Router>
      <CurrentPath /> {/* Ensure this is rendered inside JSX */}
      <Routes>
        {/* Public routes */}
        <Route path="/consumer/login" element={<LoginC />} />
        <Route path="/generator/login" element={<LoginG />} />

        {/* Default Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="email/:token" element={<EmailVerification />} />
          <Route path="what-we-offer" element={<WhatWeOffer />} />



        {/* Routes with shared layout */}
          <Route path="what-we-offer" element={<WhatWeOffer />} />
        <Route element={<LayoutComponent />}>
          <Route path="offers" element={<OfferRecieved />} />
          <Route path="transaction-page" element={<TransactionMainPage />} />
          <Route path="subscription-plan" element={<SubscriptionPlans />} />

          {/* Consumer Routes */}
          <Route path="/consumer/*">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="matching-ipp" element={<MatchingIPP />} />
            <Route path="chat-page" element={<ChatWithExpert />} />
            <Route path="energy-consumption-table" element={<EnergyConsumptionTable />} />
            <Route path="consumption-pattern" element={<CombinationPatternC />} />
            <Route path="project-details" element={<IppProjectDetails />} />
            <Route path="requirement" element={<RequirementsPage />} />
            <Route path="annual-saving" element={<AnnualSvg />} />
            <Route path="subscription-plan" element={<SubscriptionPlans />} />
            <Route path="profile" element={<ProfileConsumer />} />
            <Route path="requested-ipp" element={<RequestedIPP />} />
            <Route path="offer-recieved-from-ipp" element={<OfferRecieved />} />
            <Route path="notification" element={<Notification />} />
            <Route path="transaction-window" element={<TransactionWindow />} />
            <Route path="invoice" element={<InvoicePage />} />
          </Route>

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
            <Route path="requested-ipp-gen" element={<RequestedIPPOfGen />} />
            <Route path="consumer-requests" element={<OfferRecievedFromCons />} />
            <Route path="new-page" element={<NewPage />} />
            <Route path="profile" element={<ProfileGenerator />} />
            <Route path="profile/user" element={<UserGen />} />
            <Route path="profile/portfolio" element={<PortfolioGen />} />
            <Route path="combination" element={<OptimizeCombination />} />
            <Route path="notificationgen" element={<NotificationGenerator />} />
            <Route path="transaction-window" element={<TransactionWindowGen />} />
            <Route path="invoice" element={<InvoicePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
