import api from './axiosInstance';

export const getFinanceSummaryApi = async (clubId) => {
  const response = await api.get(`/clubs/${clubId}/finance/summary`);
  return response.data;
};

export const getTransactionsApi = async (clubId, page = 1, limit = 10) => {
  const response = await api.get(`/clubs/${clubId}/transactions?page=${page}&limit=${limit}`);
  return response.data;
};

export const createTransactionApi = async (clubId, data) => {
  const response = await api.post(`/clubs/${clubId}/transactions`, data);
  return response.data;
};

export const deleteTransactionApi = async (clubId, transactionId) => {
  const response = await api.delete(`/clubs/${clubId}/transactions/${transactionId}`);
  return response.data;
};
