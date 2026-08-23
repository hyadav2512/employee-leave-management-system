import api from './api';

const profileService = {
  async getProfile() {
    const response = await api.get('/employees/me');
    return response.data;
  },
  async updateProfile(profile) {
    const response = await api.patch('/employees/me', profile);
    return response.data;
  },
};

export default profileService;
