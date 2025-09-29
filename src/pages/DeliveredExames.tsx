import React, {useState, useMemo} from "react";

import MainHeader from "../components/MainHeader";

import { listDeliveredExames, IExame } from "../controllers/exame/listExames.controller";
import { searchExame, ISearch } from "../controllers/exame/searchExame.controller";

import "../style/exames.css";

function DeliveredExames() {
    const [asideMenuOpened, setAsideMenuOpened] = useState(false);
    const [deliveredExames, setDeliveredExames] = useState([] as IExame[]);
    const [queryStringVal, setQueryStringVal] = useState("");

    useMemo(() => { listDeliveredExames().then((response) => { setDeliveredExames(response.data); }); }, []);

    function doTheSearch(event: React.KeyboardEvent<HTMLInputElement>) {
        setQueryStringVal(event.currentTarget.value);

        if ((queryStringVal.length - 1) > 0) {
            const queryString: ISearch = {
                delivered: true,
                queryString: queryStringVal
            };

        searchExame(queryString)
            .then(response => {
                setDeliveredExames(response);
            })
        } else {
            listDeliveredExames().then((response) => { setDeliveredExames(response.data); });
        }
        }

    return (
        <React.Fragment>
            <MainHeader/>
            <div className="main-exames-container">
                <div className={asideMenuOpened ? "menu-aside-container open" : "menu-aside-container"}>
                    <div className="menu-wrapper">
                        <div className="menu-item">
                            <a href="/exames">
                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 13.435H13C13.55 13.435 14 13.885 14 14.435C14 14.985 13.55 15.435 13 15.435H1C0.45 15.435 0 14.985 0 14.435C0 13.885 0.45 13.435 1 13.435ZM6.01 9.335C5.23 10.105 3.97 10.105 3.19 9.325L1 7.135C0.45 6.585 0.46 5.695 1.03 5.165C1.57 4.645 2.43 4.665 2.95 5.185L4.6 6.835L11.03 0.405C11.57 -0.135 12.44 -0.135 12.98 0.405L13.02 0.445C13.56 0.985 13.56 1.865 13.01 2.405L6.01 9.335Z" fill="#323232"/>
                                </svg>

                                <span>Exames Disponíveis</span>
                            </a>
                        </div>
                        <div className="menu-item selected">
                            <a href="#">
                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 13.435H13C13.55 13.435 14 13.885 14 14.435C14 14.985 13.55 15.435 13 15.435H1C0.45 15.435 0 14.985 0 14.435C0 13.885 0.45 13.435 1 13.435ZM6.01 9.335C5.23 10.105 3.97 10.105 3.19 9.325L1 7.135C0.45 6.585 0.46 5.695 1.03 5.165C1.57 4.645 2.43 4.665 2.95 5.185L4.6 6.835L11.03 0.405C11.57 -0.135 12.44 -0.135 12.98 0.405L13.02 0.445C13.56 0.985 13.56 1.865 13.01 2.405L6.01 9.335Z" fill="#323232"/>
                                </svg>

                                <span>Exames Retirados</span>
                            </a>
                        </div>
                    </div>
                    <div className="support-wrapper">
                        <div className="menu-wrapper">
                            <div className="menu-item">
                                <a href="#">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.88 7.94L7.41 8.47C7.7 8.76 8.18 8.76 8.47 8.47C8.76 8.18 8.76 7.7 8.47 7.41L7.59 6.53C7.2 6.14 6.57 6.14 6.18 6.53L5.29 7.41C5 7.7 5 8.18 5.29 8.47C5.58 8.76 6.06 8.76 6.35 8.47L6.88 7.94ZM10 15.5C12.03 15.5 13.8 14.39 14.75 12.75C14.94 12.42 14.7 12 14.31 12H5.69C5.31 12 5.06 12.42 5.25 12.75C6.2 14.39 7.97 15.5 10 15.5ZM11.53 8.47C11.82 8.76 12.3 8.76 12.59 8.47L13.12 7.94L13.65 8.47C13.94 8.76 14.42 8.76 14.71 8.47C15 8.18 15 7.7 14.71 7.41L13.83 6.53C13.44 6.14 12.81 6.14 12.42 6.53L11.54 7.41C11.24 7.7 11.24 8.18 11.53 8.47ZM9.99 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 9.99 20C15.51 20 20 15.53 20 10C20 4.47 15.52 0 9.99 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18Z" fill="#333333"/>
                                    </svg>

                                    <span>Falar com suporte</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <button className={asideMenuOpened ? "close-menu open" : "close-menu"} onClick={() => setAsideMenuOpened(!asideMenuOpened)}>
                        {
                            asideMenuOpened ? <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.70753 2.5375L2.82753 6.4175L6.70753 10.2975C7.09753 10.6875 7.09753 11.3175 6.70753 11.7075C6.31753 12.0975 5.68753 12.0975 5.29753 11.7075L0.707531 7.1175C0.317531 6.7275 0.317531 6.0975 0.707531 5.7075L5.29753 1.1175C5.68753 0.727497 6.31753 0.727497 6.70753 1.1175C7.08753 1.5075 7.09753 2.1475 6.70753 2.5375Z" fill="#333333"/></svg> : <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.2925 9.4625L4.1725 5.5825L0.2925 1.7025C-0.0975 1.3125 -0.0975 0.6825 0.2925 0.2925C0.6825 -0.0975 1.3125 -0.0975 1.7025 0.2925L6.2925 4.8825C6.6825 5.2725 6.6825 5.9025 6.2925 6.2925L1.7025 10.8825C1.3125 11.2725 0.6825 11.2725 0.2925 10.8825C-0.0875 10.4925 -0.0975 9.8525 0.2925 9.4625Z" fill="#333333"/></svg>

                        }
                    </button>
                </div>

                <div className="content-container">
                    <div className="sub-header">
                        <b>Exames</b>
                        <span>Aqui você visualiza a lista de exames cadastrados disponíveis para ser retirados.</span>
                    </div>
                    <div className="listing-container">
                        <div className="buttons-wrapper">
                            <div className="search-wrapper">
                                <input type="text" name="searchInput" id="searchInput" placeholder="Busca por nome" onKeyUpCapture={doTheSearch}/>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.52638 8.38358H8.92426L8.71085 8.17781C9.62546 7.11087 10.098 5.65526 9.83887 4.1082C9.48065 1.98956 7.7124 0.297696 5.57831 0.0385818C2.3543 -0.35771 -0.351424 2.35537 0.0372858 5.57905C0.296426 7.71293 1.98846 9.481 4.10731 9.83919C5.65453 10.0983 7.11028 9.6258 8.17733 8.71128L8.38312 8.92467V9.52673L11.63 12.7657C11.9425 13.0781 12.4455 13.0781 12.758 12.7657L12.7656 12.758C13.0781 12.4456 13.0781 11.9426 12.7656 11.6301L9.52638 8.38358ZM4.95332 8.38358C3.0555 8.38358 1.52353 6.85176 1.52353 4.95413C1.52353 3.0565 3.0555 1.52468 4.95332 1.52468C6.85114 1.52468 8.38312 3.0565 8.38312 4.95413C8.38312 6.85176 6.85114 8.38358 4.95332 8.38358Z" fill="#6B7280"/>
                                </svg>
                            </div>


                            <button className="new-exame-button" onClick={() => window.location.pathname = "/new-exames"}>
                                Voltar para exames
                            </button>
                        </div>
                        <div className="exames-table-container">
                            <table className="exames-table delivered">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Tipo do exame</th>
                                        <th>CPF</th>
                                        <th>Telefone</th>
                                        <th>Data de chegada</th>
                                        <th>Retirado por:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        deliveredExames.map((exame) => (
                                            <tr>
                                                <td><span>{exame.patientName}</span></td>
                                                <td><span>{exame.type}</span></td>
                                                <td><span>{exame.docId}</span></td>
                                                <td><span>{exame.patientNumber}</span></td>
                                                <td>
                                                    <span>
                                                        {
                                                            new Date(exame.arrivedDate).toLocaleDateString("pt-BR", {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit'
                                                            })
                                                        }
                                                    </span>
                                                </td>
                                                <td><span>{exame.retiranteName}</span> ({exame.retiranteDocId}) - {
                                                    new Date(exame.retiradaDate).toLocaleDateString("pt-BR", {
                                                        month: 'short',
                                                        day: '2-digit'
                                                    })
                                                }</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default DeliveredExames;