import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Modal, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native';


export default function NuevoEvento() {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
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
        const categories = await getCategorias();
        const locations = await getLocations(token);
        setCategories(categories);
        setLocations(locations);
      } catch (error) {
        console.error( error)
      }
    };
    fetchData();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if(form.name && form.description && form.id_event_category && form.id_event_location && form.start_date && form.duration_in_minutes && form.price && form.enabled_for_enrollment && form.max_assistance){
      setModalVisible(true);
    }
    else{
      Alert.alert('Completar el formulario')
    }
    
  };

  const confirmEvent = async () => { 
    const response = await createEvent(form, token);
    if(response.status == 201){
      Alert.alert('El evento ha sido agregado correctamente.', response.message);
    }
    else{
      Alert.alert('Error al crear el evento', response.message);
    }
    
    setModalVisible(false); 
  };

  const cancelEvent = () => {
    setModalVisible(false);
  };

  return (
   
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Nuevo Evento</Text>
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
          {categories.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id} />
          ))}
        </Picker>
        <Picker
          selectedValue={form.id_event_location}
          style={styles.picker}
          onValueChange={(value) => handleChange('id_event_location', value)}
        >
          {locations.map((location) => (
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

        <Button onPress={handleSubmit} style={styles.buttonSubmit}></Button>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar evento</Text>
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
                <Button onPress={cancelEvent} > Cancelar </Button>
                <Button onPress={confirmEvent}>Confirmar</Button>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView> 
  );
}

const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f5f5f5'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center'
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: '#333',
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ccc'
    },
    picker: {
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ccc'
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15
    },
    header: {
      fontSize: 16,
      color: '#333'
    },
    buttonSubmit: {
      backgroundColor: '#1E90FF',
      borderRadius: 8,
      paddingVertical: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center'
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 15
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold'
    },
  });
  