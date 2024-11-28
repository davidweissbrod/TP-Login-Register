import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import events from '../../services/events';
import { useNavigation } from '@react-navigation/native'; 
import moment from 'moment';

const decodeTokenManual = (token) => {
  try {
    const [header, payload, signature] = token.split('.');
    if (!payload) throw new Error('Token inválido');
    const base64Url = payload.replace(/_/g, '/').replace(/-/g, '+');
    const base64 = atob(base64Url);
    const user = JSON.parse(base64);
    return user;
  } catch (error) {
    console.error('Error al decodificar el token manualmente:', error);
    return null;
  }
};

const Admin = ({ route }) => {
  const { token } = route.params;
  const [user, setUser] = useState({});
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [participantsModalVisible, setParticipantsModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [eventId, setEventId] = useState([]);
  const [participantsContent, setParticipantsContent] = useState([]);
  const [detailsContent, setDetailsContent] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {

    if (token) {
      const decodedUser = decodeTokenManual(token);
      console.log("Usuario decodificado:", decodedUser);
      setUser(decodedUser);
    }

    const fetchEvents = async () => {
      try {
        const response = await events.getEvents();
        const eventsArray = Array.isArray(response.data) ? response.data : [];
        const currentDate = moment();

        const upcomingEvents = eventsArray.filter(event => {
          const eventDate = moment(event.start_date);
          return eventDate.isAfter(currentDate, 'day') || eventDate.isSame(currentDate, 'day');
        });

        const expiredEvents = eventsArray.filter(event => {
          const eventDate = moment(event.start_date);
          return eventDate.isBefore(currentDate, 'day');
        });

        setCurrentEvents(upcomingEvents);
        setPastEvents(expiredEvents);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchEvents();
  }, [token]);

  const openModal = async (type, eventId) => {
    try {
      if (type === 'detail') {
        const response = await events.eventDetail(token, eventId);
        setDetailsContent(response.data);
        setEventId(eventId);
        setDetailsModalVisible(true);
      } else if (type === 'participants') {
        const response = await events.getParticipants(token, eventId);
        const participantNames = response.data.map(participant => participant.first_name); 
        setParticipantsContent(participantNames);
        setParticipantsModalVisible(true);
      }
    } catch (error) {
      console.error('Error al cargar el modal:', error);
    }
  };


  const deleteEvent = async(idEvent,idUser) =>
  {
    setDetailsModalVisible(false);
    const response = await events.deleteEvent(token,idUser,idEvent);
    
  }

  const renderEvent = (event, isEditable) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{event.name}</Text>
      <Text style={styles.eventDate}>{event.description}</Text>

      <TouchableOpacity 
        style={styles.detailButton} 
        onPress={() => openModal('detail', event.id)}>
        <Text style={styles.buttonText}>Ver Detalle</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.participantsButton} 
        onPress={() => openModal('participants', event.id)}>
        <Text style={styles.buttonText}>Ver Participantes</Text>
      </TouchableOpacity>

      {isEditable && (
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate('EditEvent', { event, token })}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>


      <Text style={styles.sectionTitle}>Eventos Vigentes</Text>
      <FlatList
        data={currentEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderEvent(item, true)}
      />

      <Text style={styles.sectionTitle}>Eventos Pasados</Text>
      <FlatList
        data={pastEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderEvent(item, false)}
      />

     
<Modal
  visible={detailsModalVisible}
  onRequestClose={() => setDetailsModalVisible(false)}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Detalle del Evento</Text>
    
        <Text style={styles.modalBody}>
          {JSON.stringify(detailsContent, null, 2)}
        </Text>
     

      <TouchableOpacity 
        onPress={() => {
          if (eventId && user.id) {
            deleteEvent(eventId, user.id);
          } else {
            console.error("Detalles del evento o ID de usuario no están disponibles");
          }
        }} 
        style={styles.closeButton}>
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.closeButton}>
        <Text style={styles.buttonText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    
      <Modal
        visible={participantsModalVisible}
        onRequestClose={() => setParticipantsModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Participantes</Text>
            <FlatList
              data={participantsContent}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.modalText}>{item}</Text>}
            />
            <TouchableOpacity onPress={() => setParticipantsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  eventItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  detailButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  participantsButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    maxHeight: 200,
    overflowY: 'scroll',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default Admin;