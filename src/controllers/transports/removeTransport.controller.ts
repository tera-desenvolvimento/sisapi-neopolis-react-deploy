import axios from "axios";

async function removeTransport(transportId: string) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/trip/remove/${transportId}`
        );
        
        return response.data;
    } catch (error) {
        console.error("Error removing transport:", error);
        throw error;
    }
}

export default removeTransport;
