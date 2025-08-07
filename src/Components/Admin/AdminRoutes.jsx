import { Routes, Route } from "react-router-dom";
import Login from "../../Pages/Admin/Login";
import LayoutComponent from "./Layout";
import Dashboard from "../../Pages/Admin/Dashboard";
import Consumer from "../../Pages/Admin/Consumer";
import Generator from "../../Pages/Admin/Generator";
import Notification from "../../Pages/Admin/Notification";
import Help from "../../Pages/Admin/Help";
import OnlineSub from "../../Pages/Admin/OnlineSub";
import OfflineSub from "../../Pages/Admin/OfflineSub";
import DemandData from "../../Pages/Admin/DemandData";
import GenerationData from "../../Pages/Admin/GenerationData";
import MasterTable from "../../Pages/Admin/MasterTable";
import GridTariff from "../../Pages/Admin/GridTariff";
import PeakHours from "../../Pages/Admin/PeakHours";
import NationalHoliday from "../../Pages/Admin/NationalHoliday";

import RETariffTable from "../../Pages/Admin/RETariffTable";
import CreditRatingVerification from "../../Pages/Admin/CreditRatingVerification";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<LayoutComponent />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/consumer" element={<Consumer />} />
        <Route path="/consumer/rating" element={<CreditRatingVerification />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/subscription/online" element={<OnlineSub />} />
        <Route path="/subscription/offline" element={<OfflineSub />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/help" element={<Help />} />
        <Route path="/demand" element={<DemandData />} />
        <Route path="/generation" element={<GenerationData />} />
        <Route path="/master-table" element={<MasterTable />} />
        <Route path="/r-e-tariff-table" element={<RETariffTable/>} />
        <Route path="/grid-tariff" element={<GridTariff />} />
        <Route path="/peak-hours" element={<PeakHours />} />
        <Route path="/national-holidays" element={<NationalHoliday />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
