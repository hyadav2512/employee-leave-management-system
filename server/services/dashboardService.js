const LeaveRequest = require('../models/LeaveRequest');

const dashboardData = {
  'employee-001': {
    leaveBalances: [
      { type: 'Casual Leave', allocated: 12, used: 4, remaining: 8 },
      { type: 'Sick Leave', allocated: 10, used: 2, remaining: 8 },
      { type: 'Earned Leave', allocated: 18, used: 7, remaining: 11 },
      { type: 'Optional Leave', allocated: 3, used: 1, remaining: 2 },
    ],
    statistics: { pendingRequests: 2, approvedRequests: 5, rejectedRequests: 1, upcomingLeaveDays: 5 },
    upcomingLeaves: [
      { id: 'leave-101', type: 'Casual Leave', startDate: '2026-08-25', endDate: '2026-08-27', days: 3, status: 'Approved' },
      { id: 'leave-102', type: 'Optional Leave', startDate: '2026-09-14', endDate: '2026-09-15', days: 2, status: 'Approved' },
    ],
    recentActivity: [
      { id: 'leave-102', type: 'Optional Leave', startDate: '2026-09-14', endDate: '2026-09-15', days: 2, status: 'Approved', appliedDate: '2026-08-10' },
      { id: 'leave-101', type: 'Casual Leave', startDate: '2026-08-25', endDate: '2026-08-27', days: 3, status: 'Approved', appliedDate: '2026-08-05' },
      { id: 'leave-103', type: 'Sick Leave', startDate: '2026-08-18', endDate: '2026-08-18', days: 1, status: 'Pending', appliedDate: '2026-08-12' },
      { id: 'leave-104', type: 'Earned Leave', startDate: '2026-07-21', endDate: '2026-07-23', days: 3, status: 'Approved', appliedDate: '2026-07-08' },
      { id: 'leave-105', type: 'Casual Leave', startDate: '2026-06-12', endDate: '2026-06-12', days: 1, status: 'Rejected', appliedDate: '2026-06-04' },
      { id: 'leave-106', type: 'Earned Leave', startDate: '2026-05-04', endDate: '2026-05-06', days: 3, status: 'Approved', appliedDate: '2026-04-20' },
      { id: 'leave-107', type: 'Sick Leave', startDate: '2026-03-16', endDate: '2026-03-17', days: 2, status: 'Approved', appliedDate: '2026-03-11' },
      { id: 'leave-108', type: 'Casual Leave', startDate: '2026-02-09', endDate: '2026-02-09', days: 1, status: 'Pending', appliedDate: '2026-02-01' },
    ],
  },
};

function getEmployeeDashboard(userId) {
  const base = dashboardData[userId] || { leaveBalances: [], statistics: { pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0, upcomingLeaveDays: 0 }, upcomingLeaves: [], recentActivity: [] };
  const requests = LeaveRequest.findByEmployee(userId);
  const knownIds = new Set(base.recentActivity.map((request) => request.id));
  const newRequests = requests.filter((request) => !knownIds.has(request.id));
  const mappedRequests = newRequests.map((request) => ({
    id: request.id,
    type: request.leaveType,
    startDate: request.startDate,
    endDate: request.endDate,
    days: request.numberOfDays,
    status: request.status,
    appliedDate: request.createdAt.slice(0, 10),
  }));
  const pendingRequests = newRequests.filter((request) => request.status === 'Pending').length;
  const upcomingLeaveDays = newRequests
    .filter((request) => request.status === 'Pending' && request.startDate >= new Date().toISOString().slice(0, 10))
    .reduce((total, request) => total + request.numberOfDays, 0);

  return {
    ...base,
    statistics: { ...base.statistics, pendingRequests: base.statistics.pendingRequests + pendingRequests, upcomingLeaveDays: base.statistics.upcomingLeaveDays + upcomingLeaveDays },
    upcomingLeaves: [...mappedRequests.filter((request) => request.startDate >= new Date().toISOString().slice(0, 10)), ...base.upcomingLeaves],
    recentActivity: [...mappedRequests, ...base.recentActivity],
  };
}

module.exports = { getEmployeeDashboard };