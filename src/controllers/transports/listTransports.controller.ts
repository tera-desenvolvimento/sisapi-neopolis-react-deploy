import axios from "axios";

async function listTransports(date: string) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/trip/list`,
            { date }
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default listTransports;
