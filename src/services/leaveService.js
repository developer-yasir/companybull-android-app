import apiClient from '../api/client';

export const submitLeaveRequest = async (leaveData) => {
  try {
    const response = await apiClient.post('/leave/apply', leaveData);
    return response.data;
  } catch (error) {
    console.error('Error submitting leave request:', error);
    throw error;
  }
};

export const getLeaveHistory = async (employeeId) => {
  try {
    const response = await apiClient.get(`/leave/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leave history:', error);
    throw error;
  }
};
