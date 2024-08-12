import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View } from 'react-native';

const HomeScreen = ({ route }) => {
    const user = route.params
    return (
        <SafeAreaView style={styles.container}>
            <Text style = {styles.welcome}> Bienvenido!</Text>
            <Text style = {styles.name}> {user.name}</Text>
            <Text style = {styles.last}> {user.last_name}</Text>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
   
});

export default HomeScreen