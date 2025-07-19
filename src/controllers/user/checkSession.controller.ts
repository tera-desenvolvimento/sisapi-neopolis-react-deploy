import axios from "axios";

import { getCookies, removeCookies } from "./authenticate.controller";

const authenticationUrls = [
    '/login',
    '/esqueci-minha-senha',
    '/resetar-senha'
];

window.addEventListener('load', () => {
    const currentPath = window.location.pathname;

    if (authenticationUrls.includes(currentPath)) {
        return;
    }

    const sessionId = getCookies('sessionId');

    if (!sessionId) {
        window.location.href = '/login';
        return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/user/checksession`, {
        token: sessionId
    })
    .then(response => {
        if (response.data.status !== 200) {
            removeCookies('sessionId');
            removeCookies('userData');
            window.location.href = '/login';
        }
    })
    .catch(() => {
        removeCookies('sessionId');
        removeCookies('userData');
        window.location.href = '/login';
    });
});