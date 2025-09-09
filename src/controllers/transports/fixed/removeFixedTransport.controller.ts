import axios from "axios";

async function removeFixedTransport(transportId: string) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/trip/fixed/remove/${transportId}`
        );
        
        return response.data;
    } catch (error) {
        console.error("Error removing transport:", error);
        throw error;
    }
}

export default removeFixedTransport;
