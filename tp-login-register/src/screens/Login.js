import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Button from 'react-bootstrap'   
import { AuthContext } from "../../context/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); 
  const { login } = useContext(AuthContext);

  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  }

  const handleLogin = async () => { 
    if (email && password) {
      const res = await login(email, password);
      if(res.success){
        Alert.alert(
          'Success',
          `${email} logeado correctamente`, 
          [{ text: 'OK'}],
          { cancelable: false }
        );
      }
      else{
        Alert.alert(
          'Error',
          `${res.message}`,
          [{ text: 'OK'}],
          { cancelable: false }
        );
      }
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Text style={styles.noCuenta} onPress={handleRegisterNavigation}>¿No tienes cuenta?</Text>
      <Button variant="primary" onPress={handleLogin} style={styles.buttonLogin}>Log in</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noCuenta: {
    fontSize: 14,
    color: '#1E90FF',
    marginVertical: 15,
    textDecorationLine: 'underline',
  },
  buttonLogin: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonLoginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});