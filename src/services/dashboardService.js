import api from './api';

const dashboardService = {
  async getEmployeeDashboard() {
    const response = await api.get('/dashboard/employee');
    return response.data;
  },
};

export default dashboardService;