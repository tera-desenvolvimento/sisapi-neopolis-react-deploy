import React from "react";

import logo01 from "../img/logo-01.svg";

import "../style/login.css";

const ModuleSelector = () => {
    return (
        <React.Fragment>
            <div className="login-container">
                <a href="/login" className="back-button">Voltar</a>
                <img src={logo01} alt="Logo" className="w-btn" />
                <b>SiGPI - Sistema de gestão de processos internos</b>
                <span>Selecione o módulo de uso</span>
                <form>
                    <div className="form-group">
                        <select id="module" name="module" defaultValue="" required>
                            <option value="" disabled>Selecione um módulo</option>
                            <option value="admin">Administração</option>
                            <option value="exames">Exames</option>
                        </select>
                    </div>
                    <button type="submit">Acessar painel</button>
                </form>
            </div>
            <div className="pattern-rodape"></div>
        </React.Fragment>
    );
};

export default ModuleSelector;
