import React from "react";

import logo01 from "../img/logo-01.svg";

import "../style/login.css";

const ResetPassword = () => {
    return (
        <React.Fragment>
            <div className="login-container">
                <img src={logo01} alt="Logo" />
                <b>SiGPI - Sistema de gestão de processos internos</b>
                <span>Insira sua nova senha</span>
                <form>
                    <div className="form-group">
                        <input type="password" id="password" name="password" placeholder="Digite sua nova senha" required />
                    </div>
                    <div className="form-group">
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirme sua nova senha" required />
                    </div>
                    <div className="form-group">
                        <span className="message hidden" id="message">Senhas não coincidem</span>
                    </div>
                    <button type="submit">Resetar senha</button>
                </form>
            </div>
            <div className="pattern-rodape"></div>
        </React.Fragment>
    );
};

export default ResetPassword;