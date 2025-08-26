import axios from "axios";

async function removeDriver(driverId: string) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/driver/remove/${driverId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error removing driver:", error);
        throw error;
    }
}

export default removeDriver;
