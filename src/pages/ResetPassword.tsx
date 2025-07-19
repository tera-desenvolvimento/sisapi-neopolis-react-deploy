import React from "react";
import { resetPassword, IPasswordData } from "../controllers/user/resetPassword.controller"

import logo01 from "../img/logo-01.svg";

import "../style/login.css";

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
            <div className="login-container">
                <img src={logo01} alt="Logo" />
                <b>Sistema de Automação de Processos Internos</b>
                <span>Insira sua nova senha</span>
                <form autoComplete='on' onSubmit={handleResetPassword}>
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