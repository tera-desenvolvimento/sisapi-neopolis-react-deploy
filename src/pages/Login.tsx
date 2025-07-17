import React, { useState } from "react";

import logo01 from "../img/logo-01.svg";

import "../style/login.css";

import { authenticate, IAuthenticateData, setCookie, ICookieData } from "../controllers/user/authenticate.controller";

const Login = () => {
    const [docId, setDocId] = useState("");
    const [password, setPassword] = useState("");

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDocId(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data: IAuthenticateData = {
            docId: docId,
            password: password
        };

        authenticate(data)
            .then(response => {
                if (response.data) {
                    setCookie({ name: 'sessionId', value: response.data.token });
                    setCookie({ name: 'userData', value: JSON.stringify(response.data) });
                    window.location.href = '/';
                } else {
                    const messageElement = document.getElementById("message");
                    if (messageElement) {
                        messageElement.classList.remove("hidden");
                        setTimeout(() => {
                            messageElement.classList.add("hidden");
                        }, 3000);
                    }
                }
            })
            .catch(error => {
                console.error("Error during authentication:", error);
            });
    }

    return (
        <React.Fragment>
            <div className="login-container">
                <img src={logo01} alt="Logo" />
                <b>SiGPI - Sistema de gestão de processos internos</b>
                <span>Faça login para continuar</span>
                <form autoComplete='on' onSubmit={handleLogin}>
                    <div className="form-group">
                        <input type="text" id="docId" name="docId" placeholder="000.000.000-00" required value={docId} onChange={handleEmailChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" id="password" name="password" placeholder="***********" required value={password} onChange={handlePasswordChange} />
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
