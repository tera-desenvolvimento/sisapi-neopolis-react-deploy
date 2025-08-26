import axios from "axios";

async function removeVehicle(vehicleId: string) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/vehicle/remove/${vehicleId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error removing vehicle:", error);
        throw error;
    }
}

export default removeVehicle;
