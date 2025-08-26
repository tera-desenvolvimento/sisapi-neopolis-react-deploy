import axios from "axios";

async function addVehicle(vehicleData: any) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/vehicle/create`,
            vehicleData
        );
        
        return response.data;
    } catch (error) {
        console.error("Error adding vehicle:", error);
        throw error;
    }
}

export default addVehicle;
