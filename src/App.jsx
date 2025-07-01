/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useLocation, BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import TransactionWindowGen from './Pages/Generator/TransactionWindowgen';
import RequirementsPage from './Pages/Consumer/RequirementPage';
import InvoicePage from './Pages/InvoicePage';
import EmailVerification from './Pages/EmailVerification';
import StatusApproval from './Pages/TrackStatus';
import Agreements from './Pages/Agreements';
import GeneratorInput from './Pages/Generator/GeneratorInput';
import CombinationPatternCap from './Pages/Generator/CapacitySizingPattern.jsx';

// powerX
import PLayoutComponent from './appPowerX/Components/Layout/LayoutComponent';
import DashboardP from './appPowerX/Pages/Consumer/DashboardP';
import DayAhead from './appPowerX/Pages/Consumer/DayAhead';
import PlanYourTradePage from './appPowerX/Pages/Consumer/PlanYourTradePage';
import StatisticalInformation from './appPowerX/Pages/Consumer/StatisticalInformation';
import MonthAhead from './appPowerX/Pages/Consumer/MonthAhead';
import Planning from './appPowerX/Pages/Consumer/Planning';
import Trading from './appPowerX/Pages/Consumer/Trading';
import DashboardPG from './appPowerX/Pages/Generator/Dashboard';
import DayAheadG from './appPowerX/Pages/Generator/DayAheadG';
import MonthAheadG from './appPowerX/Pages/Generator/MonthAheadG';
import StatisticalInformationG from './appPowerX/Pages/Generator/StatisticalinformationG';
import PlanningG from './appPowerX/Pages/Generator/Planning';
import TradingG from './appPowerX/Pages/Generator/TradingG';
import PlanYourMonthTradePageG from './appPowerX/Pages/Generator/PlanYourMonthTradePageG';
import PlanDayTradePage from './appPowerX/Pages/Generator/PlanDayTradePage';
import ChatPage from './appPowerX/Pages/ChatPage';
import PlanMonthTrading from './appPowerX/Pages/Consumer/PlanMonthTrading';
import NotificationP from './appPowerX/Pages/Consumer/Notification';
import Subscription from './appPowerX/Pages/Consumer/Subscription';
import LoginPage from './appPowerX/Pages/LoginPage';
import ProfilePage from './appPowerX/Pages/Consumer/ProfilePage';
import NotificationG from './appPowerX/Pages/Generator/NotificationG';
import StatisticalInfoMonth from './appPowerX/Pages/Consumer/StatisticalInfoMonth';
import WhatWeOfferP from './appPowerX/Pages/WhatWeOfferP';
import TrackStatusP from './appPowerX/Pages/TrackStatus';
import ProtectedRoute from './ProtectedRoute';
import ProfileGen from './appPowerX/Pages/Generator/ProfileGen';

// 🔒 Global Auth Guard
function AuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/', '/px-login'];
    const emailRoute = location.pathname.startsWith('/email');

    const isPublic = publicRoutes.includes(location.pathname) || emailRoute;

    const user = localStorage.getItem('user');
    
    if (!user && !isPublic) {
      navigate('/', { replace: true });
    }
  }, [location]);

  return null;
}

// Clear storage if landing page is visited
function ClearLocalStorageOnLanding() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.clear();
    }
  }, [location.pathname]);
  return null;
}

function App() {
  useEffect(() => {
    const EXPIRY_HOURS = 24;
    const EXPIRY_MS = EXPIRY_HOURS * 60 * 60 * 1000;
    const LAST_ACTIVE_KEY = 'lastActiveTime';

    const updateLastActiveTime = () => {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    };

    const checkExpiry = () => {
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActive) {
        const now = Date.now();
        const diff = now - parseInt(lastActive, 10);
        if (diff > EXPIRY_MS) {
          localStorage.clear();
       // console.log('localStorage cleared due to 24h inactivity');
        }
      }
    };

    if (!localStorage.getItem(LAST_ACTIVE_KEY)) {
      updateLastActiveTime();
    }

    const intervalId = setInterval(checkExpiry, 60 * 1000);

    const resetTimer = () => updateLastActiveTime();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, []);

  return (
    <Router>
      <ClearLocalStorageOnLanding />
      <AuthGuard /> {/* 🔒 Global auth check */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="email/:token" element={<EmailVerification />} />
        <Route element={<ProtectedRoute />}>
          <Route path="what-we-offer" element={<WhatWeOffer />} />
          <Route element={<LayoutComponent />}>
            <Route path="offers" element={<OfferRecieved />} />
            <Route path="transaction-page" element={<TransactionMainPage />} />
            <Route path="subscription-plan" element={<SubscriptionPlans />} />
            <Route path="agreements" element={<Agreements />} />
            <Route path="chat-page" element={<ChatWithExpert />} />
            <Route path="notification" element={<Notification />} />
            <Route path="invoice" element={<InvoicePage />} />
            {/* Consumer Routes */}
            <Route path="/consumer/*">
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="matching-ipp" element={<MatchingIPP />} />
              <Route path="energy-consumption-table" element={<EnergyConsumptionTable />} />
              <Route path="consumption-pattern" element={<CombinationPatternC />} />
              <Route path="project-details" element={<IppProjectDetails />} />
              <Route path="requirement" element={<RequirementsPage />} />
              <Route path="annual-saving" element={<AnnualSvg />} />
              <Route path="profile" element={<ProfileConsumer />} />
              <Route path="requested-ipp" element={<RequestedIPP />} />
              <Route path="offer-recieved-from-ipp" element={<OfferRecieved />} />
              <Route path="transaction-window" element={<TransactionWindow />} />
              <Route path="status" element={<StatusApproval />} />
            </Route>
            {/* Generator Routes */}
            <Route path="/generator/*">
              <Route path="dashboard" element={<DashboardG />} />
              <Route path="what-we-offer" element={<WhatWeOfferG />} />
              <Route path="portfolio" element={<GenerationPortfolio />} />
              <Route path="matching-consumer" element={<MatchingConsumerPage />} />
              <Route path="energy-optimization" element={<EnergyOptimizationPage />} />
              <Route path="update-profile-details" element={<UpdateProfileDetails />} />
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
              <Route path="generatorInput" element={<GeneratorInput />} />
              <Route path="status" element={<StatusApproval />} />
              <Route path="capacity-sizing-pattern" element={<CombinationPatternCap />} />
            </Route>
          </Route>

          {/* PowerX Routes */}
          <Route path="px-login" element={<LoginPage />} />
          <Route path="px">
            <Route path="what-we-offer" element={<WhatWeOfferP />} />
            <Route element={<PLayoutComponent />}>
              <Route path="chat-page" element={<ChatPage />} />
              <Route path="track-status" element={<TrackStatusP />} />
              <Route path="notifications" element={<NotificationP />} />
              <Route path="consumer">
                <Route path="dashboard" element={<DashboardP />} />
                <Route path="day-ahead" element={<DayAhead />} />
                <Route path="plan-trade-page" element={<PlanYourTradePage />} />
                <Route path="statistical-information" element={<StatisticalInformation />} />
                <Route path="statistical-information-month" element={<StatisticalInfoMonth />} />
                <Route path="month-ahead" element={<MonthAhead />} />
                <Route path="plan-month-trade" element={<PlanMonthTrading />} />
                <Route path="planning" element={<Planning />} />
                <Route path="trading" element={<Trading />} />
                <Route path="powerx-subscription" element={<Subscription />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route path="generator">
                <Route path="dashboard" element={<DashboardPG />} />
                <Route path="day-ahead" element={<DayAheadG />} />
                <Route path="plan-month-trade-page" element={<PlanYourMonthTradePageG />} />
                <Route path="plan-day-trade-page" element={<PlanDayTradePage />} />
                <Route path="statistical-information" element={<StatisticalInformationG />} />
                <Route path="statistical-month-information" element={<StatisticalInfoMonth />} />
                <Route path="month-ahead" element={<MonthAheadG />} />
                <Route path="notification" element={<NotificationG />} />
                <Route path="profile" element={<ProfileGen />} />
                <Route path="planning" element={<PlanningG />} />
                <Route path="trading" element={<TradingG />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
