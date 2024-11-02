import axios from 'axios';

const API_URL = 'https://localhost:3000';

// Explico poco xq es pura logica, lo importante esta comentado
// GET = TRAE DEL BACK 
// PUT = ACTUALIZA ALGO EXISTENTE
// DELETE = BORRA
// POST = SUBE ALGO NUEVO
export const getEvents = async (page = 1) => { 
    try {
        const response = await axios.get(`${API_URL}/event`, { params: { page: page } }); // Url de la API
        
        return response.data[0].events; 

    } catch (error) {
        console.error(error);
        return error.response ? error.response.data : null; 
    }
};

export const getCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}/event-category`);
        return response.data
    }
    catch (error){
        console.error(error);
        return error.response ? error.response.data : null;
    }
}

export const getLocations = async (token) => {
    try{       
        const response = await axios.get(`${API_URL}/event-location`, {
            headers: { // Revisa que el token sea valido para traer las locations
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
        const response = await axios.post(`${API_URL}/event`, { // Mete la data del evento que es traida de lo que mete el usuario por parametros
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
            headers: { // Se fija que el token sea valido
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
        headers: { // Revisa que el token sea valido
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
      const response = await axios.put(`${API_URL}/event/${eventId}`, updatedEventData, { // Recibe el evento actualizado por parametros para haver el put (subirlo a la BD)
        headers: { // Revisa que el token sea valido
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

export const deleteEvent = async (eventId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/event/${eventId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return {
            status: response.status,
            message: 'Evento eliminado con éxito',
        };
    } catch (error) {
        console.error('Error eliminando el evento:', error);
        return error.response
            ? {
                status: error.response.status,
                message: error.response.data.message || 'Error al eliminar el evento',
            }
            : { status: 500, message: 'Error de conexión.' };
    }
}

export const getEventParticipants = async (eventId) => {
    try {
        const response = await axios.get(`${API_URL}/event/${eventId}/event_enrollments`, {
            headers: { }
        });

        const participantsData = response.data
        return participantsData;
    } catch (error) {
        console.error('Error obteniendo participantes del evento:', error);
        return error.response ? error.response.data : null;
    }
};

export const enrollUser = async (id_event, token) => {
    try {       
        const response = await axios.post(`${API_URL}/event/event_enrollments/${id_event}`,{}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error en enrollUser:', error.message || error);
        return error.response ? error.response.data : null;
    }
}