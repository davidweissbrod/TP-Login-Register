import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { AuthContext } from '../../context/auth';
import { getEventById } from '../../services/events';
import { getEventParticipants } from '../../services/events';
import { enrollUser } from '../../services/events';


export default function DetalleEvento({ route }) {
  const { eventId, fromScreen } = route.params; 
  const { token } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvent = async () => { 
      try {
        const eventDetails = await getEventById(eventId, token); 
        setEvent(eventDetails);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchParticipants = async () => { 
      try {
        const participantsData = await getEventParticipants(eventId); 
        setParticipants(participantsData);
      } catch (error) {
        console.error('Error al obtener participantes: ', error);
      }
    };
    fetchEvent();
    fetchParticipants();
  }, [eventId, token]);


  const enroll = async () => { 
    const response = await enrollUser(eventId, token); 
    if(response.status == 200){ 
        Alert.alert(
          'Success',
          `${user.username} inscripto correctamente`, 
          [{ text: 'OK'}],
          { cancelable: false }
        );
      }
      else{
        Alert.alert(
          'Error',
          `${user.username, response}`,
          [{ text: 'OK'}],
          { cancelable: false }
        );
      }
}


const navigateToEdit = () => { 
  navigation.navigate('EditEvent', {eventId});
}
  

  return ( 
    // Toda la info del evento
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
      <View>
      {fromScreen === 'Admin' ? ( 
        new Date(event.start_date) < currentDate ? ( 
        <TouchableOpacity onPress={navigateToEdit} style={styles.enrollButton}>
            <Text style={styles.enrollButtonText}>Editar</Text> 
        </TouchableOpacity>
      ) : null 
      ) : fromScreen === 'Home' ? ( 
        <TouchableOpacity onPress={enroll} style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>Inscribirse</Text> 
        </TouchableOpacity>
      ) : null}
      </View>

      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>Participantes</Text>
        {participants.length > 0 ? ( 
          participants.map((participant, index) => (
            <View key={index} style={styles.participant}>
              <Text style={styles.participantText}>{participant.first_name} {participant.last_name}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noParticipants}>No hay participantes registrados</Text>
        )}
      </View>

      <Modal 
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Inscripto correctamente</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    width: '50%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  participantsSection: { 
    marginTop: 20, 
    padding: 10, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 10 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 10 
  },
  participant: { 
    padding: 10, 
    backgroundColor: '#fff', 
    borderRadius: 6, 
    marginBottom: 10 
  },
  participantText: { 
    fontSize: 16, 
    color: '#333' 
  },
  noParticipants: { 
    fontSize: 16, 
    color: '#777', 
    textAlign: 'center' 
  },
  enrollButton: {
    backgroundColor: '#007BFF', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
