import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, validateToken, registerUser} from '../services/users.js'

export const AuthContext = createContext();

export const Auth= ({ children }) => {
  const [token, setToken] = useState(null); 
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: ''
  })

  useEffect(() => {
    const loadUser = async () => { // Traigo el usuario existente y token
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        if (userData) {
          setUser(JSON.parse(userData)); // guardo los datos y el token del usuario
          setToken(token);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUser();
  }, []);

  const signIn = async (user, pass) => { // Funcion para hacer log in
    let response = await loginUser(user, pass); // Llama a la funcion del service del user
    
    if(response.success){
      let userResponse = await validateToken(response.token); // Valida el token del usuario

      const authenticatedUser = { // LLeva al usuario con los datos obtenidos
        first_name: userResponse.first_name,
        last_name: userResponse.last_name,
        username: userResponse.username,
        password: userResponse.password
      }

      setToken(response.token);
      setUser(authenticatedUser);
      await AsyncStorage.setItem('token', response.token); // guarda el token y el usuario
      await AsyncStorage.setItem('user', JSON.stringify(authenticatedUser));
    }
    else{
      return response;
    }
  };

  const register = async (user, pass, first, last) => {
    const authenticatedUser = { // Llena al nuevo usuario con la data traida de los parametros
      username: user,
      password: pass,
      first_name: first,
      last_name: last
    }

    let response = await registerUser(authenticatedUser); // Llama a la funcion para registrarse del service del user

    if(!response.success){ // Si falla tira error
      return response;
    }
    else{
      setUser(authenticatedUser); // Si va guarda la data el user y el token
      setToken(response.token)
      await AsyncStorage.setItem('user', JSON.stringify(authenticatedUser));
      await AsyncStorage.setItem('token', response.token);
      return {
        success: true
      }
    }
  };

  const signOut = async () => { // Funcion para desloguearse
    setUser({ // Borra los datos del usuario
        first_name: '',
        last_name: '',
        username: '',
        password: ''
    });
    await AsyncStorage.removeItem('token'); // Borra el token y el usuario
    await AsyncStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      token,
      signIn,
      signOut,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};