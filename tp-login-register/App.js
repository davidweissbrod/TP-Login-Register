import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons'; 
import HomeScreen from './src/screens/Home';
import NuevoEventoScreen from './src/screens/NewEvent';
import EditarEventoScreen from './src/screens/EditEvent';
import DetalleEventoScreen from './src/screens/DetailEvent';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import { Auth } from './context/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); 

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'NewEvent') {
            iconName = 'add-circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007aff', 
        tabBarInactiveTintColor: 'gray',   
        tabBarStyle: {
          paddingBottom: 5,
          height: 60, 
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Nuevo Evento" component={NuevoEventoScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Auth>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="DetailEvent" component={DetalleEventoScreen} />
          <Stack.Screen name="EditEvent" component={EditarEventoScreen} />
          <Stack.Screen name="HomeTabs" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Auth>
  );
}
