import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ModuleSelector from "./pages/ModuleSelector";
import ExamesPanel from "./pages/ExamesPanel";
import DeliveredExames from "./pages/DeliveredExames";
import MailSent from "./pages/MailSent";
import TransportsPanel from "./pages/TransportsPanel";
import PrintTransport from "./pages/PrintTransport";
import FixedTransports from "./pages/FixedTransposts";
import PrintFixedTransport from "./pages/PrintFixedTransport";
import TransportRequests from "./pages/TransportRequests";

const MyRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ModuleSelector />} />
                <Route path="/login" element={<Login />} />
                <Route path="/esqueci-minha-senha" element={<ForgotPassword />} />
                <Route path="/resetar-senha" element={<ResetPassword />} />
                <Route path="/exames" element={<ExamesPanel />} />
                <Route path="/exames-entregues" element={<DeliveredExames />} />
                <Route path="/email-enviado" element={<MailSent/>}/>
                <Route path="/transportes" element={<TransportsPanel />} />
                <Route path="/transportes/fixos" element={<FixedTransports/>} />
                <Route path="/transportes/imprimir/:id" element={<PrintTransport />} />
                <Route path="/transportes/fixos/imprimir/:id" element={<PrintFixedTransport/>} />
                <Route path="/transportes/solicitacoes" element={<TransportRequests/>} />
            </Routes>
        </Router>
    )
}

export default MyRoutes;