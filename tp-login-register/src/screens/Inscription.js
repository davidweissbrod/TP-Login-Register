import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import event from '../../services/events';
import { View, Text, StyleSheet,FlatList, TouchableOpacity } from 'react-native';

const Inscription = ( {route}) =>
{
  const { token } = route.params;
    const [filteredEvents, setFilteredEvents] = useState([]);

    const decodeTokenManual = (token) => {
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
        console.error('Manual token decoding error:', error);
        return null;
      }
    };

   
      

    const getFilteredEvents = async () => {
      try {
        const async = await AsyncStorage.getItem('filteredEvents');
        
        if (async != null) {

          const events = JSON.parse(async);
          console.log("Eventos:", events);  
          const validatedEvents = await Promise.all(events.map(async (event) => {
            try {
              const isValid = await event.getMaxCapacity(parseInt(event.id_event_location));
              return isValid ? event : null; 
            } catch (error) {
              console.error(`Error validando evento ${event.name}:`, error);
              return null; 
            }
          }));
          const filteredValidEvents = validatedEvents.filter(event => event !== null);
          console.log("Eventos validados y filtrados:", filteredValidEvents);
          setFilteredEvents(filteredValidEvents);
        } else {
          console.warn("No se encontraron eventos en AsyncStorage");
        }
      } catch (e) {
        console.error("Error al leer los eventos filtrados:", e);
      }
    };

    useEffect(() => {
        getFilteredEvents();
    }, []);
  

    const applyforEvent = async (idEvent) =>
    {
        const storedToken = await AsyncStorage.getItem("storedToken");
        console.log("evento id" + idEvent);
      const user = decodeTokenManual(token);
        try
        {
            const response = await event.enrollmentEvent(storedToken,idEvent,user.id);
            console.log(response);
        }
        catch(e)
        { console.log(e)}
    }

    return (
        <View style = {styles.container}>

            <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.description}</Text>
            <TouchableOpacity onPress={() => applyforEvent(item.id)}><Text>Incribirse</Text></TouchableOpacity>
          </View>
        )}
      />
        </View>
    );
}

export default Inscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
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
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
})