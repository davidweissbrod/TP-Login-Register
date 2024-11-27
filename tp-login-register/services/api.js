import axios from "axios";
  
const API_URL = "http://localhost:3000/api";

const api = async (method, headers, data, path) => { 
  try {
    const response = await axios({
      method: method,
      url: `${API_URL}/${path}`,
      data: data,
      headers: headers,
    });
    return response;  
  } catch (error) {
    console.error(`Error en la solicitud POST a ${path}: ${error.message}`);
    throw new Error(`Error en la solicitud POST a ${path}: ${error.message}`);
  }
};

export default api;