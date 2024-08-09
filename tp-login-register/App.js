
import { Alert, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import HomeScreen from './src/screens/Home'
import RegisterScreen from './src/screens/Register'
import { Link } from '@react-navigation/native';


export default function App({ navigation }) {
  const urlLogin = "/api/user/login"
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [text, onChangeText] = useState('')
  const [pass, onChangeTextPass] = useState('')

  /*useEffect = () =>{
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
  }, []*/
  
  const handleLogin = () =>{
    navigation.navigate(HomeScreen);
  }

  const navigateToRegister = () =>{
    navigation.navigate(RegisterScreen);
  }

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.innerContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder='Ingrese el usuario'
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeTextPass}
        value={pass}
        secureTextEntry={true}
        placeholder='Ingrese la contraseña'
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={navigateToRegister}>¿No tenes cuenta?</Text>
    </View>
    <StatusBar style="auto" />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#00000',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
