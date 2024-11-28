import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/Home.js';
import Login from './src/screens/Login.js';
import Register from './src/screens/Register.js';
import NewEvent from './src/screens/NewEvent.js';
import Inscription from './src/screens/Inscription.js';
import Admin from './src/screens/Admin.js';
import EditEvent from './src/screens/EditEvent.js';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Admin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="NewEvent" component={NewEvent} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen  name="Admin" component={Admin} />
        <Stack.Screen name= "EditEvent" component={EditEvent} />
      </Stack.Navigator>
    </NavigationContainer>
  );}