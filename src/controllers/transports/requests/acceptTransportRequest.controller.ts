import axios from "axios";

async function acceptTransportRequest(requestId: string, tripId: string) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/trip/request/accept/${requestId}`,
            {
                tripId: tripId
            }
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default acceptTransportRequest;