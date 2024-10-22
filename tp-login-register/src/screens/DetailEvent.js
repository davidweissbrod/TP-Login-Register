import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/auth';
import { getEventById } from '../../services/events';

export default function DetalleEvento({ route }) {
  const { eventId } = route.params;
  const { token } = useContext(AuthContext);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDetails = await getEventById(eventId, token);
        setEvent(eventDetails);
      } catch (error) {
        console.error(error);
      } 
    };

    fetchEvent();
  }, [eventId, token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Creador: {event.creator_user.first_name} {event.creator_user.last_name}</Text>
        <Text style={styles.infoText}>Fecha de inicio: {new Date(event.start_date).toLocaleDateString()}</Text>
        <Text style={styles.infoText}>Ubicación: {event.event_location.full_address}</Text>
        <Text style={styles.infoText}>Duración: {event.duration_in_minutes} minutos</Text>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Capacidad máxima: {event.max_capacity}</Text>
        <Text style={styles.infoText}>Máxima asistencia: {event.max_assistance}</Text>
        <Text style={styles.price}>Precio: ${event.price}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
