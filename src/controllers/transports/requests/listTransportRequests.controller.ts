import axios from "axios";

async function listTransportRequests() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/trip/request/list/`
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default listTransportRequests;