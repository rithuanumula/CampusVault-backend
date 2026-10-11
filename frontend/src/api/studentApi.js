import axiosClient from './axiosClient';

export const studentApi = {
  getAllStudents: async (query = '') => {
    return await axiosClient.get('/admin/students', {
      params: query ? { query } : {},
    });
  },

  getStudentById: async (id) => {
    return await axiosClient.get(`/admin/students/${id}`);
  },

  createStudent: async (studentData) => {
    return await axiosClient.post('/admin/students', studentData);
  },

  updateStudent: async (id, studentData) => {
    return await axiosClient.put(`/admin/students/${id}`, studentData);
  },

  getStudentProfile: async () => {
    return await axiosClient.get('/student/profile');
  },
};
