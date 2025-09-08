import React, { useState } from "react";
import '../controllers/user/checkSession.controller';

import logo01 from "../img/logo-01.svg";
import sisapiLogoWhite from "../img/sisapi-logo-white.svg";
import selectArrowImg from "../img/select-arrow.svg";
import selectArrowOpenImg from "../img/select-arrow-open.svg";

const ModuleSelector = () => {
    const [menuOpened, setMenuOpened] = useState(false);        

    function handleMenuOpened () {
        setMenuOpened(!menuOpened);
    }

    function handleModuleSelection(selectedModule: string) {
        window.location.href = `/${selectedModule}`;
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
                            <div className="form-wrapper">
                                <button id="showOptions" onClick={handleMenuOpened}>
                                    <span>Clique para escolher um módulo</span>
                                    <img src={menuOpened ? selectArrowOpenImg : selectArrowImg} alt="" />
                                </button>
                            </div>
                            <div className="form-wrapper">
                                <div className={menuOpened ? "modules-wrapper opened" : "modules-wrapper" }>
                                    <button onClick={() => handleModuleSelection("exames")}>Resultados de exames</button>
                                    <button onClick={() => handleModuleSelection("transportes")}>Transportes</button>
                                </div>
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