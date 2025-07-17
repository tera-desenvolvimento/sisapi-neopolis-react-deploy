import axios from 'axios';

export interface IPasswordData {
    userId: string;
    token: string;
    newPassword: string;
}

export async function resetPassword(props: IPasswordData) {
    const { userId, token, newPassword } = props;

    const response = await axios.post(
        `${process.env.REACT_APP_APIPATH}/user/resetPassword`,
        {
            userId: userId,
            token: token,
            newPassword: newPassword
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