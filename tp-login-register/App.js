import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login.js';
import HomeScreen from './src/screens/Home.js';
import RegisterScreen from './src/screens/Register.js'; 
import NewEventScreen from './src/screens/NewEvent.js'
import { Auth } from './context/auth.js'

const Stack = createStackNavigator();

export default function App() {
  return (
    <Auth>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Nuevo Evento" component={NewEventScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </Auth>
  );
}
