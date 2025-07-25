import axios from "axios";

export interface IEditExame {
    exameId: string;
    docId: string;
    type: string;
    arriveDate: string;
    pacientName: string;
    pacientNumber: string;
}

export async function editExame(exameData: IEditExame) {
    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/exame/update`, exameData);
        return response.data;
    } catch (error) {
        console.error("Erro ao editar exame:", error);
        throw error;
    }
}