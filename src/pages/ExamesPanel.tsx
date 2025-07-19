import React, {useState} from "react";
import '../controllers/user/checkSession.controller';

import logo01 from "../img/logo-01.svg";
import wppIcon from "../img/wpp-icon.svg";
import logoutIcon from "../img/logout.svg";

import "../style/exames.css";
import { getCookies, doLogout } from "../controllers/user/authenticate.controller";
import { listExames, IExame } from "../controllers/exame/listExames.controller";

function ExamesPanel() {
    const userData = getCookies("userData");
    const [exames, setExames] = useState<IExame[]>([]);

    listExames().then((response) => {
        setExames(response.data);
    }).catch((error) => {
        console.error("Erro ao listar exames:", error);
    });
    

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
                            {exames.map((exame) => (
                                <tr className="exame-row" key={exame.exameId}>
                                    <td className="exame-info start">{exame.type}</td>
                                    <td className="exame-info">{exame.patientName}</td>
                                    <td className="exame-info">{exame.docId}</td>
                                    <td className="exame-info">{exame.patientNumber}</td>
                                    <td className="exame-info end">
                                        {
                                            new Date(exame.arrivedDate).toLocaleDateString("pt-BR", {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })
                                        }
                                    </td>
                                    <td className="btn-cell"><button className="btn">Editar exame</button></td>
                                    <td className="btn-cell"><button className="btn"><img src={wppIcon} alt="WhatsApp" /></button></td>
                                    <td className="btn-cell"><button className="btn">Entrega</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bottom-container">
                <div className="user-info-container">
                    <b id="user-name">{userData?.name}</b>
                    <button id="logout" onClick={doLogout}>
                        <img src={logoutIcon} alt="Sair" />
                        Sair
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