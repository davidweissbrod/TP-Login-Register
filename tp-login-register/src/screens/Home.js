import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

const HomeScreen = ({ route }) => {
    const user = route.params
    return (
        <SafeAreaView style={styles.container}>
            <View style = {styles.innerContainer}>
                <Text style = {styles.welcome}> Bienvenido!</Text>
                <Text style = {styles.name}> {user.name}</Text>
                <Text style = {styles.last}> {user.last_name}</Text>
            </View>
        </SafeAreaView>
    )
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
      welcome: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
      },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    last: {
        fontSize: 20,
        fontWeight: '400',
        color: '#555',
    },
});

export default HomeScreen