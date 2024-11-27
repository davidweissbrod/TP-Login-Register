import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {RegisterUser} from '../../services/users';

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !password || !confirmPassword) {
      Alert.alert('Por favor, complete el formulario.');
      return;
    }
    try
    {
        const result = await RegisterUser(firstName,lastName,password,username) 
        if (result.status === true) {
            navigation.navigate('Home');
        }
    }  
    catch(error)
    {
        console.error('Login error:', error);
        setErrorMessage('Error de login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Usuario (mail)"
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
      <Button title="Registrar" onPress={handleRegister} />
      <br/>
      <Button
        title="Ir a Login"
        onPress={() => navigation.navigate('Login')}
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Fondo claro para mantenerlo limpio
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',  // Centra todos los elementos verticalmente
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
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
    elevation: 3,  // Sombra suave para dar un efecto elevado
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',  // Azul para el botón "Volver"
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#4CAF50', // Verde para el botón "Registrar"
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Register;