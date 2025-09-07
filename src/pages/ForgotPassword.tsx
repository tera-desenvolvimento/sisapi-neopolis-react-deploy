import React, { useState } from "react";

import logo01 from "../img/logo-01.svg";
import sisapiLogoWhite from "../img/sisapi-logo-white.svg";

import { requestPasswordRecovery, IRecoverData } from "../controllers/user/requestPasswordRecovery.controller";
import { sendEmail, IEmailData } from "../controllers/misc/sendEmail.controller";

const ForgotPassword = () => {
    const [docId, setDocId] = useState("");
    const [email, setEmail] = useState("");

    function handleDocIdChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDocId(event.target.value);
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handleResetPassword() {;
        const data: IRecoverData = {
            email: email
        };

        requestPasswordRecovery(data)
            .then(response => {
                if (response.token) {
                    const emailData: IEmailData = {
                        email: email,
                        subject: "Recuperação de Senha - Sisapi",
                        html: `Olá, para recuperar sua senha, acesse o seguinte link: <br/>
                        <a href="${window.location.origin}/resetar-senha?token=${response.token}&userId=${response.userId}">Clique aqui para redefinir sua senha</a><br/>
                        <br>Se você não solicitou essa recuperação, por favor ignore este e-mail.`
                    };

                    sendEmail(emailData)
                        .then(() => {
                            setTimeout(() => {
                                window.location.href = '/email-enviado';
                            }, 3000);   
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
            <div className="new-login-container">
                <div className="main-wrapper">
                    <div className="central-wrapper">
                        <div className="city-logo-container">
                            <a href="/login" className="back-button">Voltar</a>
                            <span>Desenvolvido para</span>
                            <img src={logo01} alt="Logo" />
                        </div>

                        <small>Informe os dados para redefinir sua senha</small>

                        <form className="form-container" onSubmit={e => e.preventDefault()}>
                            <div className="form-wrapper">
                                <input type="text" name="docId" id="docIdEl" placeholder="Digite seu CPF" value={docId} onChange={handleDocIdChange} required/>
                            </div>
                            <div className="form-wrapper">
                                <input type="email" name="emai" id="email" placeholder="Digite seu email" value={email} onChange={handleEmailChange} required/>
                            </div>

                            <div className="form-wrapper">
                                <span className="message hidden" id="message">Informações não encontradas<br />Revise os dados e tente novamente.</span>
                            </div>

                            <div className="form-wrapper button-wrapper">
                                <button onClick={handleResetPassword}>Resetar senha</button>
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

export default ForgotPassword;