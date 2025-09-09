import axios from "axios";

async function updateFixedTransport(transportId: string, updates: object) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/trip/fixed/update/${transportId}`,
            {
                updates: updates
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating transport:", error);
        throw error;
    }
}

export default updateFixedTransport;