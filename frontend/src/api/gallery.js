import api from './axiosInstance';

export const getGalleryApi = async (clubId, page = 1, limit = 10) => {
  const response = await api.get(`/clubs/${clubId}/gallery?page=${page}&limit=${limit}`);
  return response.data;
};

export const createGalleryEventApi = async (clubId, formData) => {
  const response = await api.post(`/clubs/${clubId}/gallery`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteGalleryEventApi = async (clubId, eventId) => {
  const response = await api.delete(`/clubs/${clubId}/gallery/${eventId}`);
  return response.data;
};
