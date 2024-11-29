import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Switch, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native';
import category from '../../services/category';
import location from '../../services/locations';
import events from '../../services/events';

const EditarEvento = ({ route, navigation }) => {
 const { token, event } = route.params;

  const [form, setForm] = useState({
    id: event.id || '',
    name: event.name || '',
    description: event.description || '',
    id_event_category: event.id_event_category || '',
    id_event_location: event.id_event_location || '',
    start_date: event.start_date || '',
    duration_in_minutes: event.duration_in_minutes || '',
    price: event.price || '',
    enabled_for_enrollment: event.enabled_for_enrollment || false,
    max_assistance: event.max_assistance || '',
    id_creator_user: event.id_creator_user || '',
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
      const response = await events.updateEvent(token,form);
      console.log('Event update response:', response);
      setModalVisible(false);
      setSuccessModalVisible(true);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'There was an error updating the event.');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('Home', { token });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Admin", { token })}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit Event</Text>
      
  
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={form.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      {errors.description && <Text style={styles.error}>{errors.description}</Text>}

   
      <Text style={styles.label}>Event Category:</Text>
      <Picker
        selectedValue={form.id_event_category}
        style={styles.picker}
        onValueChange={(value) => handleInputChange('id_event_category', value)}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>
      {errors.id_event_category && <Text style={styles.error}>{errors.id_event_category}</Text>}

     
      <Text style={styles.label}>Event Location:</Text>
      <Picker
        selectedValue={form.id_event_location}
        style={styles.picker}
        onValueChange={(value) => handleInputChange('id_event_location', value)}
      >
        <Picker.Item label="Select a location" value="" />
        {locations.map((loc) => (
          <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
        ))}
      </Picker>
      {errors.id_event_location && <Text style={styles.error}>{errors.id_event_location}</Text>}

 
      <Text style={styles.label}>Start Date:</Text>
      <TextInput
        style={styles.input}
        value={form.start_date}
        onChangeText={(text) => handleInputChange('start_date', text)}
      />
      {errors.start_date && <Text style={styles.error}>{errors.start_date}</Text>}

      <Text style={styles.label}>Duration (minutes):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.duration_in_minutes.toString()}
        onChangeText={(text) => handleInputChange('duration_in_minutes', text)}
      />
      {errors.duration_in_minutes && <Text style={styles.error}>{errors.duration_in_minutes}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
        <Text style={styles.submitButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  error: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    paddingBottom: 20,
  },
});

export default EditarEvento;