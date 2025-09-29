import axios from "axios";

export interface IRemoveData {
    exameId: string
}

export async function removeExame(removeData: IRemoveData) {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/exame/remove/${removeData.exameId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao remover exame:", error);
        throw error;
    }
}