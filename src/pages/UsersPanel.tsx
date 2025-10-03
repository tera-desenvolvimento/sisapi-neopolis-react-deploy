import React, { useState, useMemo } from "react";

import MainHeader from "../components/MainHeader";

import listUsers, { IResponse, IUser } from "../controllers/user/listUsers.controller";
import createUser, { ICreateData } from "../controllers/user/createUser.controller";

type modalData = {
    isError: boolean,
    message: string
}

function UsersPanel() {
    const [asideMenuOpened, setAsideMenuOpened] = useState(false);
    const [users, setUsers] = useState(Array<IUser>);
    const [typesDropdownOpen, setTypesDropdownOpen] = useState(false);
    const [newModules, setNewModules] = useState(Array<String>);
    const [newUserData, setNewUserData] = useState({} as ICreateData);
    const [isError, setIsError] = useState(false);
    const [modalErrorOpen, setModalErrorOpen] = useState(false);
    const [editUserData, setEditUserData] = useState({} as IUser);
    const [editModules, setEditModules] = useState(Array<String>);

    useMemo(() => listUsers().then((response: IResponse) => { setUsers(response.data); }), []);

    function handleModalMessage(data: modalData) {
        const isError = data.isError;
        const message = data.message;
        const messageElement = document.getElementById("warning-message") as HTMLSpanElement;

        setIsError(isError);
        messageElement.textContent = message;
        setModalErrorOpen(true);

        setTimeout(() => setModalErrorOpen(false), 10000);
    }

    function toggleCreateUserForm() {
        const formContainer = document.getElementById("create-user");

        if (formContainer) {
            formContainer.classList.toggle("open");
        }
    }

    function toggleUpdateUserForm(event: React.MouseEvent<HTMLButtonElement>) {
        const formContainer = document.getElementById("update-user");
        const userId = event.currentTarget.dataset.userId || "";
        const userData = users.filter(user => user._id === userId);
        setEditUserData(userData[0] || {});
        setEditModules(editUserData.modules);

        const editExamesCheck = document.getElementById("editExamesCheck") as HTMLInputElement;
        const editTransportesCheck = document.getElementById("editTransportesCheck") as HTMLInputElement;
        const editAdministracaoCheck = document.getElementById("editAdministracaoCheck") as HTMLInputElement;

        if (editExamesCheck) editExamesCheck.checked = false;
        if (editTransportesCheck) editTransportesCheck.checked = false;
        if (editAdministracaoCheck) editAdministracaoCheck.checked = false;

        if (userId) {
            userData[0].modules.map(module => {
                if (module === "exames") {
                    if (editExamesCheck) editExamesCheck.checked = true;
                } else if (module === "transportes") {
                    if (editTransportesCheck) editTransportesCheck.checked = true;
                } else if (module === "administracao") {
                    if (editAdministracaoCheck) editAdministracaoCheck.checked = true;
                }
            })
        }
        
        if (formContainer) {
            formContainer.classList.toggle("open");
        }
    }

    function handleNewUserDataChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.id === "newDocIdEl"){
            var docId = event.target.value;
            docId = docId.replace(/[^\d]/g, "");
            docId = docId.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            setNewUserData({
                ...newUserData,
                docId: docId
            });
        } else {
            setNewUserData({
                ...newUserData,
                [event.target.name]: event.target.value
            });
        }
    }

    function handleNewUserModules(event: React.ChangeEvent<HTMLInputElement>) {
        var checked = event.target.checked;

        if (checked) {
            setNewModules([
                ...newModules,
                event.target.name
            ])
        } else {
            var updatedArray = newModules.filter(module => module !== event.target.name )

            setNewModules(updatedArray);
        }
    }

    async function handleCreateUser() {
        newUserData.modules = newModules;
        newUserData.role = "Collaborator"
        newUserData.password = "Sis@pi#2025"

        console.log(newUserData);

        if(newUserData.docId === "" || newUserData.email === "" || !newUserData.modules.length || newUserData.name === "" || !newUserData.docId || !newUserData.email || !newUserData.name) {
            handleModalMessage({
                isError: true,
                message: "Todos os campos devem ser preenchidos."
            })
        } else {
            await createUser(newUserData)
                .then((response: IResponse) => {
                    setUsers([
                        ...users,
                        ...(Array.isArray(response.data) ? response.data : [response.data])
                    ])

                    toggleCreateUserForm();
                })
        }


    }

    return (
        <React.Fragment>
            <MainHeader/>
            <div className="main-exames-container">
                <div className={asideMenuOpened ? "menu-aside-container open" : "menu-aside-container"}>
                    <div className="menu-wrapper">
                        <div className="menu-item selected">
                            <a href="#">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 2C9.1 2 10 2.9 10 4C10 5.1 9.1 6 8 6C6.9 6 6 5.1 6 4C6 2.9 6.9 2 8 2ZM8 9C5.33 9 0 10.34 0 13V15C0 15.55 0.45 16 1 16H15C15.55 16 16 15.55 16 15V13C16 10.34 10.67 9 8 9ZM14 14H2V13.01C2.2 12.29 5.3 11 8 11C10.7 11 13.8 12.29 14 13V14Z" fill="#323232"/>
                                </svg>


                                <span>Usuários</span>
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
                        <b>Usuários</b>
                        <span>Aqui você visualiza os usuários do sistema.</span>
                    </div>

                    <div className="listing-container">
                        <div className="buttons-wrapper">
                            <div className="search-wrapper">
                                <input type="text" name="searchInput" id="searchInput" placeholder="Busca por nome"/>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.52638 8.38358H8.92426L8.71085 8.17781C9.62546 7.11087 10.098 5.65526 9.83887 4.1082C9.48065 1.98956 7.7124 0.297696 5.57831 0.0385818C2.3543 -0.35771 -0.351424 2.35537 0.0372858 5.57905C0.296426 7.71293 1.98846 9.481 4.10731 9.83919C5.65453 10.0983 7.11028 9.6258 8.17733 8.71128L8.38312 8.92467V9.52673L11.63 12.7657C11.9425 13.0781 12.4455 13.0781 12.758 12.7657L12.7656 12.758C13.0781 12.4456 13.0781 11.9426 12.7656 11.6301L9.52638 8.38358ZM4.95332 8.38358C3.0555 8.38358 1.52353 6.85176 1.52353 4.95413C1.52353 3.0565 3.0555 1.52468 4.95332 1.52468C6.85114 1.52468 8.38312 3.0565 8.38312 4.95413C8.38312 6.85176 6.85114 8.38358 4.95332 8.38358Z" fill="#6B7280"/>
                                </svg>
                            </div>


                            <button className="new-exame-button" onClick={toggleCreateUserForm}>
                                Novo usuário
                            </button>
                        </div>
                        <div className="exames-table-container">
                            <table className="exames-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>CPF</th>
                                        <th>Módulo de acesso</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user) => (
                                            user.isActive ?
                                            <tr>
                                                <td><span>{user.name}</span></td>
                                                <td><span>{user.email}</span></td>
                                                <td><span>{user.docId}</span></td>
                                                <td><span>{user.modules[0]} { user.modules[1] ? `/ ${user.modules[1]}` : "" } {user.modules[2] ? `/ ${user.modules[2]}` : ""}</span></td>
                                                <td className="buttons-cell">
                                                    <button className="edit-button" title="Editar" data-user-id={user._id} onClick={toggleUpdateUserForm}>
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0 14.4625V17.5025C0 17.7825 0.22 18.0025 0.5 18.0025H3.54C3.67 18.0025 3.8 17.9525 3.89 17.8525L14.81 6.9425L11.06 3.1925L0.15 14.1025C0.0500001 14.2025 0 14.3225 0 14.4625ZM17.71 4.0425C18.1 3.6525 18.1 3.0225 17.71 2.6325L15.37 0.2925C14.98 -0.0975 14.35 -0.0975 13.96 0.2925L12.13 2.1225L15.88 5.8725L17.71 4.0425Z" fill="#333333"/>
                                                        </svg>
                                                    </button>
                                                    <button className="remove-button" title="Excluir" >
                                                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V6C13 4.9 12.1 4 11 4H3C1.9 4 1 4.9 1 6V16ZM10.5 1L9.79 0.29C9.61 0.11 9.35 0 9.09 0H4.91C4.65 0 4.39 0.11 4.21 0.29L3.5 1H1C0.45 1 0 1.45 0 2C0 2.55 0.45 3 1 3H13C13.55 3 14 2.55 14 2C14 1.45 13.55 1 13 1H10.5Z" fill="#F04F4F"/>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                            : ""
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="create-user">
                <div className="exame-form-wrapper">
                    <div className="exame-form-header">
                        <span>Novo Usuário</span>
                        <button onClick={toggleCreateUserForm}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none" >
                                <path d="M9.95979 1.11905C9.65979 0.819045 9.q17517 0.819045 8.87517 1.11905L5.11363 4.87289L1.3521 1.11135C1.0521 0.811353 0.56748 0.811353 0.26748 1.11135C-0.0325195 1.41135 -0.0325195 1.89597 0.26748 2.19597L4.02902 5.95751L0.26748 9.71904C-0.0325195 10.019 -0.0325195 10.5037 0.26748 10.8037C0.56748 11.1037 1.0521 11.1037 1.3521 10.8037L5.11363 7.04212L8.87517 10.8037C9.17517 11.1037 9.65979 11.1037 9.95979 10.8037C10.2598 10.5037 10.2598 10.019 9.95979 9.71904L6.19825 5.95751L9.95979 2.19597C10.2521 1.90366 10.2521 1.41135 9.95979 1.11905Z" fill="#333333" />
                            </svg>  
                        </button>
                    </div>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Nome</span>
                            <input type="text" name="name" id="newUserNameEl" placeholder="Ex.: João da Silva" onChange={handleNewUserDataChange} value={newUserData.name?.toString() || ""}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>E-mail:</span>
                            <input type="text" name="email" id="newEmailEl" placeholder="new@example.com" onChange={handleNewUserDataChange} value={newUserData.email?.toString() || ""}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <input type="text" name="docId" id="newDocIdEl" placeholder="000.000.000-00" maxLength={14} onChange={handleNewUserDataChange} value={newUserData.docId?.toString() || ""}/>
                        </div>

                        <div className="form-field-wrapper">
                            <span>Módulos de acesso:</span>
                            <div className="select-wrapper">
                                <button className="exame-type-select" onClick={() => setTypesDropdownOpen(!typesDropdownOpen)}>
                                    { "Selecione os módulos" }
                                    {
                                        !typesDropdownOpen ? <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 0.515078C15.6203 0.381003 15.4469 0.274644 15.2561 0.202078C15.0653 0.129513 14.8608 0.0921631 14.6543 0.0921631C14.4478 0.0921631 14.2433 0.129513 14.0525 0.202078C13.8617 0.274644 13.6883 0.381003 13.5424 0.515078L8.73612 4.92525C8.63785 5.01541 8.50459 5.06606 8.36564 5.06606C8.22669 5.06606 8.09343 5.01541 7.99517 4.92525L3.18998 0.515078C2.89521 0.244413 2.49536 0.0923037 2.0784 0.0922135C1.66143 0.0921233 1.26151 0.244059 0.966598 0.514597C0.67169 0.785134 0.505958 1.15211 0.505859 1.5348C0.505761 1.91749 0.671306 2.28454 0.966075 2.5552L5.77231 6.96634C6.11293 7.27899 6.51731 7.527 6.96237 7.6962C7.40742 7.86541 7.88444 7.9525 8.36617 7.9525C8.8479 7.9525 9.32491 7.86541 9.76997 7.6962C10.215 7.527 10.6194 7.27899 10.96 6.96634L15.7663 2.5552C16.061 2.28464 16.2265 1.91772 16.2265 1.53514C16.2265 1.15256 16.061 0.785644 15.7663 0.515078Z" fill="#333333"/></svg>
                                        : <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 7.52958C15.6203 7.66366 15.4469 7.77002 15.2561 7.84258C15.0653 7.91515 14.8608 7.9525 14.6543 7.9525C14.4478 7.9525 14.2433 7.91515 14.0525 7.84258C13.8617 7.77002 13.6883 7.66366 13.5424 7.52958L8.73612 3.11941C8.63785 3.02925 8.50459 2.9786 8.36564 2.9786C8.22669 2.9786 8.09343 3.02925 7.99517 3.11941L3.18998 7.52958C2.89521 7.80025 2.49536 7.95236 2.0784 7.95245C1.66143 7.95254 1.26151 7.8006 0.966598 7.53007C0.67169 7.25953 0.505958 6.89255 0.505859 6.50986C0.505761 6.12717 0.671306 5.76012 0.966075 5.48946L5.77231 1.07832C6.11293 0.765675 6.51731 0.517666 6.96237 0.34846C7.40742 0.179254 7.88444 0.0921636 8.36617 0.0921636C8.8479 0.0921636 9.32491 0.179254 9.76997 0.34846C10.215 0.517666 10.6194 0.765675 10.96 1.07832L15.7663 5.48946C16.061 5.76002 16.2265 6.12694 16.2265 6.50952C16.2265 6.8921 16.061 7.25902 15.7663 7.52958Z" fill="#333333"/></svg>

                                    }
                                    
                                </button>
                            </div>
                            <div className={typesDropdownOpen ? "exame-type-dropdown open" : "exame-type-dropdown"}>
                                <div className="opt-group">
                                    <label htmlFor="examesCheck">Exames</label>
                                    <input type="checkbox" name="exames" id="examesCheck" onChange={handleNewUserModules} />
                                </div>
                                <div className="opt-group">
                                    <label htmlFor="transportesCheck">Transportes</label>
                                    <input type="checkbox" name="transportes" id="transportesCheck" onChange={handleNewUserModules} />
                                </div>
                                <div className="opt-group">
                                    <label htmlFor="administracaoCheck">Administração</label>
                                    <input type="checkbox" name="administracao" id="administracaoCheck" onChange={handleNewUserModules} />
                                </div>
                            </div>
                        </div>

                        <div className="form-bottom-wrapper unique">
                            <button onClick={handleCreateUser}>
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="exame-form-container" id="update-user">
                <div className="exame-form-wrapper">
                    <div className="exame-form-header">
                        <span>Editar Usuário</span>
                        <button onClick={toggleUpdateUserForm}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none" >
                                <path d="M9.95979 1.11905C9.65979 0.819045 9.17517 0.819045 8.87517 1.11905L5.11363 4.87289L1.3521 1.11135C1.0521 0.811353 0.56748 0.811353 0.26748 1.11135C-0.0325195 1.41135 -0.0325195 1.89597 0.26748 2.19597L4.02902 5.95751L0.26748 9.71904C-0.0325195 10.019 -0.0325195 10.5037 0.26748 10.8037C0.56748 11.1037 1.0521 11.1037 1.3521 10.8037L5.11363 7.04212L8.87517 10.8037C9.17517 11.1037 9.65979 11.1037 9.95979 10.8037C10.2598 10.5037 10.2598 10.019 9.95979 9.71904L6.19825 5.95751L9.95979 2.19597C10.2521 1.90366 10.2521 1.41135 9.95979 1.11905Z" fill="#333333" />
                            </svg>  
                        </button>
                    </div>
                    <div className="exame-form-fields">
                        <div className="form-field-wrapper">
                            <span>Nome</span>
                            <input type="text" name="name" id="newUserNameEl" placeholder="Ex.: João da Silva" value={editUserData.name?.toString() || ""} />
                        </div>
                        <div className="form-field-wrapper">
                            <span>E-mail:</span>
                            <input type="text" name="email" id="newEmailEl" placeholder="new@example.com" value={editUserData.email?.toString() || ""}/>
                        </div>
                        <div className="form-field-wrapper">
                            <span>CPF:</span>
                            <input type="text" name="docId" id="newDocIdEl" placeholder="000.000.000-00" maxLength={14} value={editUserData.docId?.toString() || ""}/>
                        </div>

                        <div className="form-field-wrapper">
                            <span>Módulo de acesso:</span>
                            <div className="select-wrapper">
                                <button className="exame-type-select" onClick={() => setTypesDropdownOpen(!typesDropdownOpen)}>
                                    { "Selecione um módulo" }
                                    {
                                        !typesDropdownOpen ? <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 0.515078C15.6203 0.381003 15.4469 0.274644 15.2561 0.202078C15.0653 0.129513 14.8608 0.0921631 14.6543 0.0921631C14.4478 0.0921631 14.2433 0.129513 14.0525 0.202078C13.8617 0.274644 13.6883 0.381003 13.5424 0.515078L8.73612 4.92525C8.63785 5.01541 8.50459 5.06606 8.36564 5.06606C8.22669 5.06606 8.09343 5.01541 7.99517 4.92525L3.18998 0.515078C2.89521 0.244413 2.49536 0.0923037 2.0784 0.0922135C1.66143 0.0921233 1.26151 0.244059 0.966598 0.514597C0.67169 0.785134 0.505958 1.15211 0.505859 1.5348C0.505761 1.91749 0.671306 2.28454 0.966075 2.5552L5.77231 6.96634C6.11293 7.27899 6.51731 7.527 6.96237 7.6962C7.40742 7.86541 7.88444 7.9525 8.36617 7.9525C8.8479 7.9525 9.32491 7.86541 9.76997 7.6962C10.215 7.527 10.6194 7.27899 10.96 6.96634L15.7663 2.5552C16.061 2.28464 16.2265 1.91772 16.2265 1.53514C16.2265 1.15256 16.061 0.785644 15.7663 0.515078Z" fill="#333333"/></svg>
                                        : <svg width="17" height="8" viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7663 7.52958C15.6203 7.66366 15.4469 7.77002 15.2561 7.84258C15.0653 7.91515 14.8608 7.9525 14.6543 7.9525C14.4478 7.9525 14.2433 7.91515 14.0525 7.84258C13.8617 7.77002 13.6883 7.66366 13.5424 7.52958L8.73612 3.11941C8.63785 3.02925 8.50459 2.9786 8.36564 2.9786C8.22669 2.9786 8.09343 3.02925 7.99517 3.11941L3.18998 7.52958C2.89521 7.80025 2.49536 7.95236 2.0784 7.95245C1.66143 7.95254 1.26151 7.8006 0.966598 7.53007C0.67169 7.25953 0.505958 6.89255 0.505859 6.50986C0.505761 6.12717 0.671306 5.76012 0.966075 5.48946L5.77231 1.07832C6.11293 0.765675 6.51731 0.517666 6.96237 0.34846C7.40742 0.179254 7.88444 0.0921636 8.36617 0.0921636C8.8479 0.0921636 9.32491 0.179254 9.76997 0.34846C10.215 0.517666 10.6194 0.765675 10.96 1.07832L15.7663 5.48946C16.061 5.76002 16.2265 6.12694 16.2265 6.50952C16.2265 6.8921 16.061 7.25902 15.7663 7.52958Z" fill="#333333"/></svg>

                                    }
                                    
                                </button>
                            </div>
                            <div className={typesDropdownOpen ? "exame-type-dropdown open" : "exame-type-dropdown"}>
                                <div className="opt-group">
                                    <label htmlFor="editExamesCheck">Exames</label>
                                    <input type="checkbox" name="exames" id="editExamesCheck" />
                                </div>
                                <div className="opt-group">
                                    <label htmlFor="transporteditTransportesCheckesCheck">Transportes</label>
                                    <input type="checkbox" name="transportes" id="editTransportesCheck" />
                                </div>
                                <div className="opt-group">
                                    <label htmlFor="editAdministracaoCheck">Administração</label>
                                    <input type="checkbox" name="administracao" id="editAdministracaoCheck" />
                                </div>
                            </div>
                        </div>

                        <div className="form-bottom-wrapper unique">
                            <button>
                                Salvar
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

export default UsersPanel;