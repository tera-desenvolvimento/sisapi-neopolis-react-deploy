import React from "react";

import logo01 from "../img/logo-01.svg";
import sisapiLogo from "../img/sisapi-logo.svg";

const MailSent = () => {
    return (
        <React.Fragment>
            <div className="login-container">
                <a href="/login" className="back-button">Voltar</a>
                <img src={logo01} alt="Logo" className="w-btn" />
                <b>Sistema de Automação de Processo s Internos</b>
                
                <span className="sent">Para redefinir sua senha, acesse o link <br /> que foi encaminhado para o seu e-mail</span>

                <a href="/login" className="back">Acessar painel</a>
                
                <div className="logo-sisapi">
                    <img src={sisapiLogo} alt="Sisapi Logo" />
                </div>
            </div>
            <div className="pattern-rodape"></div>
        </React.Fragment>
    );
};

export default MailSent;
