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
  async getLeaveRequests(params) {
    const response = await api.get('/leaves', { params });
    return response.data;
  },
  async getLeaveRequest(id) {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },
  async cancelLeaveRequest(id) {
    const response = await api.patch(`/leaves/${id}/cancel`);
    return response.data;
  },
};

export default leaveService;
