import axios from "axios";

async function listVehicles() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/vehicle/list`
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default listVehicles;