import axiosClient from './axiosClient';

export const authApi = {
  login: async (email, password) => {
    return await axiosClient.post('/auth/login', { email, password });
  },

  register: async (registrationData) => {
    return await axiosClient.post('/auth/register', registrationData);
  },

  getCurrentUser: async () => {
    return await axiosClient.get('/auth/me');
  },
};
