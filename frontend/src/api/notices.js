import api from './axiosInstance';

export const getNoticesApi = async (clubId, page = 1, limit = 10) => {
  const response = await api.get(`/clubs/${clubId}/notices?page=${page}&limit=${limit}`);
  return response.data;
};

export const createNoticeApi = async (clubId, noticeData) => {
  const response = await api.post(`/clubs/${clubId}/notices`, noticeData);
  return response.data;
};

export const updateNoticeApi = async (clubId, noticeId, noticeData) => {
  const response = await api.patch(`/clubs/${clubId}/notices/${noticeId}`, noticeData);
  return response.data;
};

export const deleteNoticeApi = async (clubId, noticeId) => {
  const response = await api.delete(`/clubs/${clubId}/notices/${noticeId}`);
  return response.data;
};
