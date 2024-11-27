import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const user_login = async (Username,Password) => {
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,  
  };
  const data =
  {
    username: Username,
    password: Password,
  }
  try {
    const result = await api('POST', headers, data, 'user/login');
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
};

export const ObtenerInfoJugador = async (token) => {
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "ngrok-skip-browser-warning": true,  
  };
  const data = {};  
  const path = "auth/Decode";  
  
  try {
    const result = await api(method, headers, data, path);
    console.log('User info response:', result.data);  
    return result.data;
  } catch (error) {
    console.error('Error en ObtenerInfoJugador:', error.message);
    await AsyncStorage.removeItem('@AccessToken');
    return { error: error.message };
  }
};
export const RegisterUser = async (firstName,lastName,Password,Username) =>
{

    const headers = {
        "Content-Type": "application/json",
    }

    const data =
  {
    first_name: firstName,
    last_name: lastName,
    username: Username,
    password: Password,
  }
  try {
    const result = await api('POST', headers, data, 'user/register');
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
}

