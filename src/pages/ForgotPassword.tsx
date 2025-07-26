import React, { useState } from "react";

import logo01 from "../img/logo-01.svg";
import sisapiLogo from "../img/sisapi-logo.svg";

import "../style/login.css";

import { requestPasswordRecovery, IRecoverData } from "../controllers/user/requestPasswordRecovery.controller";
import { sendEmail, IEmailData } from "../controllers/misc/sendEmail.controller";

const ForgotPassword = () => {
    const [userId, setUserId] = useState("");
    const [docId, setDocId] = useState("");
    const [email, setEmail] = useState("");

    function handleDocIdChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDocId(event.target.value);
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data: IRecoverData = {
            email: email
        };

        requestPasswordRecovery(data)
            .then(response => {
                if (response.token) {
                    const emailInfoElement = document.getElementById("emailInfo");

                    const emailData: IEmailData = {
                        email: email,
                        subject: "Recuperação de Senha - Sisapi",
                        html: `Olá, para recuperar sua senha, acesse o seguinte link: <br/>
                        <a href="http://neopolis.sisapi.com.br/resetar-senha?token=${response.token}&userId=${response.userId}">Clique aqui para redefinir sua senha</a><br/>
                        <br>Se você não solicitou essa recuperação, por favor ignore este e-mail.`
                    };

                    sendEmail(emailData)
                        .then(() => {
                            if (emailInfoElement) {
                                emailInfoElement.innerText = "Código enviado para o e-mail. Verifique sua caixa de entrada.";
                                setTimeout(() => {
                                    window.location.href = '/email-enviado';
                                }, 3000);   
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao enviar e-mail:", error);
                        });
                } else {
                    const messageElement = document.getElementById("message");
                    if (messageElement) {
                        messageElement.innerText = "CPF ou e-mail digitado inválido";
                        messageElement.classList.remove("hidden");
                        setTimeout(() => {
                            messageElement.classList.add("hidden");
                        }, 3000);
                    }
                }
            })
            .catch(error => {
                console.error("Error during password recovery:", error);
            });
    }

    return (
        <React.Fragment>
            <div className="login-container">
                <a href="/login" className="back-button">Voltar</a>
                <img src={logo01} alt="Logo" className="w-btn" />
                <b>Sistema de Automação de Processos Internos</b>
                <span>Informe os dados para continuar</span>
                <form autoComplete='on' onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <input type="text" id="docId" name="docId" placeholder="000.000.000-00" required value={docId} onChange={handleDocIdChange} />
                    </div>
                    <div className="form-group">
                        <input type="email" id="email" name="email" placeholder="email@example.com" required value={email} onChange={handleEmailChange} />
                    </div>
                    <div className="form-group">
                        <span className="message hidden" id="message">CPF ou e-mail digitado inválido</span>
                    </div>
                    <div className="form-group">
                        <span id="emailInfo">O código para gerar uma nova senha chegará no seu e-mail</span>
                    </div>
                    <button type="submit">Resetar senha </button>
                </form>
                <div className="logo-sisapi">
                    <img src={sisapiLogo} alt="Sisapi Logo" />
                </div>
            </div>
            <div className="pattern-rodape"></div>
        </React.Fragment>
    );
};

export default ForgotPassword;
