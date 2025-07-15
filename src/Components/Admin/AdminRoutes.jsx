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

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<LayoutComponent/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/consumer" element={<Consumer />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/subscription/online" element={<OnlineSub />} />
        <Route path="/subscription/offline" element={<OfflineSub />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/help" element={<Help />} />
        <Route path="/demand" element={<DemandData />} />
        </Route>
    </Routes>
  )
}

export default AdminRoutes
