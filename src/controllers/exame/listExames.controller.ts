import axios from "axios";

export interface IResponse {
    data: IExame[];
    status: number;
    message: string;
}

export interface IExame {
    exameId: string;
    type: string;
    patientName: string;
    docId: string;
    patientNumber: string;
    arrivedDate: string;
    alerted: boolean;
    delivered: boolean;
    retiranteName: string;
    retiranteDocId: string;
    retiradaDate: string;
}

export async function listExames() {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/exame/list`
    );

    return response.data;
}

export async function listDeliveredExames() {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/exame/listDeliveredExames`
    );

    return response.data;
}