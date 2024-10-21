import axios from 'axios';

const API_URL = 'https://localhost:3000';

export const getEvents = async (page = 1) => {
    try {
        const response = await axios.get(`${API_URL}/api/event`, { params: { page: page } });
        
        return response.data[0].events; 

    } catch (error) {
        console.error(error);
        return error.response ? error.response.data : null; 
    }
};

export const getCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/event-category`);
        return response.data
    }
    catch (error){
        console.error(error);
        return error.response ? error.response.data : null;
    }
}

export const getLocations = async (token) => {
    try{       
        const response = await axios.get(`${API_URL}/api/event-location`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error){
        console.error(error);
        return error.response ? error.response.data : null;
    }
}

export const createEvent = async (eventDetails, token) => {
    try {
        const response = await axios.post(`${API_URL}/api/event`, {
            name: eventDetails.name,
            description: eventDetails.description,
            id_event_category: eventDetails.id_event_category,
            id_event_location: eventDetails.id_event_location,
            start_date: eventDetails.start_date,
            duration_in_minutes: eventDetails.duration_in_minutes,
            price: eventDetails.price,
            enabled_for_enrollment: eventDetails.enabled_for_enrollment ? 1 : 0,
            max_assistance: eventDetails.max_assistance
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        return {
            status: response.status,
            message: response.data,
        };
    } catch (error) {
        console.error(error);
        return error.response 
            ? {
                status: error.response.status,
                message: error.response.data.message 
              }
            : { status: 500, message: 'Error de conexión.' };
    }

}

export const getEventById = async (eventId, token) => {
    try {
      const response = await axios.get(`${API_URL}/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo el evento:', error);
      throw error;
    }
}

export const updateEvent = async (eventId, updatedEventData, token) => {
    try {
      const response = await axios.put(`${BASE_URL}/events/${eventId}`, updatedEventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando el evento:', error);
      throw error;
    }
  }