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
  return dashboardData[userId] || { leaveBalances: [], statistics: { pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0, upcomingLeaveDays: 0 }, upcomingLeaves: [], recentActivity: [] };
}

module.exports = { getEmployeeDashboard };