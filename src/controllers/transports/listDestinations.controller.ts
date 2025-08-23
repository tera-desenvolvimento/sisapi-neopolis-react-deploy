import axios from "axios";

async function listDestinations() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/tripDestination/list`
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default listDestinations;