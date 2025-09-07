import React, { useState } from "react";
import { authenticate, IAuthenticateData, setCookie } from "../controllers/user/authenticate.controller";

import logo01 from "../img/logo-01.svg";
import sisapiLogoWhite from "../img/sisapi-logo-white.svg";

import "../style/login.css";

const Login = () => {
    const [docId, setDocId] = useState("");
    const [password, setPassword] = useState("");
    const [passVisible, setPassVisible] = useState(false);

    function handleDocIdChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDocId(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    function togglePassVisible() {
        setPassVisible(!passVisible);
    }

    function handleLogin() {
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
                    if (response.message === "USER_NOT_FOUND") {
                        const messageElement = document.getElementById("message") as HTMLSpanElement;
                        messageElement.innerText = "Código de identificação incorreto.\nRevise as informações e tente novamente.";

                        if (messageElement) {
                            messageElement.classList.remove("hidden");
                            setTimeout(() => {
                                messageElement.classList.add("hidden");
                            }, 3000);
                        }
                    } else if (response.message === "PASSWORD_MISMATCH"){
                        const messageElement = document.getElementById("message") as HTMLSpanElement;
                        messageElement.innerText = "Senha incorreta.\nRevise as informações e tente novamente.";

                        if (messageElement) {
                            messageElement.classList.remove("hidden");
                            setTimeout(() => {
                                messageElement.classList.add("hidden");
                            }, 3000);
                        }
                    } else {
                        const messageElement = document.getElementById("message") as HTMLSpanElement;
                        messageElement.innerText = "Erro ao processar sua solicitação";

                        if (messageElement) {
                            messageElement.classList.remove("hidden");
                            setTimeout(() => {
                                messageElement.classList.add("hidden");
                            }, 3000);
                        }
                    }
                }
            })
            .catch(error => {
                console.error("Error during authentication:", error);
            });
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

                        <small>Faça login para continuar</small>

                        <form className="form-container" onSubmit={e => e.preventDefault()}>
                            <div className="form-wrapper">
                                <input type="text" name="docId" id="docIdEl" placeholder="Digite seu CPF" value={docId} onChange={handleDocIdChange} required/>
                            </div>
                            <div className="form-wrapper password-wrapper">
                                <input type={passVisible ? "text" : "password"} name="password" id="passwordEl" placeholder="Digite sua senha" value={password} onChange={handlePasswordChange} required/>
                                <label htmlFor="passChanger" className="passIcon">
                                    {
                                        passVisible ? <svg width="20" height="14" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M23.2257 6.15139C20.7897 2.39284 16.6306 0.106901 12.1518 0.0648804C7.67305 0.106901 3.51401 2.39284 1.07795 6.15139C-0.205832 8.03542 -0.205832 10.5132 1.07795 12.3972C3.51263 16.1581 7.67192 18.4464 12.1519 18.4898C16.6306 18.4478 20.7897 16.1618 23.2258 12.4033C24.5122 10.5178 24.5122 8.03679 23.2257 6.15139ZM20.733 10.689C18.8732 13.639 15.6391 15.4388 12.1518 15.4647C8.66458 15.4389 5.4305 13.639 3.57058 10.689C2.99076 9.8372 2.99076 8.71743 3.57058 7.86563C5.43046 4.91564 8.66453 3.11584 12.1518 3.08998C15.639 3.11579 18.8731 4.91564 20.733 7.86563C21.3129 8.71743 21.3129 9.8372 20.733 10.689Z" fill="#374957"/>
                                                            <path d="M12.1521 13.3106C14.3797 13.3106 16.1856 11.5048 16.1856 9.27717C16.1856 7.04955 14.3797 5.24371 12.1521 5.24371C9.92449 5.24371 8.11865 7.04955 8.11865 9.27717C8.11865 11.5048 9.92449 13.3106 12.1521 13.3106Z" fill="#374957"/>
                                                        </svg>
                                                        
                                                    :  <svg width="20" height="19" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M23.3524 9.09982C22.5721 7.96388 21.6431 6.93756 20.5903 6.04831L23.431 3.20857C24.0047 2.60125 23.9774 1.64389 23.3701 1.07027C22.7865 0.519053 21.874 0.519715 21.2912 1.07173L18.0178 4.34608C16.2359 3.45565 14.2688 2.99888 12.2768 3.01292C7.79773 3.05579 3.63849 5.34158 1.2013 9.09982C-0.0802834 10.9847 -0.0802834 13.4611 1.2013 15.346C1.98158 16.482 2.91053 17.5083 3.96338 18.3975L1.12264 21.2403C0.531721 21.8312 0.531721 22.7892 1.12264 23.3801C1.71356 23.971 2.67163 23.971 3.26251 23.3801L6.53586 20.1058C8.31779 20.9962 10.2849 21.453 12.2768 21.4389C16.7559 21.3962 20.9152 19.1103 23.3524 15.3521C24.6367 13.4659 24.6367 10.986 23.3524 9.09982ZM3.69616 13.6377C3.11545 12.7861 3.11545 11.6658 3.69616 10.8142C5.55567 7.86405 8.78964 6.06405 12.2768 6.03824C13.452 6.03253 14.6187 6.23749 15.7216 6.6433L13.852 8.51193C11.8014 7.64141 9.43331 8.5981 8.56284 10.6487C8.13523 11.656 8.13523 12.7938 8.56284 13.8011L6.10532 16.2597C5.17822 15.5083 4.36654 14.6249 3.69616 13.6377ZM20.8575 13.6377C18.998 16.5879 15.764 18.3878 12.2768 18.4137C11.1017 18.4194 9.93494 18.2144 8.83204 17.8086L10.7017 15.939C12.7523 16.8095 15.1204 15.8528 15.9908 13.8022C16.4184 12.7949 16.4184 11.6571 15.9908 10.6498L18.4484 8.19229C19.3754 8.94364 20.1871 9.82703 20.8575 10.8142C21.4382 11.6658 21.4382 12.7861 20.8575 13.6377Z" fill="#374957"/>
                                                        </svg>
                                                        
                                    }
                                </label>
                                <input type="checkbox" name="passChanger" id="passChanger" style={{ display: "none" }} checked={passVisible} onChange={togglePassVisible}/>
                            </div>
                            <div className="form-wrapper forgot-wrapper">
                                <span>Esqueceu sua senha?</span>
                                <a href="/esqueci-minha-senha">Clique aqui</a>
                            </div>

                            <div className="form-wrapper">
                                <span className="message hidden" id="message">Código de identificação ou senha incorreto</span>
                            </div>

                            <div className="form-wrapper button-wrapper">
                                <button onClick={handleLogin}>Acessar</button>
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

export default Login;