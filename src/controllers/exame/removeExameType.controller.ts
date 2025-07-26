import axios from "axios";

export async function removeExameType(exameTypeId: string) {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/exameType/remove/${exameTypeId}`);
    return response.data;
}