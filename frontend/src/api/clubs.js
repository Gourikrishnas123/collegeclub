import api from './axiosInstance';

export const getClubsApi = async () => {
  const response = await api.get('/clubs');
  return response.data;
};

export const getAdminOverviewApi = async () => {
  const response = await api.get('/clubs/overview');
  return response.data;
};

export const createClubApi = async (clubData) => {
  const response = await api.post('/clubs', clubData);
  return response.data;
};

export const updateClubApi = async (clubId, clubData) => {
  const response = await api.patch(`/clubs/${clubId}`, clubData);
  return response.data;
};

export const deactivateClubApi = async (clubId) => {
  const response = await api.patch(`/clubs/${clubId}/deactivate`);
  return response.data;
};
