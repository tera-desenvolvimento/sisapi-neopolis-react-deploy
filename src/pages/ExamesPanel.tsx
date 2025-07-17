import React from "react";

import logo01 from "../img/logo-01.svg";
import wppIcon from "../img/wpp-icon.svg";
import logoutIcon from "../img/logout.svg";

import "../style/exames.css";
import { getCookies, doLogout } from "../controllers/user/authenticate.controller";

function ExamesPanel() {
    const userData = getCookies("userData");

    return (
        <React.Fragment>
            <div className="exames-container">
                <div className="header-container">
                    <b>Exames para retirada:</b>
                    <img src={logo01} alt="Logo" className="logo" />
                </div>
                <div className="search-container">
                    <input type="text" placeholder="Digite tipo de exame, nome ou cpf do paciente"  id="searchInput"/>
                    <button id="searchExames">Pesquisar exame</button>
                </div>
                <div className="exames-list-container">
                    <table className="exames-table">
                        <thead>
                            <tr>
                                <th>Tipo de exame:</th>
                                <th>Nome do paciente:</th>
                                <th>Cpf:</th>
                                <th>Telefone:</th>
                                <th>Chegada:</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                            <tr className="exame-row">
                                <td className="exame-info start">Hemograma</td>
                                <td className="exame-info">João da Silva</td>
                                <td className="exame-info">123.456.789-00</td>
                                <td className="exame-info">(11) 98765-4321</td>
                                <td className="exame-info end">28/06/2025</td>
                                <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                <td className="btn-cell"><button className="btn">Entrega</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bottom-container">
                <div className="user-info-container">
                    <b id="user-name">{userData?.name}</b>
                    <button id="logout" onClick={doLogout}>
                        <img src={logoutIcon} alt="Sair" />
                        Trocar Módulo
                    </button>
                </div>

                <div className="buttons-container">
                    <button id="retireds">Consultar já retirados</button>
                    <button id="newExam">Cadastrar novo exame</button>
                </div>
            </div>
            <div className="pattern-rodape-light"></div>
        </React.Fragment>
    );
}

export default ExamesPanel;