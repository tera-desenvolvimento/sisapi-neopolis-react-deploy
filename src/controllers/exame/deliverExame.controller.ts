export interface IDeliverExame {
    exameId: string;
    retiranteDocId: string;
    retiranteName: string;
}

export async function deliverExame(data: IDeliverExame) {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/exame/deliver`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Erro ao entregar exame");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao entregar exame:", error);
    }
}