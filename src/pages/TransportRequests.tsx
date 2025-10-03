import React, { useState } from "react";

import MainHeader from "../components/MainHeader";

import listTransportRequests from "../controllers/transports/requests/listTransportRequests.controller";
import declineTransportRequest from "../controllers/transports/requests/declineTransportRequest.controller";
import acceptTransportRequest from "../controllers/transports/requests/acceptTransportRequest.controller";
import listTransports from "../controllers/transports/listTransports.controller";
import WhapiImage from "../controllers/transports/requests/whapiImage.controller";

type TransportRequest = {
    _id: string,
    name: string,
    docId: string,
    tripDate: string,
    exitTime: string,
    address: string,
    phone: string,
    pickupLocation: string,
    destination: string,
    shedulingDocumentImage: string,
    requestStatus: string,
    createdAt: string,
}

type Patient = {
    name: string;
    docId: string;
    phone: string;
    address: string;
    pickupLocation: string;
    destination: string;
    notified: boolean;
}

type Transport = {
    date: string;
    exitTime: string;
    restTime: string;
    returnTime: string;
    arriveTime: string;
    destination: string;
    vehicleId: string;
    driverId: string;
    patients: Patient[];
    _id: string;
};

type modalData = {
    isError: boolean,
    message: string
}

function TransportRequests() {
    const [asideMenuOpened, setAsideMenuOpened] = useState(false);
    const [requests, setRequests] = useState<TransportRequest[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [docImageUrl, setDocImageUrl] = useState("");
    const [reasonId, setReasonId] = useState("");
    const [declineRequestId, setDeclineRequestId] = useState("");
    const [isError, setIsError] = useState(false);
    const [modalErrorOpen, setModalErrorOpen] = useState(false);

    if (!loaded) {
        (async function fetchTransportRequests() {
            const data = await listTransportRequests();
            if (data) {
                setRequests(data.data);
            }
        })();
        setLoaded(true);
    }

    function handleReasonId(event: React.ChangeEvent<HTMLSelectElement>) {
        setReasonId(event.currentTarget.value);
    }

    async function toggleSchedulingDocumentContainer(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const container = document.getElementById("doc-image");
        const imgUrl = await WhapiImage(event.currentTarget.dataset.imageId || "");
        setDocImageUrl(imgUrl);

        if (imgUrl && container) {
          container.classList.toggle("open");
        }
    }

    function toggleDeclineRequestContainer(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const container = document.getElementById("decline-form");
        const requestId = event.currentTarget.dataset.requestId || "";

        setDeclineRequestId(requestId);

        if (container) {
            container.classList.toggle("open");
        }
    }

    async function handleAcceptRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const requestId = event.currentTarget.dataset.requestId || "";
        const requestData = requests.find(req => req._id === requestId) as TransportRequest;
        const date = requestData.tripDate;
        const exitTime = requestData.exitTime;
        const filteredTransports = [] as Array<Transport>;
        const dispoTransports = [] as Array<string>;

        await listTransports(date)
            .then((response) => {
                response.trips.forEach((trip: Transport) => {
                    if (trip.exitTime === exitTime) {
                        filteredTransports.push(trip)
                    }
                })
            })

        filteredTransports.forEach(transport => {
            const transportId = transport._id;
            const patients = transport.patients;

            if (exitTime === "04:00") {
                if (patients.length < 14) {
                    dispoTransports.push(transportId)
                }
            } else if (exitTime === "06:00") {
                if (patients.length < 13) {
                    dispoTransports.push(transportId)
                }
            } else if (exitTime === "09:00") {
                if (patients.length < 14) {
                    dispoTransports.push(transportId)
                }
            }
        })

        if (dispoTransports.length) {
            await acceptTransportRequest(requestId, dispoTransports[0])
                .then(response => {
                    setRequests(requests.filter(req => req._id !== requestId));
                    handleModalMessage({
                        isError: false,
                        message: "Paciente agendado com sucesso"
                    })
                })
        } else {
             handleModalMessage({
                isError: true,
                message: "Sem vagas disponíveis para o horário ou carro ainda não criado"
            })
        }
        
    }

    async function handleDeclineRequest(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const requestId = declineRequestId;
        const reason = reasonId === "1" ? "Imagem do agendamento não legível" : reasonId === "2" ? "Documento de agendamento inválido" : "Vagas esgotadas para o carro selecionado";

        try {
            await declineTransportRequest(requestId, reason);
            setRequests(requests.filter(req => req._id !== requestId));

            document.getElementById("decline-form")?.classList.toggle("open");

            handleModalMessage({
                isError: false,
                message: "Solicitação reprovada com sucesso"
            })
        } catch (error) {
            console.error("Error declining transport request:", error);
        }
    }

    function handleModalMessage(data: modalData) {
        const isError = data.isError;
        const message = data.message;
        const messageElement = document.getElementById("warning-message") as HTMLSpanElement;

        setIsError(isError);
        messageElement.textContent = message;
        setModalErrorOpen(true);

        setTimeout(() => setModalErrorOpen(false), 10000);
    }

    return (
        <React.Fragment>
            <MainHeader/>
            <div className="main-transports-container">
                <div className={asideMenuOpened ? "menu-aside-container open" : "menu-aside-container"}>
                    <div className="menu-wrapper">
                        <div className="menu-item">
                            <a href="/transportes">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 14 16" fill="none">
                                    <path d="M10.8889 7.2H3.11111V8.8H10.8889V7.2ZM12.4444 1.6H11.6667V0H10.1111V1.6H3.88889V0H2.33333V1.6H1.55556C0.692222 1.6 0.00777777 2.32 0.00777777 3.2L0 14.4C0 15.28 0.692222 16 1.55556 16H12.4444C13.3 16 14 15.28 14 14.4V3.2C14 2.32 13.3 1.6 12.4444 1.6ZM12.4444 14.4H1.55556V5.6H12.4444V14.4ZM8.55556 10.4H3.11111V12H8.55556V10.4Z" fill="#333333"/>
                                </svg>

                                <span>Agendar Vagas</span>
                            </a>
                        </div>
                        <div className="menu-item">
                            <a href="/transportes/fixos">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14.1511 1.01C13.9733 0.42 13.4756 0 12.8889 0H3.11111C2.52444 0 2.03556 0.42 1.84889 1.01L0.0977777 6.68C0.0355555 6.89 0 7.11 0 7.34V14.5C0 15.33 0.595556 16 1.33333 16C2.07111 16 2.66667 15.33 2.66667 14.5V14H13.3333V14.5C13.3333 15.32 13.9289 16 14.6667 16C15.3956 16 16 15.33 16 14.5V7.34C16 7.12 15.9644 6.89 15.9022 6.68L14.1511 1.01ZM3.11111 11C2.37333 11 1.77778 10.33 1.77778 9.5C1.77778 8.67 2.37333 8 3.11111 8C3.84889 8 4.44444 8.67 4.44444 9.5C4.44444 10.33 3.84889 11 3.11111 11ZM12.8889 11C12.1511 11 11.5556 10.33 11.5556 9.5C11.5556 8.67 12.1511 8 12.8889 8C13.6267 8 14.2222 8.67 14.2222 9.5C14.2222 10.33 13.6267 11 12.8889 11ZM1.77778 6L2.90667 2.18C3.03111 1.78 3.36889 1.5 3.75111 1.5H12.2489C12.6311 1.5 12.9689 1.78 13.0933 2.18L14.2222 6H1.77778Z" fill="#333333"/>
                                </svg>

                                <span>Agendamento de carros fixos</span>
                            </a>
                        </div>
                        <div className="menu-item selected">
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M11.96 6.55138L7.432 11.1837C7.12 11.5029 6.616 11.5029 6.304 11.1837L4.04 8.86754C3.728 8.54835 3.728 8.03274 4.04 7.71355C4.352 7.39436 4.856 7.39436 5.168 7.71355L6.864 9.44862L10.824 5.39739C11.136 5.0782 11.64 5.0782 11.952 5.39739C12.272 5.71658 12.272 6.23219 11.96 6.55138ZM1.6 8C1.6 6.09305 2.416 4.38253 3.696 3.18762L4.92 4.43982C5.168 4.69354 5.6 4.51348 5.6 4.14519V0.634114C5.6 0.404953 5.424 0.224898 5.2 0.224898H1.768C1.408 0.224898 1.232 0.666851 1.488 0.920565L2.56 2.02545C0.992 3.51499 0 5.63473 0 8C0 11.8876 2.656 15.1449 6.208 15.9797C6.712 16.0943 7.2 15.7096 7.2 15.1776C7.2 14.793 6.936 14.4656 6.568 14.3756C3.728 13.7127 1.6 11.11 1.6 8ZM16 8C16 4.11245 13.344 0.85509 9.792 0.0202898C9.288 -0.0942906 8.8 0.290372 8.8 0.822353C8.8 1.20702 9.064 1.53439 9.432 1.62442C12.272 2.28735 14.4 4.88996 14.4 8C14.4 9.90695 13.584 11.6175 12.304 12.8124L11.08 11.5602C10.832 11.3065 10.4 11.4865 10.4 11.8548V15.3659C10.4 15.595 10.576 15.7751 10.8 15.7751H14.232C14.592 15.7751 14.768 15.3331 14.512 15.0794L13.44 13.9746C15.008 12.485 16 10.3653 16 8Z" fill="#333333"/>
                                </svg>

                                <span>Aprovação Whatsapp</span>
                            </a>
                        </div>
                        <div className="menu-item">
                            <a href={window.location.origin + "/boletim-transportes.pdf"} target="_blank" rel="noopener noreferrer">
                                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 5H3C1.34 5 0 6.34 0 8V12C0 13.1 0.9 14 2 14H4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V14H18C19.1 14 20 13.1 20 12V8C20 6.34 18.66 5 17 5ZM13 16H7C6.45 16 6 15.55 6 15V11H14V15C14 15.55 13.55 16 13 16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM15 0H5C4.45 0 4 0.45 4 1V3C4 3.55 4.45 4 5 4H15C15.55 4 16 3.55 16 3V1C16 0.45 15.55 0 15 0Z" fill="#323232"/>
                                </svg>

                                <span>Imprimir relatório de inspeção</span>
                            </a>
                        </div>
                    </div>
                    <div className="support-wrapper">
                        <div className="menu-wrapper">
                            <div className="menu-item">
                                <a href="#">
                                    <svg width="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <div className="separator">
                            <div className="sub-category">
                                <b>Transportes </b>
                                <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.222096 7.62081L3.16819 4.49597L0.222096 1.37114C-0.0740319 1.05705 -0.0740319 0.549664 0.222096 0.23557C0.518223 -0.0785235 0.996583 -0.0785235 1.29271 0.23557L4.7779 3.93222C5.07403 4.24631 5.07403 4.75369 4.7779 5.06779L1.29271 8.76443C0.996583 9.07852 0.518223 9.07852 0.222096 8.76443C-0.0664389 8.45034 -0.0740319 7.9349 0.222096 7.62081Z" fill="#6B7280"/></svg>
                                <b> Aprovação Whatsapp</b>
                            </div>
                            <span>Aqui você analisa as solicitações de transportes.</span>
                        </div>
                    </div>

                    <div className="transports-swiper">
                        <div className="listing-container transport requests active">
                            <div className="transport-table-container">
                                <table className="exames-table">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Endereço</th>
                                            <th>CPF</th>
                                            <th>Telefone</th>
                                            <th>Data</th>
                                            <th>Destino</th>
                                            <th>Doc. Agendamento</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            requests.map((request) => (
                                                request.requestStatus === "pending" ? 
                                                <tr key={request._id}>
                                                    <td>{request.name}</td>
                                                    <td>{request.address}</td>
                                                    <td>{request.docId}</td>
                                                    <td>{request.phone}</td>
                                                    <td>{request.tripDate} - {request.exitTime}</td>
                                                    <td>{request.destination}</td>
                                                    <td>
                                                        <button data-image-id={request.shedulingDocumentImage} className="show-doc" onClick={toggleSchedulingDocumentContainer}>
                                                            Exibir
                                                        </button>
                                                    </td>
                                                    <td className="buttons-cell requests">
                                                        <button className="edit-button" title="Aprovar solicitação" data-request-id={request._id} onClick={handleAcceptRequest}>
                                                            <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.1725 10.1625L1.7025 6.6925C1.3125 6.3025 0.6825 6.3025 0.2925 6.6925C-0.0975 7.0825 -0.0975 7.7125 0.2925 8.1025L4.4725 12.2825C4.8625 12.6725 5.4925 12.6725 5.8825 12.2825L16.4625 1.7025C16.8525 1.3125 16.8525 0.6825 16.4625 0.2925C16.0725 -0.0975 15.4425 -0.0975 15.0525 0.2925L5.1725 10.1625Z" fill="#004AB2"/>
                                                            </svg>
                                                        </button>
                                                        <button className="remove-button" title="Reprovar solicitação" data-request-id={request._id} onClick={toggleDeclineRequestContainer}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                                                                <path d="M0.838371 12.4103C0.838371 13.2635 1.5929 13.9615 2.51511 13.9615H9.22208C10.1443 13.9615 10.8988 13.2635 10.8988 12.4103V4.65385C10.8988 3.80064 10.1443 3.10256 9.22208 3.10256H2.51511C1.5929 3.10256 0.838371 3.80064 0.838371 4.65385V12.4103ZM8.80289 0.775641L8.20765 0.224936C8.05674 0.0853205 7.83877 0 7.62079 0H4.1164C3.89842 0 3.68045 0.0853205 3.52954 0.224936L2.9343 0.775641H0.838371C0.377267 0.775641 0 1.12468 0 1.55128C0 1.97788 0.377267 2.32692 0.838371 2.32692H10.8988C11.3599 2.32692 11.7372 1.97788 11.7372 1.55128C11.7372 1.12468 11.3599 0.775641 10.8988 0.775641H8.80289Z" fill="#F04F4F"/>
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                                : null
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             <div className="exame-form-container" id="doc-image">
                <div className="exame-form-wrapper" style={{ minWidth: "unset" }}>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <img id="schedulingDocumentImage" src={docImageUrl} alt="Documento de agendamento" style={{ maxHeight: "70vh", width: "auto" }} />
                        </div>

                        <div className="form-bottom-wrapper unique">
                            <button onClick={toggleSchedulingDocumentContainer}>
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="decline-form">
                <div className="exame-form-wrapper">
                    <div className="exame-type-form-header">
                        <button onClick={toggleDeclineRequestContainer}>Voltar</button>
                    </div>  
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Informe o motivo da reprovação:</span>
                            <div className="select-wrapper">
                                <select name="reason" id="reasonElement" onChange={handleReasonId}>
                                    <option value="">Selecione um motivo</option>
                                    <option value="1">Imagem do agendamento não legível</option>
                                    <option value="2">Documento de agendamento inválido</option>
                                    <option value="3">Vagas esgotadas para o carro selecionado</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-bottom-wrapper unique" id="decline-button">
                            <button onClick={handleDeclineRequest}>
                                Reprovar
                            </button>
                        </div>
                    </div>  
                </div>
            </div>

            <div className={`warning-container ${isError ? "error" : "success" } ${modalErrorOpen ? "open" : ""}`}>
                <button onClick={() => setModalErrorOpen(false)}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8925 0.3025C12.5025 -0.0874998 11.8725 -0.0874998 11.4825 0.3025L6.5925 5.1825L1.7025 0.2925C1.3125 -0.0975 0.6825 -0.0975 0.2925 0.2925C-0.0975 0.6825 -0.0975 1.3125 0.2925 1.7025L5.1825 6.5925L0.2925 11.4825C-0.0975 11.8725 -0.0975 12.5025 0.2925 12.8925C0.6825 13.2825 1.3125 13.2825 1.7025 12.8925L6.5925 8.0025L11.4825 12.8925C11.8725 13.2825 12.5025 13.2825 12.8925 12.8925C13.2825 12.5025 13.2825 11.8725 12.8925 11.4825L8.0025 6.5925L12.8925 1.7025C13.2725 1.3225 13.2725 0.6825 12.8925 0.3025Z" fill="#000000"/>
                    </svg>
                </button>
                <span id="warning-message">Dados inválidos</span>
            </div>
        </React.Fragment>
    )
}

export default TransportRequests;