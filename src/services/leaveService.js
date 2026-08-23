import api from './api';

const leaveService = {
  async getLeaveTypes() {
    const response = await api.get('/leave-types');
    return response.data;
  },
  async getLeaveBalance() {
    const response = await api.get('/leave-balance');
    return response.data;
  },
  async createLeaveRequest(request) {
    const response = await api.post('/leaves', request);
    return response.data;
  },
};

export default leaveService;
