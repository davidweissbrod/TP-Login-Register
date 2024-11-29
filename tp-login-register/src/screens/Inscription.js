import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMaxCapacity, enrollmentEvent} from '../../services/events';
import { View, Text, StyleSheet,FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Importamos el hook

const Inscription = ( {route}) =>
{
  const { token } = route.params;
    const [filteredEvents, setFilteredEvents] = useState([]);
    const navigation = useNavigation();

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
        
        if (async) {
          const events = JSON.parse(async);
          console.log("Eventos obtenidos:", events);
          
          if (Array.isArray(events)) {
            const validatedEvents = await Promise.all(events.map(async (event) => {
              try {
                const isValid = await getMaxCapacity(parseInt(event.id_event_location));
                return isValid ? event : null;
              } catch (error) {
                console.error(`Error validando evento ${event.name}:`, error);
                return null;
              }
            }));
            const filteredValidEvents = validatedEvents.filter(event => event !== null);
            setFilteredEvents(filteredValidEvents);
          } else {
            console.warn("Los datos no son un array válido");
          }
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
      const user = decodeTokenManual(token);
        try
        {
          const response = await enrollmentEvent(storedToken,idEvent,user.id);
        }
        catch(e)
        { console.log(e)}
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}  // Navegar hacia atrás
      >
        <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        {filteredEvents.length === 0 ? (
          <Text style={styles.emptyText}>No hay eventos disponibles.</Text>
        ) : (
          
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventTitle}>{item.name}</Text>
                <Text style={styles.eventDate}>{item.description}</Text>
                <TouchableOpacity onPress={() => applyforEvent(item.id)}>
                  <Text>Inscribirse</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    );
    
}

export default Inscription;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f4f4f8', // Un color suave para el fondo
    },
    eventItem: {
      backgroundColor: '#ffffff', // Fondo blanco para los elementos
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000', // Sombra para dar profundidad
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3, // Para sombra en Android
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333', // Color oscuro para el texto principal
      marginBottom: 5,
    },
    eventDate: {
      fontSize: 14,
      color: '#666', // Color gris para el subtítulo
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#007bff', // Color azul para el botón
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    buttonText: {
      fontSize: 16,
      color: '#ffffff', // Texto blanco para el botón
      fontWeight: 'bold',
    },
    emptyText: {
      fontSize: 16,
      color: '#999', // Texto gris para cuando no hay eventos
      textAlign: 'center',
      marginTop: 20,
    },
})