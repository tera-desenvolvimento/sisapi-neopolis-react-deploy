import axios from "axios";

const WhapiImage = async (imageId: string): Promise<string> => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_WHAPI_URL}/media/${imageId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_WHAPI_TOKEN}`,
        },
        responseType: "arraybuffer", // garante que vem como buffer
      }
    );

    const blob = new Blob([response.data]); // cria um blob com os bytes

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // retorna base64
      reader.onerror = reject;
      reader.readAsDataURL(blob); // converte blob para base64
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
};

export default WhapiImage;