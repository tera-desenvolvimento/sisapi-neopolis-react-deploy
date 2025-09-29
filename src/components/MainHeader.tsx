import React, { useState } from "react";

import { getCookies, doLogout } from "../controllers/user/authenticate.controller";

import logoSisapiNeopolis from "../img/sisapi-neopolis.svg";

import "../style/mainHeader.css";

type UserData = {
    docId: string,
    email: string,
    name: string,
    role: string,
    token: string,
    userId: string
}

function MainHeader() {
    const userData = getCookies("userData") as UserData;
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return (
        <React.Fragment>
            <div className="main-header-container">
                <img src={logoSisapiNeopolis} className="logo-header" />

                <button className={userMenuOpened ? "user-menu-button open" : "user-menu-button"} onClick={() => setUserMenuOpened(!userMenuOpened)}>
                    {userData.name.split(" ")[0]}
                </button>
            </div>
            <div className={userMenuOpened ? "logout-menu open" : "logout-menu"}>
                <a href="/">
                    <span>Trocar módulo</span>
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.52667 1.41333L9.44667 3.33333H0.666667C0.3 3.33333 0 3.63333 0 4C0 4.36667 0.3 4.66667 0.666667 4.66667H9.44667L7.52667 6.58667C7.26667 6.84667 7.26667 7.26667 7.52667 7.52667C7.78667 7.78667 8.20667 7.78667 8.46667 7.52667L11.5267 4.46667C11.7867 4.20667 11.7867 3.78667 11.5267 3.52667L8.46667 0.466667C8.20667 0.206667 7.78667 0.206667 7.52667 0.466667C7.27333 0.726667 7.26667 1.15333 7.52667 1.41333ZM12.6667 0.666667V7.33333C12.6667 7.7 12.9667 8 13.3333 8C13.7 8 14 7.7 14 7.33333V0.666667C14 0.3 13.7 0 13.3333 0C12.9667 0 12.6667 0.3 12.6667 0.666667Z" fill="#333333"/>
                    </svg>
                </a>
                <button className="logout" onClick={doLogout}>
                    <span>Sair</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8925 0.3025C12.5025 -0.0874998 11.8725 -0.0874998 11.4825 0.3025L6.5925 5.1825L1.7025 0.2925C1.3125 -0.0975 0.6825 -0.0975 0.2925 0.2925C-0.0975 0.6825 -0.0975 1.3125 0.2925 1.7025L5.1825 6.5925L0.2925 11.4825C-0.0975 11.8725 -0.0975 12.5025 0.2925 12.8925C0.6825 13.2825 1.3125 13.2825 1.7025 12.8925L6.5925 8.0025L11.4825 12.8925C11.8725 13.2825 12.5025 13.2825 12.8925 12.8925C13.2825 12.5025 13.2825 11.8725 12.8925 11.4825L8.0025 6.5925L12.8925 1.7025C13.2725 1.3225 13.2725 0.6825 12.8925 0.3025Z" fill="#EF4444"/>
                    </svg>
                </button>
            </div>
        </React.Fragment>
    )
}

export default MainHeader;