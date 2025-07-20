import axios from "axios";

export interface ICreateExame {
    docId: string;
    type: string;
    patientName: string;
    patientNumber: string;
}

export async function createExame(exameData: ICreateExame) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/exame/create`, exameData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar exame:", error);
        throw error;
    }
}