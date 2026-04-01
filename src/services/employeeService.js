import apiClient from '../api/client';

export const getAllEmployees = async () => {
  try {
    const response = await apiClient.get('employees');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await apiClient.get(`employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};

export const getOrgHierarchy = async () => {
  try {
    const response = await apiClient.get('employees/hierarchy');
    return response.data;
  } catch (error) {
    console.error('Error fetching org hierarchy:', error);
    throw error;
  }
};
