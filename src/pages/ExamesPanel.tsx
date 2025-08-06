import React, {useState, useMemo} from "react";
import '../controllers/user/checkSession.controller';

import logo01 from "../img/logo-01.svg";
import wppIcon from "../img/wpp-icon.svg";
import logoutIcon from "../img/logout.svg";

import "../style/exames.css";
import { getCookies, doLogout } from "../controllers/user/authenticate.controller";
import { listExames, IExame, IResponse } from "../controllers/exame/listExames.controller";
import { listExameTypes, IExameType, IExameResponse} from "../controllers/exame/listExameTypes.controller";
import { createExame, ICreateExame } from "../controllers/exame/createExame.controller";
import { createExameType } from "../controllers/exame/createExameType.controller";
import { notifyPacient, INotifyResponse } from "../controllers/exame/notifyPacient.controller";
import { IDeliverExame, deliverExame } from "../controllers/exame/deliverExame.controller";
import { editExame, IEditExame } from "../controllers/exame/editExame.controller";
import { searchExame, ISearch } from "../controllers/exame/searchExame.controller";
import { removeExameType } from "../controllers/exame/removeExameType.controller";

function ExamesPanel() {
    const initialDate = new Date();
    const userData = getCookies("userData");
    const [exames, setExames] = useState<IExame[]>([]);
    const [exameTypes, setExameTypes] = useState<IExameType[]>([]);

    const [docId, setDocId] = useState("");
    const [type, setType] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientNumber, setPatientNumber] = useState("");
    const [isPhoneValid, setIsPhoneValue] = useState(false);

    const [retiranteName, setRetiranteName] = useState("");
    const [retiranteDocId, setRetiranteDocId] = useState("");
    const [isRetiradoPeloPaciente, setIsRetiradoPeloPaciente] = useState(false);

    const [editingExameId, setEditingExameId] = useState("");
    const [editingExameType, setEditingExameType] = useState("");
    const [editingPacientName, setEditingPacientName] = useState("");
    const [editingDocId, setEditingDocId] = useState("");
    const [editingPatientNumber, setEditingPatientNumber] = useState("");
    const [editingArrivedDate, setEditingArrivedDate] = useState(initialDate.toISOString().split("T")[0]);

    const [queryStringVal, setQueryStringVal] = useState("");

    const InitialExames = useMemo(() => listExames().then((response: IResponse) => { setExames(response.data); }), []);
    const InitialExameTypes = useMemo(() => listExameTypes().then((response: IExameResponse) => { setExameTypes(response.data); setType(response.data[0].type) }), []);

    function toggleNewExameContainer() {
        const newExameContainer = document.getElementById("newExameContainer");
        if (newExameContainer) {
            newExameContainer.classList.toggle("hidden");
        }
    }

    function toggleNewExameTypeContainer() {
        const newExameTypeContainer = document.getElementById("newExameTypeContainer");
        if (newExameTypeContainer) {
            newExameTypeContainer.classList.toggle("hidden");
            toggleNewExameContainer();
        }
    }

    function handleDocIdChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDocId(event.target.value);
    }

    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setType(event.target.value);
    }

    function handlePatientNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPatientName(event.target.value);
    }

    function handlePatientNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPatientNumber(event.target.value);
    }

    function testPhoneNumber(event: React.KeyboardEvent<HTMLInputElement>){
        const regex = /^55\d{10}$/;
        if(!regex.test((event.target as HTMLInputElement).value)) {
            setIsPhoneValue(false);
            (event.target as HTMLInputElement).style.outline = "2px solid red"
        } else {
            setIsPhoneValue(true);
            (event.target as HTMLInputElement).style.outline = "2px solid blue"
        }
    }

    function handleRetiranteNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRetiranteName(event.target.value);
    }

    function handleRetiranteDocIdChange(event: React.ChangeEvent<HTMLInputElement>) {
        setRetiranteDocId(event.target.value);
    }

    function handleRetiradoPeloPacienteChange(event: React.ChangeEvent<HTMLInputElement>) {
        setIsRetiradoPeloPaciente(event.target.checked);

        if (event.target.checked) {
            setRetiranteName(patientName);
            setRetiranteDocId(docId);
        } else {
            setRetiranteName("");
            setRetiranteDocId("");
        }
    }

    function createNewExame(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const exameData: ICreateExame = {
            docId,
            type,
            patientName,
            patientNumber
        };

        if(!isPhoneValid){
            alert("Formato de telefone inválido");
        } else{
            createExame(exameData)
                .then((response) => {
                    setExames([...exames, response.data]);

                    setDocId("");
                    setPatientName("");
                    setPatientNumber("");
                    
                    toggleNewExameContainer();
                })
                .catch((error) => {
                    console.error("Erro ao criar exame:", error);
                });
        }
        
    }

    function createNewExameType(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const exameTypeInput = document.getElementById("newExameTypeEl") as HTMLInputElement;
        const newExameType = exameTypeInput.value.trim();
        console.log("Novo tipo de exame:", newExameType);

        if (newExameType) {
            createExameType(newExameType)
                .then((response) => {
                    setExameTypes([...exameTypes, response.data]);
                    exameTypeInput.value = "";
                    toggleNewExameTypeContainer();
                })
                .catch((error) => {
                    console.error("Erro ao criar tipo de exame:", error);
                });
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
                    } else {
                        console.error("Erro ao notificar paciente:", response.message);
                    }
                })
                .catch((error) => {
                    console.error("Erro ao notificar paciente:", error);
                });
        }
    }

    function toggleEntregaExame(event: React.MouseEvent<HTMLButtonElement>) {
        const exameId = (event.currentTarget as HTMLButtonElement).dataset.exameId;
        if (exameId) {
            const retiradaContainer = document.getElementById("retiradaContainer");
            if (retiradaContainer) {
                retiradaContainer.classList.remove("hidden");
                const exame = exames.find((ex) => ex.exameId === exameId);
                if (exame) {
                    const retiradaForm = document.getElementById("retiradaForm") as HTMLFormElement;
                    if (retiradaForm) {
                        retiradaForm.setAttribute("data-exame-id", exame.exameId);
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

                        setPatientName(exame.patientName);
                        setDocId(exame.docId);
                    }
                }
            }
        }
    }

    function handleRetiradaRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const retiradaForm = event.currentTarget as HTMLFormElement;
        const exameId = retiradaForm.getAttribute("data-exame-id");
        if (!exameId) {
            console.error("Exame ID não encontrado no formulário de retirada.");
            return;
        }
        const retiradaNameInput = document.getElementById("retiradaNameIn") as HTMLInputElement;
        const retiradaDocIdInput = document.getElementById("retiradaCpfIn") as HTMLInputElement;
        const retiradaName = retiradaNameInput.value.trim();
        const retiradaDocId = retiradaDocIdInput.value.trim();

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
                            document.getElementById("retiradaContainer")?.classList.add("hidden");
                        } else {
                            console.error("Erro ao entregar exame:", response.message);
                        }
                    })
                    .catch((error) => {
                        console.error("Erro ao entregar exame:", error);
                    });
            }
        }

    }

    function toggleEditeExame(exameId: string) {
        const editExameContainer = document.getElementById("editExameContainer");
        if (editExameContainer) {
            editExameContainer.classList.remove("hidden");

            const exame = exames.find((ex) => ex.exameId === exameId);
            if (exame) {
                setEditingExameId(exame.exameId)
                setEditingExameType(exame.type);
                setEditingPacientName(exame.patientName);
                setEditingDocId(exame.docId);
                setEditingPatientNumber(exame.patientNumber);
                setEditingArrivedDate(new Date(exame.arrivedDate).toISOString());
            }
        }
    }

    function handleEditingArriveDate(event: React.ChangeEvent<HTMLInputElement>) {
        const newDate = new Date(event.target.value);
        newDate.setHours(newDate.getHours() + 3);
        setEditingArrivedDate(newDate.toISOString());
        console.log(newDate.toISOString());
    }

    function handleEditExameSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const editingExameProps = {} as IEditExame;

        editingExameProps.exameId = editingExameId;
        editingExameProps.docId = editingDocId;
        editingExameProps.type = editingExameType;
        editingExameProps.arrivedDate = editingArrivedDate;
        editingExameProps.patientName = editingPacientName;
        editingExameProps.patientNumber = editingPatientNumber;

        editExame(editingExameProps)
            .then(response => {
                console.log(response);
                const updatedExames = exames.map((exame) =>
                    exame.exameId === editingExameId
                        ? {
                            ...exame,
                            type: editingExameType,
                            patientName: editingPacientName,
                            docId: editingDocId,
                            patientNumber: editingPatientNumber,
                            arrivedDate: editingArrivedDate,
                        }
                        : exame
                );
                setExames(updatedExames);
                document.getElementById("editExameContainer")?.classList.add("hidden");
            }).catch(error => console.log(error))

    }

    function doTheSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setQueryStringVal(event.target.value);

        const queryString: ISearch = {
            delivered: false,
            queryString: queryStringVal
        };

        searchExame(queryString)
            .then(response => {
                setExames(response);
            })
    }

    return (
        <React.Fragment>
            <div className="exames-container">
                <div className="header-container">
                    <b>Exames para retirada:</b>
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
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {exames.map((exame) => (
                                <tr className="exame-row" data-exame-id={exame.exameId}>
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
                                    <td className="btn-cell"><button className="btn" onClick={() => toggleEditeExame(exame.exameId)}>Editar exame</button></td>
                                    {
                                        exame.alerted ?
                                        <td className="btn-cell">
                                            <button className="btn delivered">
                                                <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: "12px", height: "12px"}}>
                                                    <path d="M20.9951 1.24614L9.32718 13.0341L7.01479 10.6156C6.64386 10.2257 6.20055 9.91343 5.71017 9.69663C5.21979 9.47983 4.69195 9.36273 4.15677 9.35203C3.6216 9.34132 3.08958 9.43721 2.59109 9.63423C2.0926 9.83125 1.6374 10.1255 1.25148 10.5003C0.865565 10.875 0.556485 11.3229 0.341893 11.8183C0.1273 12.3137 0.0113974 12.847 0.000799916 13.3877C-0.0206027 14.4797 0.388228 15.5355 1.13736 16.3229L4.56926 19.9301C5.1642 20.5683 5.87922 21.08 6.67241 21.4355C7.46561 21.7909 8.32105 21.9828 9.1886 22H9.29729C11.0196 21.9957 12.6707 21.3051 13.8922 20.0783L26.7557 7.07973C27.145 6.69988 27.4555 6.2455 27.6691 5.74311C27.8827 5.24072 27.9951 4.70037 27.9998 4.15361C28.0045 3.60685 27.9014 3.06461 27.6965 2.55855C27.4915 2.05248 27.1889 1.59272 26.8062 1.20608C26.4235 0.819451 25.9684 0.513689 25.4675 0.306641C24.9666 0.0995928 24.4299 -0.00459574 23.8887 0.000155475C23.3475 0.00490669 22.8127 0.118502 22.3154 0.334314C21.8181 0.550125 21.3684 0.86383 20.9924 1.25712L20.9951 1.24614Z" fill="white"/>
                                                </svg>
                                            </button>
                                        </td>
                                        :
                                        <td className="btn-cell">
                                            <button className="btn whatsapp" data-exame-id={exame.exameId} onClick={handleNotifyPacient}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15">
                                                    <path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z" fill="#ffffff"/>
                                                </svg>
                                            </button>
                                        </td>
                                    }
                                    <td className="btn-cell"><button className="btn" data-exame-id={exame.exameId} onClick={toggleEntregaExame}>Entrega</button></td>
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
                    <a href="/exames-entregues">Consultar já retirados</a>
                    <button id="newExam" onClick={toggleNewExameContainer}>Cadastrar novo exame</button>
                </div>
            </div>
            
            <div className="new-exame-container hidden" id="newExameContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={toggleNewExameContainer}> 
                            Voltar
                        </button>
                        
                        <div>
                            <b>Chegada:</b>
                            <span>{new Date().toLocaleDateString("pt-BR", { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                        </div>
                    </div>

                    <form className="new-exame-info" onSubmit={createNewExame}>
                        <div className="form-wrapper">
                            <span>Tipo de exame:</span>
                            <div className="select-wrapper">
                                <select name="exameType" id="exameTypeEl" value={type} onChange={handleTypeChange}>
                                    {
                                        exameTypes.map((exameType) => ( 
                                            <option key={exameType.type} value={exameType.type}>
                                                {exameType.type}
                                            </option>
                                        ))
                                    }
                                </select>
                                <button type="button" onClick={toggleNewExameTypeContainer}>+</button>
                            </div>
                        </div>
                        <div className="form-wrapper">
                            <span>Nome do paciente:</span>
                            <input type="text" name="patientName" id="patientNameEl" placeholder="Digite o nome do paciente" onChange={handlePatientNameChange} value={patientName}/>
                        </div>
                        <div className="form-wrapper">
                            <span>Cpf:</span>
                            <input type="text" name="docId" id="docIdEl" placeholder="Digite o CPF" onChange={handleDocIdChange} value={docId}/>
                        </div>
                        <div className="form-wrapper">
                            <span>Telefone:</span>
                            <input type="text" name="patientNumber" id="patientNumberEl" placeholder="Ex.: 557988888888" onKeyUp={testPhoneNumber} onChange={handlePatientNumberChange} value={patientNumber}/>
                        </div>

                        <button type="submit" id="newExamSubmit">Cadastrar</button>
                    </form>
                </div>
            </div>

            <div className="new-exame-container hidden" id="editExameContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={() => document.getElementById("editExameContainer")?.classList.add("hidden")}>
                            Voltar
                        </button>
                    </div>

                    <form className="new-exame-info" onSubmit={handleEditExameSubmit}>
                        <div className="form-wrapper">
                            <span>Tipo de exame:</span>
                            <div className="select-wrapper">
                                <select name="exameType" id="exameTypeEl" value={editingExameType} onChange={(e) => setEditingExameType(e.target.value)}>
                                    {
                                        exameTypes.map((exameType) => ( 
                                            <option key={exameType.type} value={exameType.type}>
                                                {exameType.type}
                                            </option>
                                        ))
                                    }
                                </select>
                                <button type="button" onClick={toggleNewExameTypeContainer}>+</button>
                            </div>
                        </div>
                        <div className="form-wrapper">
                            <span>Nome do paciente:</span>
                            <input type="text" name="patientName" id="patientNameEl" placeholder="Digite o nome do paciente" value={editingPacientName} onChange={(e) => setEditingPacientName(e.target.value)}/>
                        </div>
                        <div className="form-wrapper">
                            <span>Cpf:</span>
                            <input type="text" name="docId" id="docIdEl" placeholder="Digite o CPF" value={editingDocId} onChange={(e) => setEditingDocId(e.target.value)}/>
                        </div>
                        <div className="form-wrapper">
                            <span>Telefone:</span>
                            <input type="text" name="patientNumber" id="patientNumberEl" placeholder="Digite o telefone" value={editingPatientNumber} onChange={(e) => setEditingPatientNumber(e.target.value)}/>
                        </div>
                        <div className="form-wrapper">
                            <span>Chegada:</span>
                            <input type="date" name="arriveDate" id="arriveDateEl" value={new Date(editingArrivedDate).toISOString().split("T")[0]} onChange={handleEditingArriveDate} />
                        </div>

                        <button type="submit" id="editExameSubmit">Salvar Alterações</button>
                    </form>
                </div>
            </div>

            <div className="new-exame-container hidden" id="newExameTypeContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={toggleNewExameTypeContainer}>
                            Voltar
                        </button>
                    </div>

                    <form className="new-exame-type-info" onSubmit={createNewExameType}>
                        <div className="form-wrapper">
                            <span>Tipo de exame:</span>
                            <div className="type-wrapper">
                                <input type="text" name="exameType" id="newExameTypeEl" placeholder="Digite o tipo de exame" />
                                <button>
                                    <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: "20px", height: "20px"}}>
                                        <path d="M20.9951 1.24614L9.32718 13.0341L7.01479 10.6156C6.64386 10.2257 6.20055 9.91343 5.71017 9.69663C5.21979 9.47983 4.69195 9.36273 4.15677 9.35203C3.6216 9.34132 3.08958 9.43721 2.59109 9.63423C2.0926 9.83125 1.6374 10.1255 1.25148 10.5003C0.865565 10.875 0.556485 11.3229 0.341893 11.8183C0.1273 12.3137 0.0113974 12.847 0.000799916 13.3877C-0.0206027 14.4797 0.388228 15.5355 1.13736 16.3229L4.56926 19.9301C5.1642 20.5683 5.87922 21.08 6.67241 21.4355C7.46561 21.7909 8.32105 21.9828 9.1886 22H9.29729C11.0196 21.9957 12.6707 21.3051 13.8922 20.0783L26.7557 7.07973C27.145 6.69988 27.4555 6.2455 27.6691 5.74311C27.8827 5.24072 27.9951 4.70037 27.9998 4.15361C28.0045 3.60685 27.9014 3.06461 27.6965 2.55855C27.4915 2.05248 27.1889 1.59272 26.8062 1.20608C26.4235 0.819451 25.9684 0.513689 25.4675 0.306641C24.9666 0.0995928 24.4299 -0.00459574 23.8887 0.000155475C23.3475 0.00490669 22.8127 0.118502 22.3154 0.334314C21.8181 0.550125 21.3684 0.86383 20.9924 1.25712L20.9951 1.24614Z" fill="white"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="exame-types">
                        <b>Tipos de exames cadastrados:</b>

                        <div className="exame-types-list">
                            {exameTypes.map((exameType) => (
                                <div className="exame-type-item" key={exameType.type}>
                                    <span>{exameType.type}</span>
                                    <button className="delete-btn" data-exame-type={exameType.type} onClick={excludeExameType}>
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="new-exame-container hidden" id="retiradaContainer">
                <div className="new-exame-wrapper">
                    <div className="top-buttons-wrapper">
                        <button className="back" onClick={() => document.getElementById("retiradaContainer")?.classList.add("hidden")}>
                            Voltar
                        </button>

                        <div>
                            <b>Retirada:</b>
                            <span>{new Date().toLocaleDateString("pt-BR", { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                        </div>
                    </div>

                    <form className="retirada-info" id="retiradaForm" data-exame-id="" onSubmit={handleRetiradaRegister}>
                        <div className="form-wrapper">
                            <span>Tipo de exame:</span>
                            <b id="retiradaTipoEl">Hemograma</b>
                        </div>
                        <div className="form-wrapper horizontal">
                            <div>
                                <span>Nome do paciente:</span>
                                <b id="retiradaNomeEl">João da Silva</b>
                            </div>
                            <div>
                                <span>Cpf:</span>
                                <b id="retiradaCpfEl">123.456.789-00</b>
                            </div>
                            <div>
                                <span>Telefone:</span>
                                <b id="retiradaTelefoneEl">(79) 98765-4321</b>
                            </div>
                        </div>

                        <div className="form-wrapper">
                            <span>Retirado por:</span>
                        </div>
                        <div className="form-wrapper">
                            <span>Nome Completo:</span>
                            <input type="text" name="retiradaName" id="retiradaNameIn" placeholder="Digite o nome completo" value={retiranteName} onChange={handleRetiranteNameChange} />
                        </div>
                        <div className="form-wrapper">
                            <span>Cpf:</span>
                            <input type="text" name="retiradaCpf" id="retiradaCpfIn" placeholder="Digite o CPF" value={retiranteDocId} onChange={handleRetiranteDocIdChange} />
                        </div>
                        <div className="check-wrapper">
                            <label htmlFor="retiradaPacienteEl">Retirado pelo paciente</label>
                            <input type="checkbox" name="retiradaPaciente" id="retiradaPacienteEl" checked={isRetiradoPeloPaciente} onChange={handleRetiradoPeloPacienteChange} />
                        </div>

                        <button id="retiradaSubmit">Marcar como retirado</button>
                    </form>
                </div>
            </div>

            <div className="pattern-rodape-light"></div>
        </React.Fragment>
    );
}

export default ExamesPanel;