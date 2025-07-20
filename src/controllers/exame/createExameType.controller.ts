import axios from "axios";

export async function createExameType(type: string) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/exameType/add`, { type });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar tipo de exame:", error);
        throw error;
    }
}