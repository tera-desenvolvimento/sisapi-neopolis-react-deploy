import axios from "axios";

export interface IExameResponse {
    data: IExameType[];
    status: number;
    message: string;
}

export interface IExameType {
    exameTypeId: string;
    type: string;
}

export async function listExameTypes() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/exameType/list`);
        return response.data;
    } catch (error) {
        console.error("Erro ao listar tipos de exame:", error);
        throw error;
    }
}