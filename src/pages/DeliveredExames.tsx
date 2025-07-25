import React, {useState, useMemo} from "react";

import logo01 from "../img/logo-01.svg";
import logoutIcon from "../img/logout.svg";

import { listDeliveredExames, IExame } from "../controllers/exame/listExames.controller";
import { getCookies, doLogout } from "../controllers/user/authenticate.controller";
import { searchExame, ISearch } from "../controllers/exame/searchExame.controller";

function DeliveredExames() {
    const userData = getCookies("userData");
    const [deliveredExames, setDeliveredExames] = useState([] as IExame[]);
    const [queryStringVal, setQueryStringVal] = useState("");

    useMemo(() => {
        listDeliveredExames().then((response) => {
            setDeliveredExames(response.data);
        });
    }, []);
    
    function doTheSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setQueryStringVal(event.target.value);

        const queryString: ISearch = {
            delivered: true,
            queryString: queryStringVal
        };

        searchExame(queryString)
            .then(response => {
                setDeliveredExames(response);
            })
    }

    return (
        <React.Fragment>
            <div className="exames-container">
                <div className="header-container">
                    <b>Exames retirados:</b>
                    <img src={logo01} alt="Logo" className="logo" />
                </div>
                <div className="search-container">
                    <input type="text" placeholder="Digite nome do paciente"  id="searchInput" onChange={doTheSearch}/>
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
                                <th>Retirado Por:</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveredExames.map((exame) => (
                                <tr key={exame.exameId} className="exame-row delivered">
                                    <td className="exame-info start">{exame.type}</td>
                                    <td className="exame-info">{exame.patientName}</td>
                                    <td className="exame-info">{exame.docId}</td>
                                    <td className="exame-info">{exame.patientNumber}</td>
                                    <td className="exame-info">{
                                            new Date(exame.arrivedDate).toLocaleDateString("pt-BR", {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })
                                        }</td>
                                    <td className="exame-info end">{exame.retiranteName} ({exame.retiranteDocId}) - {
                                        new Date(exame.retiradaDate).toLocaleDateString("pt-BR", {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })
                                    }</td>
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
                    <a href="/exames">Consultar exames disponíveis</a>
                </div>
            </div>
        </React.Fragment>
    );
}

export default DeliveredExames;