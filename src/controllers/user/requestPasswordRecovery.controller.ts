import axios from 'axios';

export interface IRecoverData {
    email: string;
}

export async function requestPasswordRecovery(props: IRecoverData) {
    const { email } = props;

    const response = await axios.post(
        `${process.env.REACT_APP_APIPATH}/user/requestPasswordRecovery`,
        {
            email: email
        },
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}