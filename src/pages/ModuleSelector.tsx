import React from "react";
import '../controllers/user/checkSession.controller';

import logo01 from "../img/logo-01.svg";
import sisapiLogo from "../img/sisapi-logo.svg";

import "../style/login.css";

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
            <div className="login-container">
                <a href="/login" className="back-button">Voltar</a>
                <img src={logo01} alt="Logo" className="w-btn" />
                <b>Sistema de Automação de Processos Internos</b>
                <span>Selecione o módulo de uso</span>
                <form autoComplete='on' onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <select id="module" name="module" defaultValue="" required onChange={handleModuleSelection}>
                            <option value="" disabled>Selecione um módulo</option>
                            <option value="exames">Exames</option>
                        </select>
                    </div>
                </form>
                <div className="logo-sisapi">
                    <img src={sisapiLogo} alt="Sisapi Logo" />
                </div>
            </div>
            <div className="pattern-rodape"></div>
        </React.Fragment>
    );
};

export default ModuleSelector;
