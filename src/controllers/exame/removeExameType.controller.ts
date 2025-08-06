import axios from "axios";

export async function removeExameType(exameType: string) {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/exameType/remove/${exameType}`);
    return response.data;
}