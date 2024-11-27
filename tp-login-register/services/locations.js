import api from "./api";


const getLocations = async (token) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "ngrok-skip-browser-warning": true,  
  };
  const data = {}
  try {
    const result = await api('Get', headers, data, 'event-location/getAll');
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
};

export default {getLocations}
