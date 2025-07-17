import axios from 'axios';
import Cookies from 'universal-cookie';

export interface IAuthenticateData {
    docId: string;
    password: string;
}

export interface ICookieData {
    name: string;
    value: string;
}

export interface IUserData {
    docId: string;
}

export function setCookie(props:ICookieData) {
    const cookies = new Cookies();
    cookies.set(props.name, props.value);
}

export function getCookies(props:string) {
    const cookies = new Cookies();
    return cookies.get(props);
}

export function removeCookies(props:string) {
    const cookies = new Cookies();
    cookies.remove(props);
}

export async function authenticate(props:IAuthenticateData) {
    const { docId, password } = props;

    console.log(process.env.REACT_APP_API_URL);

    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/auth`,
        { docId, password },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    return response.data;
}

export async function getUserData(props:IUserData) {
    const { docId } = props;

    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/${docId}`,
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });

    return response.data;
}

export function doLogout() {
    removeCookies('sessionId')
    removeCookies('userData');
    window.location.href = '/login';
}