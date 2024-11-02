import React from 'react';
import Card from '../components/Card';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../context/auth';
import { getEvents } from '../../services/events';
import { Button } from 'react-native';

export default function HomeScreen() {
    const { user, signOut } = useContext(AuthContext); // Trae una funcion para desloguearse del auth context
    const [events, setEvents] = useState([]);
  
    const fetchEvents = async () => { // Fetch de eventos
      const fetchedEvents = await getEvents(); // Funcion importada desde el service que trae los eventos del back
      const fechaHoy = new Date();
      const events = fetchedEvents.filter(event => new Date(event.start_date) > fechaHoy); // Filtra los eventos que no haya pasado la fecha
      setEvents(events || []);
    };

    useEffect(() => {
      fetchEvents();
    }, []);
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.user}>{`${user.first_name} ${user.last_name}`}</Text>
        </View>
        <View style={styles.scrollContainer}>
          <ScrollView
            style={styles.scrollView}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
          {events && events.length > 0 ? ( // Recorro eventos para que sean mostrados
          events.map((event) => {
            if (event.creator_user.username !== user.username) { // Si el nombre del creador del evento no coincide con el del user le muestra un evento al que se puede inscribir
              return  <Card key={event.id} event={event} type={'Home'} />;; 
            }
            return <Card key={event.id} event={event} type={'Admin'} />; // Si el nombre del creador del evento si coincide con el del user le muestra un evento para editar
          })
          ) : ( // Texto si no hay eventos
            <Text style={styles.text}>No hay eventos disponibles.</Text>
          )}

          </ScrollView>
        </View>
        <Button onPress={signOut} style={styles.button}>Log out</Button>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    user: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    scrollContainer: {
      flex: 1,
      marginTop: 20,
    },
    scrollView: {
      flexGrow: 1,
    },
    scrollViewContent: {
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    button: {
        backgroundColor: '#1E90FF',
        borderRadius: 8,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      }
  });
  
