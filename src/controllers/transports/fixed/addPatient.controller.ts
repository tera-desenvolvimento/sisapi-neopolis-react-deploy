import axios from "axios";

async function addPatient(transportId: string, patientData: any) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/trip/fixed/addPatient/${transportId}`,
            {
                patientData: patientData
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding patient:", error);
        throw error;
    }
}

export default addPatient;