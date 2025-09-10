import React from "react";
import { resetPassword, IPasswordData } from "../controllers/user/resetPassword.controller"

import logo01 from "../img/logo-01.svg";
import sisapiLogoWhite from "../img/sisapi-logo-white.svg";

const ResetPassword = () => {
    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const form = event.currentTarget;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const searchParams = new URLSearchParams(window.location.search);

        if (password !== confirmPassword) {
            document.getElementById("message")!.classList.remove("hidden");
            return;
        }

        const userId = searchParams.get('userId') || "";
        const token = searchParams.get('token') || "";

        const passwordData: IPasswordData = {
            userId,
            token,
            newPassword: password
        };

        try {
            await resetPassword(passwordData);
            document.getElementById("message")!.innerText = "Senha resetada com sucesso!";
            document.getElementById("message")!.classList.remove("hidden");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (error) {
            console.error("Erro ao resetar a senha:", error);
            document.getElementById("message")!.innerText = "Erro ao resetar a senha. Tente novamente.";
            document.getElementById("message")!.classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("message")!.classList.add("hidden");
            }, 3000);
        }
    };

    return (
        <React.Fragment>
            <div className="new-login-container">
                <div className="main-wrapper">
                    <div className="central-wrapper">
                        <div className="city-logo-container">
                            <span>Desenvolvido para</span>
                            <img src={logo01} alt="Logo" />
                        </div>

                        <small>Insira sua nova senha</small>

                        <form className="form-container" onSubmit={handleResetPassword}>
                            <div className="form-wrapper password-wrapper">
                                <input type="password" name="password" id="password" placeholder="Digite sua nova senha" required/>
                            </div>
                            <div className="form-wrapper forgot-wrapper">
                                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirme sua nova senha" required/>
                            </div>

                            <div className="form-group">
                                <span className="message hidden" id="message">Senhas não coincidem</span>
                            </div>

                            <div className="form-wrapper button-wrapper">
                                <button type="submit">Resetar senha</button>
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

export default ResetPassword;