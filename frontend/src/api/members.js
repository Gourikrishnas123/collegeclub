import api from './axiosInstance';

export const getMembersApi = async (clubId, page = 1, limit = 10) => {
  const response = await api.get(`/clubs/${clubId}/members?page=${page}&limit=${limit}`);
  return response.data;
};

export const addMemberApi = async (clubId, memberData) => {
  const response = await api.post(`/clubs/${clubId}/members`, memberData);
  return response.data;
};

export const updateMemberApi = async (clubId, memberId, memberData) => {
  const response = await api.patch(`/clubs/${clubId}/members/${memberId}`, memberData);
  return response.data;
};

export const deleteMemberApi = async (clubId, memberId) => {
  const response = await api.delete(`/clubs/${clubId}/members/${memberId}`);
  return response.data;
};
