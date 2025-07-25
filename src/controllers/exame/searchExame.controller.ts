import axios from "axios";

export interface ISearch {
    delivered: boolean,
    queryString: string
}

export async function searchExame(searchData: ISearch) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/exame/search`, searchData);
        return response.data;
    } catch (error) {
        return error;
    }
}