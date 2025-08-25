import axios from "axios";

async function createTransport(date: any) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/trip/create`, { date });
        return response.data;
    } catch (error) {
        console.error("Error creating transport:", error);
        throw error;
    }
}

export default createTransport;