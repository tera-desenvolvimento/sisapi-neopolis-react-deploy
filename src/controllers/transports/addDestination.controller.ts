import axios from "axios";

async function addDestination(location: string) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/tripDestination/create`,
            { location }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding destination:", error);
        throw error;
    }
}

export default addDestination;