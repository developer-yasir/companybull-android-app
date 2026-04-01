import apiClient from '../api/client';

export const clockIn = async (employeeId) => {
  try {
    const response = await apiClient.post('/attendance/clock-in', { employeeId });
    return response.data;
  } catch (error) {
    console.error('Error clocking in:', error);
    throw error;
  }
};

export const clockOut = async (employeeId) => {
  try {
    const response = await apiClient.post('/attendance/clock-out', { employeeId });
    return response.data;
  } catch (error) {
    console.error('Error clocking out:', error);
    throw error;
  }
};

export const getAttendanceHistory = async (employeeId) => {
  try {
    const response = await apiClient.get(`/attendance/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    throw error;
  }
};
