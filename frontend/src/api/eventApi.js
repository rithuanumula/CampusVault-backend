import axiosClient from './axiosClient';

export const eventApi = {
  getAllEvents: async (query = '') => {
    return await axiosClient.get('/events', {
      params: query ? { query } : {},
    });
  },

  getEventById: async (id) => {
    return await axiosClient.get(`/events/${id}`);
  },

  createEvent: async (eventData) => {
    return await axiosClient.post('/admin/events', eventData);
  },

  updateEvent: async (id, eventData) => {
    return await axiosClient.put(`/admin/events/${id}`, eventData);
  },

  deleteEvent: async (id) => {
    return await axiosClient.delete(`/admin/events/${id}`);
  },
};
