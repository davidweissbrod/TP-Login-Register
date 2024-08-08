import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Alert, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import HomeScreen from './src/screens/Home'
import RegisterScreen from './src/screens/Register'
const stack = createNativeStackNavigator()

export default function App() {
  const urlLogin = "/api/user/login"
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [text, onChangeText] = useState('')
  const [pass, onChangeTextPass] = useState('')
  const navigationHook = useNavigation()
  useEffect = () =>{
    const fetchDataLogin = async () => {
      try {
        const response = await fetch(urlLogin);
        const data = await response.json();
        setUsername(data.data)
        setPassword(data.data)
      } catch (e) {
        console.error('Error:', e);
      }
    };
    fetchDataLogin();
  }, []
  
  const handleLogin = () =>{
    if(text === username && pass === password){
      navigationHook.navigate('Home')
    }else{
      Alert('Usuario o contraseña incorrectos')
    }
  }
  const handleRegister = () =>{
    navigationHook.navigate('Register')
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder='Ingrese el usuario'
      /> 
      <TextInput
        style={styles.input}
        onChangeText={onChangeTextPass}
        value={pass}
        secureTextEntry={true}
        placeholder='Ingrese la contraseña'
      />
      <TouchableOpacity title='Log in' onPress={handleLogin}></TouchableOpacity>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 300,
    margin: 9,
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 5
  },
});
