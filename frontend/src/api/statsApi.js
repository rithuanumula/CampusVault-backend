import axiosClient from './axiosClient';

export const statsApi = {
  getAdminStats: async () => {
    return await axiosClient.get('/admin/stats');
  },

  getVerificationHistory: async (query = '', page = 0, size = 15) => {
    return await axiosClient.get('/admin/verifications', {
      params: { query, page, size },
    });
  },
};
