import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const urlLogin = "/api/user/login";
  const [username, onChangeUsername] = useState('');
  const [pass, onChangeTextPass] = useState('');

  const handleLogin = async () => {
    navigation.navigate('Home');
  }
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
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
        <Text style={styles.link} onPress={navigateToRegister}>¿No tienes cuenta?</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default LoginScreen;
