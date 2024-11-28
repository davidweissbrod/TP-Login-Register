import api from "./api";

const getEvents = async () => {
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,  
  };
  const data = {}
  try {
    const result = await api('GET', headers, data, 'event');
    return result;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: error.message };
  }
};
const createEvents = async (data, token) => {
    if (typeof token !== 'string') {
      console.error('Token should be a string.');
      return { error: 'Invalid token' };
    }
  
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
  
    try {
      const result = await api('POST', headers, data, 'event/createEvent');
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  const enrollmentEvent = async (token,eventid,userid) =>
  {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
  const data = {}
  
    try {
      const result = await api('POST', headers, data, `event/${eventid}/${userid}/enrollment`);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  }

  const getMaxCapacity = async (token, idLocation) =>
  {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
  const data = {}
  
    try {
      const result = await api('POST', headers, data, `event/${idLocation}`);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  }
  const getAllEvents = async () => {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,  
    };
    const data = {}
    try {
      const result = await api('GET', headers, data, 'event/getAll');
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };
  

  const updateEvent = async (token,data) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    try {
      const result = await api('PATCH', headers, data, 'event');
      console.log(result);
      return result;
    } catch (error) {
      return { error: error.message };
    }
  };

  const eventDetail = async (token,idEvento) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    const data= {};
    try {
      const result = await api('GET', headers, data, `event/getDetail/${idEvento}`);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  const getParticipants = async (token,idEvent) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    const data = {};
    try {
      const result = await api('GET', headers, data, `event/${idEvent}/enrollment`);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  const deleteEvent = async (token,idUser,idEvento) => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "ngrok-skip-browser-warning": true,  
    };
    const data= {};
    try {
      const result = await api('DELETE', headers, data, `event/${idEvento}/${idUser}/del`);
      return result;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return { error: error.message };
    }
  };

  export default { getEvents,createEvents, enrollmentEvent, getMaxCapacity,getAllEvents, updateEvent,eventDetail,getParticipants,deleteEvent};