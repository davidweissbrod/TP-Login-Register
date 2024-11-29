import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Alert, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import category from '../../services/category';
import location from '../../services/locations';
import events from '../../services/events';


const NewEvent = ({ route, navigation }) => {
  const { token } = route.params;
  const [form, setForm] = useState({
    name: '',
    description: '',
    id_event_category: '',
    id_event_location: '',
    start_date: '',
    duration_in_minutes: '',
    price: '',
    enabled_for_enrollment: false,
    max_assistance: '',
    id_creator_user: '',
  });

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await category.getCategory();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]); // Evita errores de renderizado.
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await location.getLocations(token);
        setLocations(response.data || []);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        setLocations([]); // Evita errores de renderizado.
      }
    };

    fetchCategories();
    fetchLocations();
  }, [token]);

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.id_event_category) newErrors.id_event_category = 'Event category is required';
    if (!form.id_event_location) newErrors.id_event_location = 'Event location is required';
    if (!form.start_date) newErrors.start_date = 'Start date is required';
    if (!form.duration_in_minutes || isNaN(form.duration_in_minutes) || form.duration_in_minutes <= 0)
      newErrors.duration_in_minutes = 'Duration must be a positive number';
    if (!form.price || isNaN(form.price) || form.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!form.max_assistance || isNaN(form.max_assistance) || form.max_assistance <= 0)
      newErrors.max_assistance = 'Max assistance must be a positive number';
    if (!form.id_creator_user || isNaN(form.id_creator_user)) newErrors.id_creator_user = 'Creator user ID is required' ;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {

      setModalVisible(true);
    }
  };

  const handleConfirm = async () => {
    try {
      console.log( typeof(form.id_creator_user))
      const response = await events.createEvents(form, token);
      console.log('Event creation response:', response);
      setModalVisible(false);
      setSuccessModalVisible(true); 
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'There was an error creating the event.');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()} 
    >
      <Text style={styles.backButtonText}>Volver</Text>
    </TouchableOpacity>

      <Text style={styles.title}>Event Form</Text>

      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <Text>Description:</Text>
      <TextInput
        style={styles.input}
        value={form.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      {errors.description && <Text style={styles.error}>{errors.description}</Text>}

      <Text>Event Category:</Text>
      <Picker
        selectedValue={form.id_event_category}
        style={styles.picker}
        onValueChange={(itemValue) => handleInputChange('id_event_category', itemValue)}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={ parseInt(category.id)} />
        ))}
      </Picker>
      {errors.id_event_category && <Text style={styles.error}>{errors.id_event_category}</Text>}

      <Text>Event Location:</Text>
      <Picker
        selectedValue={form.id_event_location}
        style={styles.picker}
        onValueChange={(itemValue) => handleInputChange('id_event_location', itemValue)}
      >
        <Picker.Item label="Select a location" value="" />
        {locations.map((location) => (
          <Picker.Item key={location.id} label={location.name} value={location.id} />
        ))}
      </Picker>
      {errors.id_event_location && <Text style={styles.error}>{errors.id_event_location}</Text>}

      <Text>Start Date:</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={form.start_date}
        onChangeText={(text) => handleInputChange('start_date', text)}
      />
      {errors.start_date && <Text style={styles.error}>{errors.start_date}</Text>}

      <Text>Duration (in minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.duration_in_minutes}
        onChangeText={(text) => handleInputChange('duration_in_minutes',  text ? parseInt(text, 10) : '')}
      />
      {errors.duration_in_minutes && <Text style={styles.error}>{errors.duration_in_minutes}</Text>}

      <Text>Price:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.price}
        onChangeText={(value) => handleInputChange('price',  value ? parseInt(value, 10) : '')}
      />
      {errors.price && <Text style={styles.error}>{errors.price}</Text>}

      <Text>Enabled for Enrollment:</Text>
      <Switch
        value={form.enabled_for_enrollment}
        onValueChange={(value) => handleInputChange('enabled_for_enrollment', value)}
      />

      <Text>Max Assistance:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.max_assistance}
        onChangeText={(value) => handleInputChange('max_assistance',  value ? parseInt(value, 10) : '' )}
      />
      {errors.max_assistance && <Text style={styles.error}>{errors.max_assistance}</Text>}

      <Text>Creator User ID:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.id_creator_user}
        onChangeText={(value) => handleInputChange('id_creator_user', value ? parseInt(value, 10) : '')}
      />
      {errors.id_creator_user && <Text style={styles.error}>{errors.id_creator_user}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Event Creation</Text>
            <Text>Name: {form.name}</Text>
            <Text>Description: {form.description}</Text>
            <Text>Category: {categories.find(cat => cat.id === form.id_event_category)?.name}</Text>
            <Text>Location: {locations.find(loc => loc.id === form.id_event_location)?.name}</Text>
            <Text>Start Date: {form.start_date}</Text>
            <Text>Duration: {form.duration_in_minutes} minutes</Text>
            <Text>Price: ${form.price}</Text>
            <Text>Enabled for Enrollment: {form.enabled_for_enrollment ? 'Yes' : 'No'}</Text>
            <Text>Max Assistance: {form.max_assistance}</Text>
            <Text>Creator User ID: {form.id_creator_user}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Evento creado exitosamente</Text>
            <Text>Tu evento fue creado exitosamente.</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSuccessClose}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f4f4f4',
  },
  backButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  error: {
    color: '#d9534f',
    fontSize: 14,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
});

export default NewEvent;