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

function ExamesPanel() {
    const userData = getCookies("userData");
    const [exames, setExames] = useState<IExame[]>([]);
    const [exameTypes, setExameTypes] = useState<IExameType[]>([]);

    const [docId, setDocId] = useState("");
    const [type, setType] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientNumber, setPatientNumber] = useState("");

    const [retiranteName, setRetiranteName] = useState("");
    const [retiranteDocId, setRetiranteDocId] = useState("");
    const [isRetiradoPeloPaciente, setIsRetiradoPeloPaciente] = useState(false);

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

        createExame(exameData)
            .then((response) => {
                setExames([...exames, response.data]);

                setDocId("");
                setType("");
                setPatientName("");
                setPatientNumber("");
                
                toggleNewExameContainer();
            })
            .catch((error) => {
                console.error("Erro ao criar exame:", error);
            });
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

    return (
        <React.Fragment>
            <div className="exames-container">
                <div className="header-container">
                    <b>Exames para retirada:</b>
                    <img src={logo01} alt="Logo" className="logo" />
                </div>
                <div className="search-container">
                    <input type="text" placeholder="Digite nome do paciente"  id="searchInput"/>
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
                                    <td className="btn-cell"><button className="btn">Editar exame</button></td>
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
                                            <button className="btn" data-exame-id={exame.exameId} onClick={handleNotifyPacient}>
                                                <img src={wppIcon} alt="" />
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
                                <select name="exameType" id="exameTypeEl" onChange={handleTypeChange}>
                                    {
                                        exameTypes.map((exameType) => ( 
                                            <option key={exameType.exameTypeId} value={exameType.type}>
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
                            <input type="text" name="patientNumber" id="patientNumberEl" placeholder="Digite o telefone" onChange={handlePatientNumberChange} value={patientNumber}/>
                        </div>

                        <button type="submit" id="newExamSubmit">Cadastrar</button>
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
                                <div className="exame-type-item" key={exameType.exameTypeId}>
                                    <span>{exameType.type}</span>
                                    <button className="delete-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                            <path d="M14.1761 4.8022L11.4764 7.5L14.1761 10.1978C14.7036 10.7254 15 11.4409 15 12.1869C15 12.933 14.7036 13.6485 14.1761 14.1761C13.6485 14.7036 12.933 15 12.1869 15C11.4409 15 10.7254 14.7036 10.1978 14.1761L7.5 11.4764L4.8022 14.1761C4.27465 14.7036 3.55913 15 2.81306 15C2.06699 15 1.35148 14.7036 0.823927 14.1761C0.296376 13.6485 0 12.933 0 12.1869C0 11.4409 0.296376 10.7254 0.823927 10.1978L3.5236 7.5L0.823927 4.8022C0.296376 4.27465 -5.55866e-09 3.55913 0 2.81306C5.55866e-09 2.06699 0.296376 1.35148 0.823927 0.823928C1.35148 0.296376 2.06699 5.55866e-09 2.81306 0C3.55913 -5.55866e-09 4.27465 0.296376 4.8022 0.823928L7.5 3.5236L10.1978 0.823928C10.459 0.56271 10.7691 0.355502 11.1104 0.214133C11.4517 0.0727629 11.8175 0 12.1869 0C12.5564 0 12.9222 0.0727629 13.2634 0.214133C13.6047 0.355502 13.9149 0.56271 14.1761 0.823928C14.4373 1.08514 14.6445 1.39525 14.7859 1.73655C14.9272 2.07785 15 2.44365 15 2.81306C15 3.18248 14.9272 3.54828 14.7859 3.88958C14.6445 4.23087 14.4373 4.54098 14.1761 4.8022Z" fill="#DB0000"/>
                                        </svg>
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