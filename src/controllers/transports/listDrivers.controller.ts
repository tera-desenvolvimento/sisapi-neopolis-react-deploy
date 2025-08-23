import axios from "axios";

async function listDrivers() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/driver/list`
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default listDrivers;