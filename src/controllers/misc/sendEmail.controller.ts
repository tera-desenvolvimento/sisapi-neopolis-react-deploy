import axios from "axios";

export interface IEmailData {
    email: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(data: IEmailData) {
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sendEmail`,
        data,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}
