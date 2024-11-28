import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import moment from 'moment'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEvents } from '../../services/events';

/*const decodeToken = (token) => {
  try {
    const [header, payload, signature] = token.split('.');
    
    if (!payload) {
      throw new Error('Invalid token');
    }

    const base64Url = payload.replace(/_/g, '/').replace(/-/g, '+');
    const base64 = atob(base64Url);
    const user = JSON.parse(base64);
    return user;
  } catch (error) {
    console.error('Token decoding error:', error);
    return null;
  }
};
*/
export default function HomeScreen({ route }) {
  //const { token } = route.params;
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const navigation = useNavigation(); 

  useEffect( () => {
    if (token) {
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
    }
    
    const fetchEvents = async () => {
      try {
          const response = await getEvents();  
          const events = Array.isArray(response.data) ? response.data : [];
          const currentDate = moment();
          const filteredEvents = events.filter(event => {
              const eventDate = moment(event.start_date);
              return eventDate.isAfter(currentDate, 'day') || eventDate.isSame(currentDate, 'day'); 
          });
          await AsyncStorage.setItem('filteredEvents', JSON.stringify(filteredEvents));
          setEvents(filteredEvents);
      } catch (error) {
          console.error('Failed to fetch events:', error);
      } 
  }; 
    fetchEvents();
  }, [token]);

  
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.container}>
     
     <Text style={styles.title}>Eventos</Text>
     <FlatList
       data={events}
       keyExtractor={(item) => item.id.toString()}
       renderItem={({ item }) => (
         <View style={styles.eventItem}>
           <Text style={styles.eventTitle}>{item.name}</Text>
           <Text style={styles.eventDate}>{item.description}</Text>
         </View>
       )}
     />

     <View style={styles.buttonContainer}>
       <TouchableOpacity 
         style={styles.addButton}
         onPress={() => navigation.navigate('NewEvent', { token })} 
       >
         <Text style={styles.addButtonText}>Agregar Evento</Text>
       </TouchableOpacity>
       <TouchableOpacity 
         style={styles.applyButton}
         onPress={() => navigation.navigate('Inscription', { token })} 
       >
         <Text style={styles.applyButtonText}>Inscribirse</Text>
       </TouchableOpacity>
     </View>
   </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9f9f9',
      paddingTop: 20,
      paddingHorizontal: 15,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    eventItem: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    eventTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#333',
    },
    eventDate: {
      fontSize: 14,
      color: '#555',
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 30,
      paddingHorizontal: 20,
    },
    addButton: {
      backgroundColor: '#4CAF50', // Green
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      shadowColor: '#4CAF50',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    applyButton: {
      backgroundColor: '#2196F3', // Blue
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      shadowColor: '#2196F3',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    applyButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
