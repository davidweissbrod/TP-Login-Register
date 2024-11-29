import api from "./api";

const getCategory = async () => {
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,  
  };
  const data = {}
  try {
    const result = await api('GET', headers, data, 'event-category/getAll');
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
};

export default {getCategory}