import axios from "axios";

async function removeDestination(destinationId: string) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/tripDestination/remove/${destinationId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error removing destination:", error);
        throw error;
    }
}

export default removeDestination;
