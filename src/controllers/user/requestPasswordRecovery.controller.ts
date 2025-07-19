import axios from 'axios';

export interface IRecoverData {
    email: string;
}

export async function requestPasswordRecovery(props: IRecoverData) {
    const { email } = props;

    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/requestPasswordRecovery`,
        {
            email: email
        }
    );

    return response.data;
}