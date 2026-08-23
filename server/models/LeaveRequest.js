let nextId = 109;

const leaveRequests = [
  { id: 'leave-101', employee: 'employee-001', leaveType: 'Casual Leave', startDate: '2026-08-25', endDate: '2026-08-27', numberOfDays: 3, reason: 'Planned time away', status: 'Approved', createdAt: '2026-08-05T09:00:00.000Z', updatedAt: '2026-08-05T09:00:00.000Z' },
  { id: 'leave-102', employee: 'employee-001', leaveType: 'Optional Leave', startDate: '2026-09-14', endDate: '2026-09-15', numberOfDays: 2, reason: 'Personal event', status: 'Approved', createdAt: '2026-08-10T09:00:00.000Z', updatedAt: '2026-08-10T09:00:00.000Z' },
  { id: 'leave-103', employee: 'employee-001', leaveType: 'Sick Leave', startDate: '2026-08-18', endDate: '2026-08-18', numberOfDays: 1, reason: 'Medical appointment', status: 'Pending', createdAt: '2026-08-12T09:00:00.000Z', updatedAt: '2026-08-12T09:00:00.000Z' },
  { id: 'leave-104', employee: 'employee-001', leaveType: 'Earned Leave', startDate: '2026-07-21', endDate: '2026-07-23', numberOfDays: 3, reason: 'Vacation', status: 'Approved', createdAt: '2026-07-08T09:00:00.000Z', updatedAt: '2026-07-08T09:00:00.000Z' },
  { id: 'leave-105', employee: 'employee-001', leaveType: 'Casual Leave', startDate: '2026-06-12', endDate: '2026-06-12', numberOfDays: 1, reason: 'Personal work', status: 'Rejected', createdAt: '2026-06-04T09:00:00.000Z', updatedAt: '2026-06-04T09:00:00.000Z' },
  { id: 'leave-106', employee: 'employee-001', leaveType: 'Earned Leave', startDate: '2026-05-04', endDate: '2026-05-06', numberOfDays: 3, reason: 'Vacation', status: 'Approved', createdAt: '2026-04-20T09:00:00.000Z', updatedAt: '2026-04-20T09:00:00.000Z' },
  { id: 'leave-107', employee: 'employee-001', leaveType: 'Sick Leave', startDate: '2026-03-16', endDate: '2026-03-17', numberOfDays: 2, reason: 'Recovery', status: 'Approved', createdAt: '2026-03-11T09:00:00.000Z', updatedAt: '2026-03-11T09:00:00.000Z' },
  { id: 'leave-108', employee: 'employee-001', leaveType: 'Casual Leave', startDate: '2026-02-09', endDate: '2026-02-09', numberOfDays: 1, reason: 'Personal work', status: 'Pending', createdAt: '2026-02-01T09:00:00.000Z', updatedAt: '2026-02-01T09:00:00.000Z' },
];

function findByEmployee(employeeId) {
  return leaveRequests.filter((request) => request.employee === employeeId);
}

function findByIdForEmployee(id, employeeId) {
  return leaveRequests.find((request) => request.id === id && request.employee === employeeId) || null;
}

function updateStatus(id, employeeId, status) {
  const request = findByIdForEmployee(id, employeeId);
  if (!request) return null;
  request.status = status;
  request.updatedAt = new Date().toISOString();
  return request;
}

function create(request) {
  const now = new Date().toISOString();
  const savedRequest = { id: `leave-${nextId++}`, ...request, status: 'Pending', createdAt: now, updatedAt: now };
  leaveRequests.push(savedRequest);
  return savedRequest;
}

module.exports = { create, findByEmployee, findByIdForEmployee, updateStatus };
