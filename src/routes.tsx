import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ModuleSelector from "./pages/ModuleSelector";

const MyRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<Login />} />
                <Route path="/" element={<ModuleSelector />} />
                <Route path="/login" element={<Login />} />
                <Route path="/esqueci-minha-senha" element={<ForgotPassword />} />
                <Route path="/resetar-senha" element={<ResetPassword />} />
            </Routes>
        </Router>
    )
}

export default MyRoutes;