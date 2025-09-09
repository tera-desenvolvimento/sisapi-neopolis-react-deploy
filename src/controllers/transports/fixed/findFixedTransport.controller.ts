import axios from "axios";

async function findFixedTransport(id: string) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/trip/fixed/${id}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching transport:", error);
        throw error;
    }
}

export default findFixedTransport;
