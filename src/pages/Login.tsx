import React from "react";

import logo01 from "../img/logo-01.svg";

import "../style/login.css";

const Login = () => {
    return (
        <React.Fragment>
            <div className="login-container">
                <img src={logo01} alt="Logo" />
                <b>SiGPI - Sistema de gestão de processos internos</b>
                <span>Faça login para continuar</span>
                <form>
                    <div className="form-group">
                        <input type="text" id="docId" name="docId" placeholder="000.000.000-00" required />
                    </div>
                    <div className="form-group">
                        <input type="password" id="password" name="password" placeholder="***********" required />
                    </div>
                    <div className="form-group">
                        <span className="message hidden" id="message">Código de acesso ou senha incorreto</span>
                    </div>
                    <div className="form-group">
                        <span>Esqueceu sua senha? </span><a href="/esqueci-minha-senha">Clique aqui</a>
                    </div>
                    <button type="submit">Acessar painel</button>
                </form>
            </div>
            <div className="pattern-rodape"></div>
        </React.Fragment>
    );
};

export default Login;
