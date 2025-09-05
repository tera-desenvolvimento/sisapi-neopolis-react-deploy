import axios from "axios";

async function notifyPatient(tripId: string, patientName: string, patientNumber: string, destination: string) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/trip/notifyPatient`, {
            tripId,
            patientName: patientName.split(" ")[0],
            patientNumber,
            destination
        });

        return response.data;
    } catch (error) {
        console.error("Error notifying patient:", error);
        throw error;
    }
}

export default notifyPatient;