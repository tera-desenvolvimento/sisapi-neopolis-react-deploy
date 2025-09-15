import axios from "axios";

async function declineTransportRequest(requestId: string, reason: string) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/trip/request/decline/${requestId}`,
            {
                reason: reason
            }
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default declineTransportRequest;