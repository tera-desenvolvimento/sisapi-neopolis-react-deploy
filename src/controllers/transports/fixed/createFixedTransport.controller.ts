import axios from "axios";

async function createFixedTransport() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/trip/fixed/create`);
        return response.data;
    } catch (error) {
        console.error("Error creating fixed transport:", error);
        throw error;
    }
}

export default createFixedTransport;