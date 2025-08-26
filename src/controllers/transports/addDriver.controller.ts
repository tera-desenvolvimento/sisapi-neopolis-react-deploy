import axios from "axios";

async function addDriver(driverData: any) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/driver/create`,
            driverData
        );

        return response.data;
    } catch (error) {
        console.error("Error adding driver:", error);
        throw error;
    }
}

export default addDriver;
