import axios from 'axios';

const API_URL = 'https://localhost:3000';

export const loginUser = async (username, password) => { // Loguea al usuario
    try {
      const response = await axios.post(`${API_URL}/user/login`, { // Mete la data ingresada por el usuario y revisa que este bien
        username: username,
        password: password
      });
  
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  export const registerUser = async (userData) => { // Registra al usuario
    try {
      const response = await axios.post(`${API_URL}/user/register`, { // Mete la data ingresada por el usuario 
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        password: userData.password
      });
  
      if (response.status === 201) { 
        const login = await loginUser(userData.username, userData.password); // Si va loguea al usuario y lo ingresa, tambien le genera un token
        const payload = await validateToken(login.token);
        return {
          payload: payload,
          token: login.token
        };
      } else {
        return false;
      }
    } catch (error) {
      console.log('No se pudo registrar:', error.response ? error.response.data : error.message);
      return {
        success: false,
        message: error.response.data
      }
    }
  };

export const validateToken = async (token) => { // Valida un token 
    try 
    {
        const response = await axios.get(`${API_URL}/user/validartoken`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.user;
    } catch (error) {
      console.log('No se pudo loguear:', error.message || error);
    }
};