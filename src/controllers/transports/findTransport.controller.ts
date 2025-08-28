import axios from "axios";

async function findTransport(id: string) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/trip/${id}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching transport:", error);
        throw error;
    }
}

export default findTransport;
