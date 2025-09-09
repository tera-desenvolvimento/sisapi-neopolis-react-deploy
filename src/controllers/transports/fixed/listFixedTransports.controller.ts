import axios from "axios";

async function listFixedTransports() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/trip/fixed/list`);
        return response.data;
    } catch (error) {
        console.error("Error returning fixed transports:", error);
        throw error;
    }
}

export default listFixedTransports;