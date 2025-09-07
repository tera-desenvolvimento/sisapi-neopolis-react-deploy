import React from "react";

import logo01 from "../img/logo-01.svg";
import sisapiLogoWhite from "../img/sisapi-logo-white.svg";

const MailSent = () => {
    return (
        <React.Fragment>
            <div className="new-login-container">
                <div className="main-wrapper">
                    <div className="central-wrapper">
                        <div className="city-logo-container">
                            <span>Desenvolvido para</span>
                            <img src={logo01} alt="Logo" />
                        </div>

                        <span className="sent">Para redefinir sua senha, acesse o link <br /> que foi encaminhado para o seu e-mail</span>

                        <a href="/login" className="back-button">Acessar painel</a>
                
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

export default MailSent;