import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ event, type }) {
  return (
    <View style={styles.card}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.price}>${event.price}</Text>
        <Text style={styles.location}>{event.event_location.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
      alignSelf: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    price: {
      fontSize: 18,
      color: '#1E90FF',
      fontWeight: '600',
      marginBottom: 5,
    },
    location: {
      fontSize: 16,
      color: '#666',
    },
  });
  