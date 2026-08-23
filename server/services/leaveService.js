const LeaveRequest = require('../models/LeaveRequest');
const { calculateWorkingDays, parseDate } = require('../utils/dateUtils');
const { paginate } = require('../utils/pagination');

const leaveTypes = [
  { id: 'casual', name: 'Casual Leave', active: true },
  { id: 'sick', name: 'Sick Leave', active: true },
  { id: 'earned', name: 'Earned Leave', active: true },
  { id: 'optional', name: 'Optional Leave', active: true },
];

const balances = {
  'employee-001': {
    'Casual Leave': { allocated: 12, used: 4 },
    'Sick Leave': { allocated: 10, used: 2 },
    'Earned Leave': { allocated: 18, used: 7 },
    'Optional Leave': { allocated: 3, used: 1 },
  },
};

class LeaveValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function getLeaveTypes() {
  return leaveTypes.filter((type) => type.active);
}

function getLeaveBalance(employeeId) {
  const employeeBalances = balances[employeeId] || {};
  return getLeaveTypes().map((type) => {
    const balance = employeeBalances[type.name] || { allocated: 0, used: 0 };
    return { type: type.name, allocated: balance.allocated, used: balance.used, remaining: balance.allocated - balance.used };
  });
}

function listLeaveRequests(employeeId, query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : '';
  const allowedStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
  const status = allowedStatuses.includes(query.status) ? query.status : '';
  const leaveType = typeof query.leaveType === 'string' ? query.leaveType : '';
  const startDate = parseDate(query.startDate) ? query.startDate : '';
  const endDate = parseDate(query.endDate) ? query.endDate : '';
  const sortBy = ['startDate', 'endDate', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const filtered = LeaveRequest.findByEmployee(employeeId).filter((request) => {
    const matchesSearch = !search || request.leaveType.toLowerCase().includes(search) || request.reason.toLowerCase().includes(search);
    return matchesSearch && (!status || request.status === status) && (!leaveType || request.leaveType === leaveType)
      && (!startDate || request.startDate >= startDate) && (!endDate || request.endDate <= endDate);
  }).sort((left, right) => (left[sortBy] > right[sortBy] ? sortOrder : left[sortBy] < right[sortBy] ? -sortOrder : 0));

  return paginate(filtered.map((request) => ({ ...request })), page, limit);
}

function getLeaveRequest(employeeId, id) {
  return LeaveRequest.findByIdForEmployee(id, employeeId);
}

function cancelLeaveRequest(employeeId, id) {
  const request = LeaveRequest.findByIdForEmployee(id, employeeId);
  if (!request) throw new LeaveValidationError('Leave request not found.', 404);
  if (request.status !== 'Pending') throw new LeaveValidationError('Only pending leave requests can be cancelled.', 400);
  return LeaveRequest.updateStatus(id, employeeId, 'Cancelled');
}

function createLeaveRequest(employeeId, input) {
  const { leaveType, startDate, endDate, reason } = input || {};
  if (!leaveType || !startDate || !endDate || !reason || typeof reason !== 'string' || !reason.trim()) {
    throw new LeaveValidationError('Leave type, dates, and reason are required.');
  }
  if (reason.trim().length > 500) throw new LeaveValidationError('Reason must be 500 characters or fewer.');

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const today = new Date().toISOString().slice(0, 10);
  if (!start || !end) throw new LeaveValidationError('Please provide valid leave dates.');
  if (startDate < today) throw new LeaveValidationError('Start date cannot be in the past.');
  if (startDate > endDate) throw new LeaveValidationError('End date cannot be before start date.');

  const type = leaveTypes.find((item) => item.name === leaveType && item.active);
  if (!type) throw new LeaveValidationError('That leave type is not available.');

  const numberOfDays = calculateWorkingDays(startDate, endDate);
  if (!numberOfDays) throw new LeaveValidationError('The selected dates contain no working days.');

  const balance = getLeaveBalance(employeeId).find((item) => item.type === leaveType);
  if (!balance || numberOfDays > balance.remaining) {
    throw new LeaveValidationError(`You only have ${balance?.remaining || 0} days of ${leaveType} remaining.`);
  }

  const overlaps = LeaveRequest.findByEmployee(employeeId).find((request) => (
    ['Pending', 'Approved'].includes(request.status)
      && startDate <= request.endDate
      && endDate >= request.startDate
  ));
  if (overlaps) {
    throw new LeaveValidationError(`You already have a leave request between ${overlaps.startDate} and ${overlaps.endDate}.`);
  }

  return LeaveRequest.create({ employee: employeeId, leaveType, startDate, endDate, numberOfDays, reason: reason.trim(), attachment: null });
}

module.exports = { LeaveValidationError, cancelLeaveRequest, createLeaveRequest, getLeaveBalance, getLeaveRequest, getLeaveTypes, listLeaveRequests };
