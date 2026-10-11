import axiosClient from './axiosClient';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const certificateApi = {
  // Public Verification (No Auth)
  verifyCertificate: async (certificateId, method = 'MANUAL_ID') => {
    return await axiosClient.get(`/public/certificates/verify/${encodeURIComponent(certificateId)}`, {
      params: { method },
    });
  },

  // Admin APIs
  getAllCertificates: async (query = '') => {
    return await axiosClient.get('/admin/certificates', {
      params: query ? { query } : {},
    });
  },

  getCertificateById: async (id) => {
    return await axiosClient.get(`/admin/certificates/${id}`);
  },

  generateCertificate: async (certificateData) => {
    return await axiosClient.post('/admin/certificates', certificateData);
  },

  revokeCertificate: async (id, reason) => {
    return await axiosClient.post(`/admin/certificates/${id}/revoke`, { reason });
  },

  // Student APIs
  getStudentCertificates: async () => {
    return await axiosClient.get('/student/certificates');
  },

  // Helper download URL
  getDownloadUrl: (certificateId) => {
    return `${baseURL}/certificates/${encodeURIComponent(certificateId)}/download`;
  },

  getQrUrl: (certificateId) => {
    return `${baseURL}/certificates/${encodeURIComponent(certificateId)}/qr`;
  },
};
