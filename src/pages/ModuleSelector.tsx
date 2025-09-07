import React from "react";
import '../controllers/user/checkSession.controller';

import logo01 from "../img/logo-01.svg";
import sisapiLogoWhite from "../img/sisapi-logo-white.svg";

const ModuleSelector = () => {
    function handleModuleSelection(event: React.ChangeEvent<HTMLSelectElement>) {
        event.preventDefault()

        const selectedModule = event.target.value;
        if (selectedModule) {
            window.location.href = `/${selectedModule}`;
        }
    }

    return (
        <React.Fragment>
            <div className="new-login-container">
                <div className="main-wrapper">
                    <div className="central-wrapper">
                        <div className="city-logo-container">
                            <span>Desenvolvido para</span>
                            <img src={logo01} alt="Logo" />
                        </div>

                        <small>Selecione o seu módulo</small>

                        <form className="form-container" onSubmit={e => e.preventDefault()}>
                            <div className="form-wrapper password-wrapper">
                                <select id="module" name="module" defaultValue="" required onChange={handleModuleSelection}>
                                    <option value="" disabled>Selecione um módulo</option>
                                    <option value="exames">Exames</option>
                                    <option value="transportes">Transportes</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="system-logo-wrapper">
                    <span>Sistema de Automação<br />de Processos Internos.</span>
                    <img src={sisapiLogoWhite} alt="system-logo" />
                </div>
            </div>
        </React.Fragment>
    )
}

export default ModuleSelector;