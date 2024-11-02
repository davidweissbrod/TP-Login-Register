import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Modal, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/auth';
import { getCategorias, getLocations, getEventById, updateEvent } from '../../services/events';
import { Button } from 'react-native';

export default function EditarEvento({ route }) {
  const { token } = useContext(AuthContext); // Traigo un token de auth del auth context
  const { eventId } = route.params; 

  const [form, setForm] = useState({ // Seteo un form para completar con los datos a editar
    name: '',
    description: '',
    id_event_category: '',
    id_event_location: '',
    start_date: '',
    duration_in_minutes: '',
    price: '',
    enabled_for_enrollment: false,
    max_assistance: ''
  });

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getCategorias(); // Traigo las categorias del service de eventos
        const locations = await getLocations(token); // Traigo las locations del service de eventos
        const event = await getEventById(eventId, token); // Traigo el evento del service de eventos
        setCategories(categories);
        setLocations(locations);
        setForm({ // Seteo el form con la data actual
          name: event.name,
          description: event.description,
          id_event_category: event.id_event_category,
          id_event_location: event.id_event_location,
          start_date: event.start_date,
          duration_in_minutes: event.duration_in_minutes.toString(),
          price: event.price.toString(),
          enabled_for_enrollment: event.enabled_for_enrollment,
          max_assistance: event.max_assistance.toString()
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [eventId]);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => { // Verifica que esten los espacios llenos antes de enviar el form
    if (form.name && form.description && form.id_event_category && form.id_event_location && form.start_date && form.duration_in_minutes && form.price && form.enabled_for_enrollment && form.max_assistance) {
      setModalVisible(true);
    } else {
      Alert.alert('Completar el formulario');
    }
  };

  const confirmUpdateEvent = async () => {
    const response = await updateEvent(eventId, form, token);  // Traigo la funcion para que se actualice la info
    if (response.status === 200) { // Si la actualizacion fue correcta
      Alert.alert('El evento ha sido actualizado correctamente.', response.message);
    } else {
      Alert.alert('Error al actualizar el evento', response.message);
    }

    setModalVisible(false);
  };

  const cancelUpdate = () => { // Cancela el update del form
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Editar Evento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del evento"
        value={form.name}
        onChangeText={(value) => handleChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={form.description}
        onChangeText={(value) => handleChange('description', value)}
      />
      <Picker
        selectedValue={form.id_event_category}
        style={styles.picker}
        onValueChange={(value) => handleChange('id_event_category', value)}
      >
        {categories.map((category) => ( // Muestra las categorias disponibles
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>
      <Picker
        selectedValue={form.id_event_location}
        style={styles.picker}
        onValueChange={(value) => handleChange('id_event_location', value)}
      >
        {locations.map((location) => ( // Muestra las locations disponibles
          <Picker.Item key={location.id} label={location.name} value={location.id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Fecha de inicio"
        value={form.start_date}
        onChangeText={(value) => handleChange('start_date', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Duración en minutos"
        value={form.duration_in_minutes}
        onChangeText={(value) => handleChange('duration_in_minutes', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={form.price}
        onChangeText={(value) => handleChange('price', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Máxima asistencia"
        value={form.max_assistance}
        onChangeText={(value) => handleChange('max_assistance', value)}
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.header}>Habilitado para inscripción</Text>
        <Switch
          value={form.enabled_for_enrollment}
          onValueChange={(value) => handleChange('enabled_for_enrollment', value)}
        />
      </View>

      <Button variant='primary' onPress={handleSubmit} style={styles.buttonSubmit}></Button>

      <Modal // Modal para confirmar la edicion del evento
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar actualización</Text>
            <Text>Nombre: {form.name}</Text>
            <Text>Descripción: {form.description}</Text>
            <Text>Categoría: {getCategoryName(form.id_event_category)}</Text>
            <Text>Ubicación: {getLocationName(form.id_event_location)}</Text>
            <Text>Fecha de inicio: {form.start_date}</Text>
            <Text>Duración: {form.duration_in_minutes} minutos</Text>
            <Text>Precio: ${form.price}</Text>
            <Text>Inscripción habilitada: {form.enabled_for_enrollment ? 'Sí' : 'No'}</Text>
            <Text>Máxima asistencia: {form.max_assistance}</Text>
            <View style={styles.modalButtons}>
              <Button variant='danger' onPress={cancelUpdate}>Cancelar</Button>
              <Button variant='primary' onPress={confirmUpdateEvent}>Confirmar</Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollContainer: {
      padding: 20,
      backgroundColor: '#f9f9f9', 
      flexGrow: 1
    },
    title: {
      fontSize: 28,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: 20
    },
    input: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4
    },
    picker: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 12,
      marginBottom: 15,
      padding: 10,
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd'
    },
    header: {
      fontSize: 18,
      fontWeight: '500',
      color: '#555'
    },
    buttonSubmit: {
      backgroundColor: '#007aff', 
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginVertical: 20
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600'
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 10
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: '#333'
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20
    },
    buttonDanger: {
      backgroundColor: '#ff3b30', 
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 5
    },
    buttonPrimary: {
      backgroundColor: '#007aff',
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 5
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600'
    },
  });
  