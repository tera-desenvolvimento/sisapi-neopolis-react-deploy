import axios from 'axios';

export interface IPasswordData {
    userId: string;
    token: string;
    newPassword: string;
}

export async function resetPassword(props: IPasswordData) {
    const { userId, token, newPassword } = props;

    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/resetPassword`,
        {
            userId: userId,
            token: token,
            newPassword: newPassword
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;

}