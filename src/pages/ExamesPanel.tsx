import React, {useState, useMemo} from "react";

import MainHeader from "../components/MainHeader";

import { listExames, IExame, IResponse } from "../controllers/exame/listExames.controller";
import { searchExame, ISearch } from "../controllers/exame/searchExame.controller";
import { listExameTypes, IExameType, IExameResponse} from "../controllers/exame/listExameTypes.controller";
import { ICreateExame, createExame } from "../controllers/exame/createExame.controller";
import { IEditExame, editExame } from "../controllers/exame/editExame.controller";
import { notifyPacient, INotifyResponse } from "../controllers/exame/notifyPacient.controller";
import { createExameType } from "../controllers/exame/createExameType.controller";
import { removeExameType } from "../controllers/exame/removeExameType.controller";
import { IDeliverExame, deliverExame } from "../controllers/exame/deliverExame.controller";
import { removeExame, IRemoveData } from "../controllers/exame/removeExame.controller";

import "../style/exames.css";

type modalData = {
    isError: boolean,
    message: string
}

function ExamesPanel() {
    const [asideMenuOpened, setAsideMenuOpened] = useState(false);
    const [exames, setExames] = useState<IExame[]>([]);
    const [exameTypes, setExameTypes] = useState<IExameType[]>([]);
    const [queryStringVal, setQueryStringVal] = useState("");
    const [typesDropdownOpen, setTypesDropdownOpen] = useState(false);
    const [type, setType] = useState("");
    const [isError, setIsError] = useState(false);
    const [modalErrorOpen, setModalErrorOpen] = useState(false);

    const [newExameData, setNewExameData] = useState({} as ICreateExame);
    const [editExameData, setEditExameData] = useState({} as IEditExame);

    const [patientNameDelivered, setPatientNameDelivered] = useState("");
    const [patientDocIdDelivered, setPatientDocIdDelivered] = useState("");
    const [isRetiradoPeloPaciente, setIsRetiradoPeloPaciente] = useState(false);
    const [retiranteName, setRetiranteName] = useState("");
    const [retiranteDocId, setRetiranteDocId] = useState("");

    const [removeData, setRemoveData] = useState({} as IRemoveData);

    useMemo(() => listExames().then((response: IResponse) => { setExames(response.data); }), []);
    useMemo(() => listExameTypes().then((response: IExameResponse) => { setExameTypes(response.data) }), []);

    function doTheSearch(event: React.KeyboardEvent<HTMLInputElement>) {
        setQueryStringVal(event.currentTarget.value);

        if ((queryStringVal.length - 1) > 0) {
            const queryString: ISearch = {
                delivered: false,
                queryString: queryStringVal
            };

        searchExame(queryString)
            .then(response => {
                setExames(response);
            })
        } else {
            listExames().then((response: IResponse) => { setExames(response.data); })
        }
    }

    function toggleCreateExameForm() {
        const formContainer = document.getElementById("create-exame");

        if (formContainer) {
            formContainer.classList.toggle("open");
        }
    }

    function toggleEditExameForm(event: React.MouseEvent<HTMLButtonElement>) {
        toggleEditeExame(event.currentTarget.dataset.exameId as string);
    }

    function handleSetType(event: React.MouseEvent<HTMLButtonElement>) {
        const selectedType = event.currentTarget.dataset.exameType as string;
        const form = event.currentTarget.dataset.form as string;

        setType(selectedType);
        setTypesDropdownOpen(false);

        switch (form) {
            case "create":
                setNewExameData({
                    ...newExameData,
                    type: selectedType
                });
                
                break;
            case "edit":
                setEditExameData({
                    ...editExameData,
                    type: selectedType
                })

                break
            default:
                break;
        }
    }

    function createNewExameType() {
        const exameTypeInput = document.getElementById("typeNameEl") as HTMLInputElement;
        const newExameType = exameTypeInput.value.trim();

        if (newExameType != "") {
            createExameType(newExameType)
                .then((response) => {
                    setExameTypes([...exameTypes, response.data]);
                    exameTypeInput.value = "";

                    handleModalMessage({
                        isError: false,
                        message: "Tipo de exame adicionado com sucesso"
                    })
                })
                .catch((error) => {
                    handleModalMessage({
                        isError: true,
                        message: "Erro ao adicionar um noto tipo de exame"
                    })

                    console.log(error);
                });
        } else {
            handleModalMessage({
                isError: true,
                message: "Valor do tipo do exame não pode ser nulo"
            })
        }
    }

    function excludeExameType(event: React.MouseEvent<HTMLButtonElement>) {
        const exameType = (event.target as HTMLButtonElement).dataset.exameType;
        console.log(exameType);

        if (exameType) {
            removeExameType(exameType)
                .then(() => {
                    setExameTypes(exameTypes.filter(type => type.type !== exameType));
                })
                .catch((error) => {
                    console.error("Erro ao remover tipo de exame:", error);
                });
        }
    }

    function toggleAddExameTypeForm() {
        const addExameTypeForm = document.getElementById("create-exame-type");

        if (addExameTypeForm) {
            addExameTypeForm.classList.toggle("open");
            toggleCreateExameForm();
        }
    }

    function handleNewExameDataChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.id === "newDocIdEl"){
            var docId = event.target.value;
            docId = docId.replace(/[^\d]/g, "");
            docId = docId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            setNewExameData({
                ...newExameData,
                docId: docId
            });
        } else {
            setNewExameData({
                ...newExameData,
                [event.target.name]: event.target.value
            });
        }
    }

    function createNewExame() {
        console.log(newExameData);
        if (newExameData.docId === "" || newExameData.patientName === "" || newExameData.patientNumber === "" || newExameData.type === "" || !newExameData.docId || !newExameData.patientName || !newExameData.patientNumber || !newExameData.type) {
            handleModalMessage({
                isError: true,
                message: "Preencha todos os dados do exame para continuar"
            })
        } else {
            createExame(newExameData)
                .then((response) => {
                        setExames([...exames, response.data]);

                        var clearedNewExameData: ICreateExame = {
                            docId: "",
                            type: "",
                            patientName: "",
                            patientNumber: ""
                        }

                        setType("");

                        handleModalMessage({
                            isError: false,
                            message: "Exame criado com sucesso"
                        })

                        setNewExameData(clearedNewExameData);

                        toggleCreateExameForm();
                    })
                    .catch((error) => {
                        handleModalMessage({
                            isError: true,
                            message: "Erro ao criar exame"
                        })

                        console.error(error);
                    });
        }
    }

    function toggleEditeExame(exameId: string) {
        const editExameContainer = document.getElementById("edit-exame");

        if (editExameContainer) {
            editExameContainer.classList.toggle("open");

            const exame = exames.find((ex) => ex.exameId === exameId);

            if (exame) {
                editExameData.arrivedDate = new Date(exame.arrivedDate).toISOString().split("T")[0] || "";
                editExameData.docId = exame.docId || "";
                editExameData.exameId = exame.exameId || "";
                editExameData.patientName = exame.patientName || "";
                editExameData.patientNumber = exame.patientNumber || "";
                editExameData.type = exame.type || "";

                setType(exame.type || "");
            }
        }
    }

    function handleEditExameChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.id === "editDocIdEl"){
            var docId = event.target.value;
            docId = docId.replace(/[^\d]/g, "");
            docId = docId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            setEditExameData({
                ...editExameData,
                docId: docId
            });
        } else {
            setEditExameData({
                ...editExameData,
                [event.target.name]: event.target.value
            });
        }

        console.log(editExameData);
    }

    function handleEditingArriveDate(event: React.ChangeEvent<HTMLInputElement>) {
        const newDate = new Date(event.target.value);
        newDate.setHours(newDate.getHours() + 3);

        setEditExameData({
            ...editExameData,
            [event.target.name]: newDate.toISOString()
        });

        console.log(editExameData);
    }

    function updateExame() {
        if (editExameData.docId === "" || editExameData.patientName === "" || editExameData.patientNumber === "" || editExameData.type === "" || editExameData.arrivedDate === ""|| !editExameData.docId || !editExameData.patientName || !editExameData.patientNumber || !editExameData.type || !editExameData.arrivedDate) {
            handleModalMessage({
                isError: true,
                message: "Preencha todos os dados do exame para continuar"
            })
        } else {
            editExame(editExameData)
                .then(response => {
                    console.log(response);
                    const updatedExames = exames.map((exame) =>
                        exame.exameId === editExameData.exameId
                            ? {
                                ...exame,
                                ...editExameData
                            }
                            : exame
                    );

                    handleModalMessage({
                        isError: false,
                        message: "Exame alterado com sucesso"
                    })

                    setExames(updatedExames);
                    toggleEditeExame("");
                }).catch(error => console.log(error))
        }

    }

    function handleNotifyPacient(event: React.MouseEvent<HTMLButtonElement>) {
        const exameId = (event.currentTarget as HTMLButtonElement).dataset.exameId;
        if (exameId) {
            notifyPacient(exameId)
                .then((response: INotifyResponse) => {
                    if (response.data.success) {
                        const updatedExames = exames.map((exame) => {
                            if (exame.exameId === exameId) {
                                return {...exame, alerted: true };
                            }
                            return exame;
                        });
                        setExames(updatedExames);

                        handleModalMessage({
                            isError: false,
                            message: "Notificação enviada com sucesso"
                        })
                    } else {
                        handleModalMessage({
                            isError: true,
                            message: "Erro ao notificar paciente"
                        })

                        console.error("Erro ao notificar paciente:", response.message);
                    }
                })
                .catch((error) => {
                    handleModalMessage({
                        isError: true,
                        message: "Erro ao notificar paciente"
                    })
                    console.error("Erro ao notificar paciente:", error);
                });
        }
    }

    function handleRetiranteNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRetiranteName(event.target.value);
    }

    function handleRetiranteDocIdChange(event: React.ChangeEvent<HTMLInputElement>) {
        var docId = event.target.value;
            docId = docId.replace(/[^\d]/g, "");
            docId = docId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

        setRetiranteDocId(docId);
    }

    function toggleEntregaExame(event: React.MouseEvent<HTMLButtonElement>) {
        const exameId = (event.currentTarget as HTMLButtonElement).dataset.exameId;

        if (exameId) {
            const retiradaContainer = document.getElementById("deliver-exame");
            if (retiradaContainer) {
                retiradaContainer.classList.toggle("open");
                const exame = exames.find((ex) => ex.exameId === exameId);
                if (exame) {
                    const deliverButton = document.getElementById("deliver-button") as HTMLButtonElement;
                    if (deliverButton) {
                        deliverButton.setAttribute("data-exame-id", exame.exameId);
                    }
                    const retiradaTipoEl = document.getElementById("retiradaTipoEl");
                    const retiradaNomeEl = document.getElementById("retiradaNomeEl");
                    const retiradaCpfEl = document.getElementById("retiradaCpfEl");
                    const retiradaTelefoneEl = document.getElementById("retiradaTelefoneEl");
                    if (retiradaTipoEl && retiradaNomeEl && retiradaCpfEl && retiradaTelefoneEl) {
                        retiradaTipoEl.textContent = exame.type;
                        retiradaNomeEl.textContent = exame.patientName;
                        retiradaCpfEl.textContent = exame.docId;
                        retiradaTelefoneEl.textContent = exame.patientNumber;

                        setPatientNameDelivered(exame.patientName);
                        setPatientDocIdDelivered(exame.docId);
                    }
                }
            }
        }
    }

    function handleRetiradoPeloPacienteChange(event: React.ChangeEvent<HTMLInputElement>) {
        setIsRetiradoPeloPaciente(event.target.checked);

        if (event.target.checked) {
            var docId = patientDocIdDelivered;
                docId = docId.replace(/[^\d]/g, "");
                docId = docId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            setRetiranteName(patientNameDelivered);
            setRetiranteDocId(docId);
        } else {
            setRetiranteName("");
            setRetiranteDocId("");
        }
    }

    function registerDeliveredExame(event: React.MouseEvent<HTMLButtonElement>) {
        const exameId = event.currentTarget.getAttribute("data-exame-id");
        if (!exameId) {
            handleModalMessage({
                isError: true,
                message: "Id de Exame não encontrado no formulário de retirada."
            })
        }

        const retiradaNameInput = document.getElementById("retiradaNameIn") as HTMLInputElement;
        const retiradaDocIdInput = document.getElementById("retiradaCpfIn") as HTMLInputElement;
        const retiradaName = retiradaNameInput.value.trim();
        const retiradaDocId = retiradaDocIdInput.value;

        if (retiradaName && retiradaDocId) {
            if (exameId) {
                const data: IDeliverExame = {
                    exameId,
                    retiranteDocId: retiradaDocId,
                    retiranteName: retiradaName
                };

                deliverExame(data)
                    .then((response) => {
                        console.log(response);
                        if (response.data.delivered) {
                            const updatedExames = exames.filter((exame) => exame.exameId !== exameId);
                            setExames(updatedExames);
                            retiradaNameInput.value = "";
                            retiradaDocIdInput.value = "";
                            document.getElementById("deliver-exame")?.classList.toggle("open");

                            handleModalMessage({
                                isError: false,
                                message: "Entrega registrada com sucesso"
                            })
                        } else {
                            handleModalMessage({
                                isError: true,
                                message: "Erro ao registrar entrega do exame"
                            })
                            console.error("Erro ao registrar entrega do exame:", response.message);
                        }
                    })
                    .catch((error) => {
                        console.error("Erro ao registrar entrega do exame:", error);
                    });
            }
        }
    }

    function toggleRemoveData(event: React.MouseEvent<HTMLButtonElement>) {
        var exameId = event.currentTarget.dataset.exameId as string || "";
        setRemoveData({ exameId });

        document.getElementById("remove-exame")?.classList.toggle("open");
    }

    function handleRemoveExame() {
        removeExame(removeData)
            .then((response) => {
                if (response.message) {
                    console.log(response.message);
                    handleModalMessage({
                        isError: true,
                        message: "Erro ao remover exame"
                    })
                } else {
                    const updatedExames = exames.filter((exame) => exame.exameId !== removeData.exameId);
                    setExames(updatedExames);

                    var exameId = "";
                    setRemoveData({exameId});

                    handleModalMessage({
                        isError: false,
                        message: "Exame removido com sucesso"
                    })
            
                    document.getElementById("remove-exame")?.classList.toggle("open");
                }
            })
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
            <div className="main-exames-container">
                <div className={asideMenuOpened ? "menu-aside-container open" : "menu-aside-container"}>
                    <div className="menu-wrapper">
                        <div className="menu-item selected">
                            <a href="#">
                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 13.435H13C13.55 13.435 14 13.885 14 14.435C14 14.985 13.55 15.435 13 15.435H1C0.45 15.435 0 14.985 0 14.435C0 13.885 0.45 13.435 1 13.435ZM6.01 9.335C5.23 10.105 3.97 10.105 3.19 9.325L1 7.135C0.45 6.585 0.46 5.695 1.03 5.165C1.57 4.645 2.43 4.665 2.95 5.185L4.6 6.835L11.03 0.405C11.57 -0.135 12.44 -0.135 12.98 0.405L13.02 0.445C13.56 0.985 13.56 1.865 13.01 2.405L6.01 9.335Z" fill="#323232"/>
                                </svg>

                                <span>Exames Disponíveis</span>
                            </a>
                        </div>
                        <div className="menu-item">
                            <a href="/exames-entregues">
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


                            <button className="new-exame-button" onClick={toggleCreateExameForm}>
                                Novo exame
                            </button>
                        </div>
                        <div className="exames-table-container">
                            <table className="exames-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Tipo do exame</th>
                                        <th>CPF</th>
                                        <th>Telefone</th>
                                        <th>Data de chegada</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        exames.map((exame) => (
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
                                                <td className="buttons-cell">
                                                    <button className="edit-button" title="Editar" onClick={toggleEditExameForm} data-exame-id={exame.exameId}>
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0 14.4625V17.5025C0 17.7825 0.22 18.0025 0.5 18.0025H3.54C3.67 18.0025 3.8 17.9525 3.89 17.8525L14.81 6.9425L11.06 3.1925L0.15 14.1025C0.0500001 14.2025 0 14.3225 0 14.4625ZM17.71 4.0425C18.1 3.6525 18.1 3.0225 17.71 2.6325L15.37 0.2925C14.98 -0.0975 14.35 -0.0975 13.96 0.2925L12.13 2.1225L15.88 5.8725L17.71 4.0425Z" fill="#333333"/>
                                                        </svg>
                                                    </button>
                                                    <button className="wpp-button" title={exame.alerted ? "Já notificado" : "Notificar"} disabled={exame.alerted} data-exame-id={exame.exameId} onClick={handleNotifyPacient}>
                                                        {
                                                            exame.alerted ? <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.15123 12.935L15.5005 7.20478C16.1665 6.93666 16.1665 6.06334 15.5005 5.79522L1.15123 0.065024C0.608506 -0.157136 0.00822304 0.218238 0.00822304 0.762147L0 4.29372C0 4.67676 0.304253 5.00617 0.715405 5.05213L12.3346 6.5L0.715405 7.94021C0.304253 7.99383 0 8.32324 0 8.70628L0.00822304 12.2379C0.00822304 12.7818 0.608506 13.1571 1.15123 12.935Z" fill="#1BD742"/></svg>
                                                                :<svg width="18" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M19.6748 16.5166C19.599 17.363 19.082 18.3049 18.3359 18.7591C16.8337 19.6735 14.9652 19.1459 13.4867 18.4557C10.4701 17.0467 5.74678 12.8507 6.43519 9.23713C6.56771 8.542 7.31783 7.07636 8.11651 6.98275C8.32844 6.95763 9.28848 6.95418 9.46096 7.00591C9.60562 7.04926 9.73663 7.2345 9.80592 7.35963C10.2576 8.17448 10.5459 9.26472 10.9769 10.1111C11.1382 10.8816 10.3062 11.2585 9.91366 11.7876C9.67239 12.1123 9.79429 12.2177 9.95514 12.535C10.2763 13.1665 10.7528 13.7094 11.2581 14.1986C11.9587 14.8775 12.8104 15.452 13.7047 15.8781C13.8489 15.9471 14.4887 16.2422 14.5919 16.2422C14.6516 16.2422 14.8064 16.1717 14.8544 16.1313L16.0588 14.6204C16.2388 14.4573 16.3941 14.5307 16.5889 14.5967C17.2838 14.8307 18.4659 15.3756 19.1371 15.7111C19.5782 15.9313 19.7234 15.9717 19.6748 16.5166Z" fill="#1BD742"/>
                                                                    <path d="M22.0858 3.65149C16.4227 -1.84455 7.093 -1.00704 2.48657 5.29301C-0.605963 9.52244 -0.778445 15.0569 1.77591 19.5706L0 26.0002L6.70201 24.3212C6.97768 24.3158 7.28977 24.5661 7.55279 24.6789C11.8739 26.5283 16.581 26.2066 20.4505 23.5281C27.1434 18.8952 27.8976 9.29138 22.0858 3.65149ZM7.25385 22.0102C5.87096 22.3058 4.51589 22.7305 3.13604 23.0443L4.29991 19.1804C2.0622 16.0412 1.70054 11.9226 3.34544 8.44451C6.47035 1.83853 15.277 0.191586 20.6073 5.38711C24.0478 8.74109 24.806 13.9041 22.5167 18.102C19.5724 23.5015 12.5892 25.3361 7.25385 22.0102Z" fill="#1BD742"/>
                                                                    <path d="M19.6748 16.5166C19.599 17.363 19.082 18.3049 18.3359 18.7591C16.8337 19.6735 14.9652 19.1459 13.4867 18.4557C10.4701 17.0467 5.74678 12.8507 6.43519 9.23713C6.56771 8.542 7.31783 7.07636 8.11651 6.98275C8.32844 6.95763 9.28848 6.95418 9.46096 7.00591C9.60562 7.04926 9.73663 7.2345 9.80592 7.35963C10.2576 8.17448 10.5459 9.26472 10.9769 10.1111C11.1382 10.8816 10.3062 11.2585 9.91366 11.7876C9.67239 12.1123 9.79429 12.2177 9.95514 12.535C10.2763 13.1665 10.7528 13.7094 11.2581 14.1986C11.9587 14.8775 12.8104 15.452 13.7047 15.8781C13.8489 15.9471 14.4887 16.2422 14.5919 16.2422C14.6516 16.2422 14.8064 16.1717 14.8544 16.1313L16.0588 14.6204C16.2388 14.4573 16.3941 14.5307 16.5889 14.5967C17.2838 14.8307 18.4659 15.3756 19.1371 15.7111C19.5782 15.9313 19.7234 15.9717 19.6748 16.5166Z" fill="#FEFEFE"/>
                                                                    <path d="M19.6748 16.5166C19.599 17.363 19.082 18.3049 18.3359 18.7591C16.8337 19.6735 14.9652 19.1459 13.4867 18.4557C10.4701 17.0467 5.74678 12.8507 6.43519 9.23713C6.56771 8.542 7.31783 7.07636 8.11651 6.98275C8.32844 6.95763 9.28848 6.95418 9.46096 7.00591C9.60562 7.04926 9.73663 7.2345 9.80592 7.35963C10.2576 8.17448 10.5459 9.26472 10.9769 10.1111C11.1382 10.8816 10.3062 11.2585 9.91366 11.7876C9.67239 12.1123 9.79429 12.2177 9.95514 12.535C10.2763 13.1665 10.7528 13.7094 11.2581 14.1986C11.9587 14.8775 12.8104 15.452 13.7047 15.8781C13.8489 15.9471 14.4887 16.2422 14.5919 16.2422C14.6516 16.2422 14.8064 16.1717 14.8544 16.1313L16.0588 14.6204C16.2388 14.4573 16.3941 14.5307 16.5889 14.5967C17.2838 14.8307 18.4659 15.3756 19.1371 15.7111C19.5782 15.9313 19.7234 15.9717 19.6748 16.5166Z" fill="#1BD742"/>
                                                                </svg>
                                                        }
                                                        
                                                    </button>
                                                    <button className="entrega-button" title="Registrar entrega" data-exame-id={exame.exameId} onClick={toggleEntregaExame}>
                                                        <svg height="16" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.1925 10.1925L1.6925 6.6925C1.3025 6.3025 0.6825 6.3025 0.2925 6.6925C-0.0975 7.0825 -0.0975 7.7025 0.2925 8.0925L4.4825 12.2825C4.8725 12.6725 5.5025 12.6725 5.8925 12.2825L16.4925 1.6925C16.8825 1.3025 16.8825 0.6825 16.4925 0.2925C16.1025 -0.0975 15.4825 -0.0975 15.0925 0.2925L5.1925 10.1925Z" fill="#333333" data-exame-id={exame.exameId}/>
                                                        </svg>  
                                                    </button>
                                                    <button className="remove-button" title="Excluir" data-exame-id={exame.exameId} onClick={toggleRemoveData}>
                                                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V6C13 4.9 12.1 4 11 4H3C1.9 4 1 4.9 1 6V16ZM10.5 1L9.79 0.29C9.61 0.11 9.35 0 9.09 0H4.91C4.65 0 4.39 0.11 4.21 0.29L3.5 1H1C0.45 1 0 1.45 0 2C0 2.55 0.45 3 1 3H13C13.55 3 14 2.55 14 2C14 1.45 13.55 1 13 1H10.5Z" fill="#F04F4F"/>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="create-exame">
                <div className="exame-form-wrapper">
                    <div className="exame-form-header">
                        <span>Cadastrar novo exame</span>
                        <button onClick={toggleCreateExameForm}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none" onClick={toggleCreateExameForm}>
                                <path d="M9.95979 1.11905C9.65979 0.819045 9.17517 0.819045 8.87517 1.11905L5.11363 4.87289L1.3521 1.11135C1.0521 0.811353 0.56748 0.811353 0.26748 1.11135C-0.0325195 1.41135 -0.0325195 1.89597 0.26748 2.19597L4.02902 5.95751L0.26748 9.71904C-0.0325195 10.019 -0.0325195 10.5037 0.26748 10.8037C0.56748 11.1037 1.0521 11.1037 1.3521 10.8037L5.11363 7.04212L8.87517 10.8037C9.17517 11.1037 9.65979 11.1037 9.95979 10.8037C10.2598 10.5037 10.2598 10.019 9.95979 9.71904L6.19825 5.95751L9.95979 2.19597C10.2521 1.90366 10.2521 1.41135 9.95979 1.11905Z" fill="#333333" onClick={toggleCreateExameForm}/>
                            </svg>  
                        </button>
                    </div>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Tipo de Exame:</span>
                            <div className="select-wrapper">
                                <button className="exame-type-select" onClick={() => setTypesDropdownOpen(!typesDropdownOpen)}>
                                    {type ? type : "Selecione"}
                                    {
                                        !typesDropdownOpen ? <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 0.515078C15.6203 0.381003 15.4469 0.274644 15.2561 0.202078C15.0653 0.129513 14.8608 0.0921631 14.6543 0.0921631C14.4478 0.0921631 14.2433 0.129513 14.0525 0.202078C13.8617 0.274644 13.6883 0.381003 13.5424 0.515078L8.73612 4.92525C8.63785 5.01541 8.50459 5.06606 8.36564 5.06606C8.22669 5.06606 8.09343 5.01541 7.99517 4.92525L3.18998 0.515078C2.89521 0.244413 2.49536 0.0923037 2.0784 0.0922135C1.66143 0.0921233 1.26151 0.244059 0.966598 0.514597C0.67169 0.785134 0.505958 1.15211 0.505859 1.5348C0.505761 1.91749 0.671306 2.28454 0.966075 2.5552L5.77231 6.96634C6.11293 7.27899 6.51731 7.527 6.96237 7.6962C7.40742 7.86541 7.88444 7.9525 8.36617 7.9525C8.8479 7.9525 9.32491 7.86541 9.76997 7.6962C10.215 7.527 10.6194 7.27899 10.96 6.96634L15.7663 2.5552C16.061 2.28464 16.2265 1.91772 16.2265 1.53514C16.2265 1.15256 16.061 0.785644 15.7663 0.515078Z" fill="#333333"/></svg>
                                        : <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 7.52958C15.6203 7.66366 15.4469 7.77002 15.2561 7.84258C15.0653 7.91515 14.8608 7.9525 14.6543 7.9525C14.4478 7.9525 14.2433 7.91515 14.0525 7.84258C13.8617 7.77002 13.6883 7.66366 13.5424 7.52958L8.73612 3.11941C8.63785 3.02925 8.50459 2.9786 8.36564 2.9786C8.22669 2.9786 8.09343 3.02925 7.99517 3.11941L3.18998 7.52958C2.89521 7.80025 2.49536 7.95236 2.0784 7.95245C1.66143 7.95254 1.26151 7.8006 0.966598 7.53007C0.67169 7.25953 0.505958 6.89255 0.505859 6.50986C0.505761 6.12717 0.671306 5.76012 0.966075 5.48946L5.77231 1.07832C6.11293 0.765675 6.51731 0.517666 6.96237 0.34846C7.40742 0.179254 7.88444 0.0921636 8.36617 0.0921636C8.8479 0.0921636 9.32491 0.179254 9.76997 0.34846C10.215 0.517666 10.6194 0.765675 10.96 1.07832L15.7663 5.48946C16.061 5.76002 16.2265 6.12694 16.2265 6.50952C16.2265 6.8921 16.061 7.25902 15.7663 7.52958Z" fill="#333333"/></svg>

                                    }
                                    
                                </button>
                                <button className="new-type-button" onClick={toggleAddExameTypeForm}>
                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.2753 6.94129C14.2753 6.51703 13.9326 6.17435 13.5084 6.17435L8.19418 6.16892L8.19419 0.849297C8.19419 0.425033 7.85151 0.0823582 7.42725 0.0823582C7.00298 0.0823582 6.66031 0.425033 6.66031 0.849297L6.66031 6.16892L1.34069 6.16891C0.916425 6.16892 0.57375 6.51159 0.573751 6.93585C0.573751 7.36012 0.916426 7.70279 1.34069 7.70279L6.66031 7.70279V13.0224C6.66031 13.4467 7.00298 13.7893 7.42725 13.7893C7.85151 13.7893 8.19418 13.4467 8.19418 13.0224V7.70279L13.5138 7.70279C13.9272 7.70279 14.2753 7.35468 14.2753 6.94129Z" fill="white"/>
                                    </svg>
                                </button>
                            </div>
                            <div className={typesDropdownOpen ? "exame-type-dropdown open" : "exame-type-dropdown"}>
                                {
                                    exameTypes.map((exameType) => (
                                        <button data-exame-type={exameType.type} onClick={handleSetType} data-form="create">{exameType.type}</button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Nome do Paciente:</span>
                            <input type="text" name="patientName" id="newPatientNameEl" placeholder="Ex.: João da Silva" onChange={handleNewExameDataChange} value={newExameData.patientName}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <input type="text" name="docId" id="newDocIdEl" placeholder="000.000.000-00" onChange={handleNewExameDataChange} value={newExameData.docId} maxLength={14}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Telefone:</span>
                            <input type="text" name="patientNumber" id="newPhoneEl" placeholder="55 79 9999-9999" onChange={handleNewExameDataChange} value={newExameData.patientNumber}/>
                        </div>

                        <div className="form-bottom-wrapper">
                            <div className="arrive-date">
                                <span>Chegada:</span>
                                <span>
                                    {
                                        new Date().toLocaleDateString("pt-BR", {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })
                                    }
                                </span>
                            </div>

                            <button onClick={createNewExame}>
                                Cadastrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="create-exame-type">
                <div className="exame-form-wrapper">
                    <div className="exame-type-form-header">
                        <button onClick={toggleAddExameTypeForm}>Voltar</button>
                    </div>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Cadastrar novo tipo de exame:</span>
                            <div>
                                <input type="text" name="typeName" id="typeNameEl" placeholder="Ex.: Hemograma" />
                                <button className="new-type-button" onClick={createNewExameType}>
                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.2753 6.94129C14.2753 6.51703 13.9326 6.17435 13.5084 6.17435L8.19418 6.16892L8.19419 0.849297C8.19419 0.425033 7.85151 0.0823582 7.42725 0.0823582C7.00298 0.0823582 6.66031 0.425033 6.66031 0.849297L6.66031 6.16892L1.34069 6.16891C0.916425 6.16892 0.57375 6.51159 0.573751 6.93585C0.573751 7.36012 0.916426 7.70279 1.34069 7.70279L6.66031 7.70279V13.0224C6.66031 13.4467 7.00298 13.7893 7.42725 13.7893C7.85151 13.7893 8.19418 13.4467 8.19418 13.0224V7.70279L13.5138 7.70279C13.9272 7.70279 14.2753 7.35468 14.2753 6.94129Z" fill="white"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Tipos de exames cadastrados:</span>
                            
                            <div className="exame-types-list">
                                {
                                    exameTypes.map((exameType) => (
                                        <div className="exame-type-element">
                                            <span>{exameType.type}</span>
                                            <button onClick={excludeExameType} data-exame-type={exameType.type}>
                                                <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg" data-exame-type={exameType.type}>
                                                    <path d="M0.604444 9.67111C0.604444 10.336 1.14844 10.88 1.81333 10.88H6.64889C7.31378 10.88 7.85778 10.336 7.85778 9.67111V3.62667C7.85778 2.96178 7.31378 2.41778 6.64889 2.41778H1.81333C1.14844 2.41778 0.604444 2.96178 0.604444 3.62667V9.67111ZM6.34667 0.604444L5.91751 0.175289C5.80871 0.0664889 5.65156 0 5.4944 0H2.96782C2.81067 0 2.65351 0.0664889 2.54471 0.175289L2.11556 0.604444H0.604444C0.272 0.604444 0 0.876444 0 1.20889C0 1.54133 0.272 1.81333 0.604444 1.81333H7.85778C8.19022 1.81333 8.46222 1.54133 8.46222 1.20889C8.46222 0.876444 8.19022 0.604444 7.85778 0.604444H6.34667Z" fill="#F04F4F" data-exame-type={exameType.type}/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="edit-exame">
                <div className="exame-form-wrapper">
                    <div className="exame-form-header">
                        <span>Editar exame</span>
                        <button onClick={toggleEditExameForm}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                                <path d="M9.95979 1.11905C9.65979 0.819045 9.17517 0.819045 8.87517 1.11905L5.11363 4.87289L1.3521 1.11135C1.0521 0.811353 0.56748 0.811353 0.26748 1.11135C-0.0325195 1.41135 -0.0325195 1.89597 0.26748 2.19597L4.02902 5.95751L0.26748 9.71904C-0.0325195 10.019 -0.0325195 10.5037 0.26748 10.8037C0.56748 11.1037 1.0521 11.1037 1.3521 10.8037L5.11363 7.04212L8.87517 10.8037C9.17517 11.1037 9.65979 11.1037 9.95979 10.8037C10.2598 10.5037 10.2598 10.019 9.95979 9.71904L6.19825 5.95751L9.95979 2.19597C10.2521 1.90366 10.2521 1.41135 9.95979 1.11905Z" fill="#333333"/>
                            </svg>  
                        </button>
                    </div>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Tipo de Exame:</span>
                            <div className="select-wrapper">
                                <button className="exame-type-select" onClick={() => setTypesDropdownOpen(!typesDropdownOpen)}>
                                    {type ? type : "Selecione"}
                                    {
                                        !typesDropdownOpen ? <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 0.515078C15.6203 0.381003 15.4469 0.274644 15.2561 0.202078C15.0653 0.129513 14.8608 0.0921631 14.6543 0.0921631C14.4478 0.0921631 14.2433 0.129513 14.0525 0.202078C13.8617 0.274644 13.6883 0.381003 13.5424 0.515078L8.73612 4.92525C8.63785 5.01541 8.50459 5.06606 8.36564 5.06606C8.22669 5.06606 8.09343 5.01541 7.99517 4.92525L3.18998 0.515078C2.89521 0.244413 2.49536 0.0923037 2.0784 0.0922135C1.66143 0.0921233 1.26151 0.244059 0.966598 0.514597C0.67169 0.785134 0.505958 1.15211 0.505859 1.5348C0.505761 1.91749 0.671306 2.28454 0.966075 2.5552L5.77231 6.96634C6.11293 7.27899 6.51731 7.527 6.96237 7.6962C7.40742 7.86541 7.88444 7.9525 8.36617 7.9525C8.8479 7.9525 9.32491 7.86541 9.76997 7.6962C10.215 7.527 10.6194 7.27899 10.96 6.96634L15.7663 2.5552C16.061 2.28464 16.2265 1.91772 16.2265 1.53514C16.2265 1.15256 16.061 0.785644 15.7663 0.515078Z" fill="#333333"/></svg>
                                        : <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 7.52958C15.6203 7.66366 15.4469 7.77002 15.2561 7.84258C15.0653 7.91515 14.8608 7.9525 14.6543 7.9525C14.4478 7.9525 14.2433 7.91515 14.0525 7.84258C13.8617 7.77002 13.6883 7.66366 13.5424 7.52958L8.73612 3.11941C8.63785 3.02925 8.50459 2.9786 8.36564 2.9786C8.22669 2.9786 8.09343 3.02925 7.99517 3.11941L3.18998 7.52958C2.89521 7.80025 2.49536 7.95236 2.0784 7.95245C1.66143 7.95254 1.26151 7.8006 0.966598 7.53007C0.67169 7.25953 0.505958 6.89255 0.505859 6.50986C0.505761 6.12717 0.671306 5.76012 0.966075 5.48946L5.77231 1.07832C6.11293 0.765675 6.51731 0.517666 6.96237 0.34846C7.40742 0.179254 7.88444 0.0921636 8.36617 0.0921636C8.8479 0.0921636 9.32491 0.179254 9.76997 0.34846C10.215 0.517666 10.6194 0.765675 10.96 1.07832L15.7663 5.48946C16.061 5.76002 16.2265 6.12694 16.2265 6.50952C16.2265 6.8921 16.061 7.25902 15.7663 7.52958Z" fill="#333333"/></svg>

                                    }
                                    
                                </button>
                                <button className="new-type-button" onClick={toggleAddExameTypeForm}>
                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.2753 6.94129C14.2753 6.51703 13.9326 6.17435 13.5084 6.17435L8.19418 6.16892L8.19419 0.849297C8.19419 0.425033 7.85151 0.0823582 7.42725 0.0823582C7.00298 0.0823582 6.66031 0.425033 6.66031 0.849297L6.66031 6.16892L1.34069 6.16891C0.916425 6.16892 0.57375 6.51159 0.573751 6.93585C0.573751 7.36012 0.916426 7.70279 1.34069 7.70279L6.66031 7.70279V13.0224C6.66031 13.4467 7.00298 13.7893 7.42725 13.7893C7.85151 13.7893 8.19418 13.4467 8.19418 13.0224V7.70279L13.5138 7.70279C13.9272 7.70279 14.2753 7.35468 14.2753 6.94129Z" fill="white"/>
                                    </svg>
                                </button>
                            </div>
                            <div className={typesDropdownOpen ? "exame-type-dropdown open" : "exame-type-dropdown"}>
                                {
                                    exameTypes.map((exameType) => (
                                        <button data-exame-type={exameType.type} onClick={handleSetType} data-form="edit">{exameType.type}</button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Nome do Paciente:</span>
                            <input type="text" name="patientName" id="editPatientNameEl" placeholder="Ex.: João da Silva" value={editExameData.patientName} onChange={handleEditExameChange} />
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <input type="text" name="docId" id="editDocIdEl" placeholder="000.000.000-00" value={editExameData.docId} onChange={handleEditExameChange} maxLength={14} />
                        </div>
                        <div className="form-field-wrapper">
                            <span>Telefone:</span>
                            <input type="text" name="patientNumber" id="editPhoneEl" placeholder="55 79 9999-9999" value={editExameData.patientNumber} onChange={handleEditExameChange} />
                        </div>

                        <div className="form-field-wrapper">
                            <span>Chegada:</span>
                            <input type="date" name="arrivedDate" id="editArriveDateEl" value={editExameData.arrivedDate ? new Date(editExameData.arrivedDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]} onChange={handleEditingArriveDate} />
                        </div>

                        <div className="form-bottom-wrapper unique">
                            <button onClick={updateExame}>
                                Salvar alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="deliver-exame">
                <div className="exame-form-wrapper">
                    <div className="exame-type-form-header">
                        <button onClick={() => document.getElementById("deliver-exame")?.classList.toggle("open")}>Voltar</button>

                        <div>
                            <span>Retirada:</span>
                            <span>
                                {
                                    new Date().toLocaleDateString("pt-BR", {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })
                                }
                            </span>
                        </div>
                    </div>

                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Tipo de Exame:</span>
                            <span className="data" id="retiradaTipoEl">Hemograma</span>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Nome do Paciente:</span>
                            <span className="data" id="retiradaNomeEl">Alessandro Freitas dos Santos</span>
                        </div>
                        <div className="form-field-wrapper split">
                            <div>
                                <span>CPF:</span>
                                <span className="data" id="retiradaCpfEl">000.000.000-00</span>
                            </div>
                            <div>
                                <span>Telefone:</span>
                                <span className="data" id="retiradaTelefoneEl">557999999999</span>
                            </div>
                        </div>
                        <div className="form-field-wrapper">
                            <span>Retirado Por:</span>
                            <input type="text" name="retiradaName" id="retiradaNameIn" value={retiranteName} onChange={handleRetiranteNameChange}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <input type="text" name="retiradaCpf" id="retiradaCpfIn" value={retiranteDocId} onChange={handleRetiranteDocIdChange}/>
                        </div>
                        <div className="check-wrapper">
                            <input type="checkbox" name="retiradaPaciente" id="retiradaPacienteEl" checked={isRetiradoPeloPaciente} onChange={handleRetiradoPeloPacienteChange}/>
                            <label htmlFor="retiradaPacienteEl">Retirado pelo paciente</label>
                        </div>

                        <div className="form-bottom-wrapper unique">
                            <button id="deliver-button" onClick={registerDeliveredExame}>
                                Marcar como retirado
                            </button>
                        </div>
                    </div>
                   
                </div>
            </div>

            <div className="exame-form-container" id="remove-exame">
                <div className="remove-wrapper">
                    <div className="remove-header">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" stroke="#ef4444fa"></path>
                            <path d="M12 9v4" stroke="#ef4444fa"></path>
                            <path d="M12 17h.01" stroke="#ef4444fa"></path>
                        </svg>

                        <b>Atenção! Você está prestes a deletar isso</b>
                    </div>
                    <span className="content">
                        Esta ação é <b>permanente</b> e você não poderá recuperar estes dados <br /> depois. Tem certeza que deseja continuar?
                    </span>

                    <div className="buttons-wrapper">
                        <button onClick={toggleRemoveData}>Melhor não...</button>
                        <button className="delete" id="delete-button" onClick={handleRemoveExame}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M3 6h18" stroke="#FFFFFF"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="#FFFFFF"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="#FFFFFF"></path>
                            </svg>
                            Sim, deletar!
                        </button>
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

export default ExamesPanel;