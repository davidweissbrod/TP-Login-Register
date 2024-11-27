import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {user_login} from '../../services/users';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const result = await user_login(username, password);
      if (result.status === 200) {
        const token = result.data.token;
        await AsyncStorage.setItem("storedToken", token);
        navigation.navigate('Home', { token });
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrecta');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Error de login');
    }
  };
  const handleLoginAdmin = async () => {
    try {
      const result = await user_login(username, password);
      if (result.status === 200) {
        const token = result.data.token;
        await AsyncStorage.setItem("storedToken", token);
        navigation.navigate('Admin', { token });
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrecta');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Error de login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}> Regístrate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.adminContainer}>
        <TouchableOpacity style={styles.adminButton} onPress={handleLoginAdmin}>
          <Text style={styles.adminButtonText}>Iniciar como Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',  // Fondo claro y limpio
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',  // Centra todo en la pantalla
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,  // Sombra suave en el input
  },
  errorText: {
    color: '#f44336',  // Rojo para errores
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#555',
  },
  registerLink: {
    fontSize: 16,
    color: '#2196F3',  // Azul para el enlace
    fontWeight: 'bold',
  },
  adminContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminButton: {
    backgroundColor: '#FF9800',  // Naranja para el botón de Admin
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF9800',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,  // Botón con sombra
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;