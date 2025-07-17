import React from "react";

import logo01 from "../img/logo-01.svg";

import "../style/login.css";

const ForgotPassword = () => {
    return (
        <React.Fragment>
            <div className="login-container">
                <a href="/login" className="back-button">Voltar</a>
                <img src={logo01} alt="Logo" className="w-btn" />
                <b>SiGPI - Sistema de gestão de processos internos</b>
                <span>Informe os dados para continuar</span>
                <form autoComplete='on' onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <input type="text" id="docId" name="docId" placeholder="000.000.000-00" required />
                    </div>
                    <div className="form-group">
                        <input type="email" id="email" name="email" placeholder="email@example.com" required />
                    </div>
                    <div className="form-group">
                        <span className="message hidden" id="message">CPF ou e-mail digitado inválido</span>
                    </div>
                    <div className="form-group">
                        <span>O código para gerar uma nova senha chegará no seu e-mail</span>
                    </div>
                    <button type="submit">Resetar senha </button>
                </form>
            </div>
            <div className="pattern-rodape"></div>
        </React.Fragment>
    );
};

export default ForgotPassword;
