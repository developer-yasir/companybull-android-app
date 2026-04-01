import apiClient from '../api/client';

export const submitLeaveRequest = async (leaveData) => {
  try {
    const response = await apiClient.post('/leave', leaveData); // Match server
    return response.data;
  } catch (error) {
    console.error('Error submitting leave request:', error);
    throw error;
  }
};

export const getLeaveHistory = async (employeeId) => {
  try {
    const response = await apiClient.get(`/leave?employeeId=${employeeId}`); // Match server query param
    return response.data;
  } catch (error) {
    console.error('Error fetching leave history:', error);
    throw error;
  }
};

export const getManagedLeaves = async () => {
    try {
        const response = await apiClient.get('/leave/managed');
        return response.data;
    } catch (error) {
        console.error('Error fetching managed leaves:', error);
        throw error;
    }
};

export const updateLeaveStatus = async (id, status) => {
    try {
        const response = await apiClient.put(`/leave/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating leave status:', error);
        throw error;
    }
};
