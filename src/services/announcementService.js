import apiClient from '../api/client';

export const getAnnouncements = async () => {
  try {
    const response = await apiClient.get('announcements');
    return response.data;
  } catch (error) {
    console.error('Fetch Announcements Error:', error);
    throw error;
  }
};

export const postAnnouncement = async (data) => {
  try {
    const response = await apiClient.post('announcements', data);
    return response.data;
  } catch (error) {
    console.error('Post Announcement Error:', error);
    throw error;
  }
};
