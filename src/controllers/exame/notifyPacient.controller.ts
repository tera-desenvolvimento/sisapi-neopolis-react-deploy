import axios from "axios";

export interface IMessageResponse {
    success: boolean;
}

export interface INotifyResponse {
    data: IMessageResponse;
    status: number;
    message: string;
}

export async function notifyPacient(exameId: string) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/exame/notifyPacient`,
            { exameId }
        );
        return response.data;
    } catch (error) {
        console.error("Error notifying patient:", error);
        throw error;
    }
}