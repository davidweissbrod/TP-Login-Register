import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, validateToken, registerUser} from '../services/Users'

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
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        if (userData) {
          setUser(JSON.parse(userData));
          setToken(token);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUser();
  }, []);

  const signIn = async (user, pass) => {
    let response = await loginUser(user, pass);
    
    if(response.success){
      let userResponse = await validateToken(response.token);

      const authenticatedUser = {
        first_name: userResponse.first_name,
        last_name: userResponse.last_name,
        username: userResponse.username,
        password: userResponse.password
      }

      setToken(response.token);
      setUser(authenticatedUser);
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(authenticatedUser));
    }
    else{
      return response;
    }
  };

  const register = async (user, pass, first, last) => {
    const authenticatedUser = {
      username: user,
      password: pass,
      first_name: first,
      last_name: last
    }

    let response = await registerUser(authenticatedUser);

    if(response.success === false){
      return response;
    }
    else{
      setUser(authenticatedUser);
      setToken(response.token)
      await AsyncStorage.setItem('user', JSON.stringify(authenticatedUser));
      await AsyncStorage.setItem('token', response.token);
      return {
        success: true
      }
    }
  };

  const signOut = async () => {
    setUser({
        first_name: '',
        last_name: '',
        username: '',
        password: ''
    });
    await AsyncStorage.removeItem('token');
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