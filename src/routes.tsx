import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ModuleSelector from "./pages/ModuleSelector";
import ExamesPanel from "./pages/ExamesPanel";
import DeliveredExames from "./pages/DeliveredExames";

const MyRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<Login />} />
                <Route path="/" element={<ModuleSelector />} />
                <Route path="/login" element={<Login />} />
                <Route path="/esqueci-minha-senha" element={<ForgotPassword />} />
                <Route path="/resetar-senha" element={<ResetPassword />} />
                <Route path="/exames" element={<ExamesPanel />} />
                <Route path="/exames-entregues" element={<DeliveredExames />} />
            </Routes>
        </Router>
    )
}

export default MyRoutes;