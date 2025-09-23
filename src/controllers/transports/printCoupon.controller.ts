import axios, { AxiosError } from "axios";

async function printCoupon(paciente: string, dataViagem: string, horaViagem: string, destino: string, motorista: string) {
    try {
        const response = await axios.post("http://localhost:3000/print-comp", {
            paciente,
            dataViagem,
            horaViagem,
            destino,
            motorista
        })

        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                console.warn("Recurso não encontrado (404).");
                return {
                    error: "SERVICE_DOESNT_INSTALLED"
                }
            } else if (error.response?.status === 500){
                console.warn("Recurso não encontrado (500).");
                return {
                    error: "PRINTER_WITHOUT_COMUNICATION"
                }
            } else if (error.code === "ERR_NETWORK") {
                return {
                    error: "AXIOS_REQUEST_ERROR"
                }
            } else{
                console.error("Erro da API:", error);
            }
        } else {
            console.error("Erro inesperado:", error);
        }
  }
}

export default printCoupon;