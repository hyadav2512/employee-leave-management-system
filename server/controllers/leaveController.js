const leaveService = require('../services/leaveService');

function getLeaveTypes(req, res) {
  return res.json(leaveService.getLeaveTypes());
}

function getLeaveBalance(req, res) {
  return res.json(leaveService.getLeaveBalance(req.auth.sub));
}

function getLeaves(req, res) {
  return res.json(leaveService.listLeaveRequests(req.auth.sub, req.query));
}

function getLeave(req, res) {
  const request = leaveService.getLeaveRequest(req.auth.sub, req.params.id);
  if (!request) return res.status(404).json({ message: 'Leave request not found.' });
  return res.json(request);
}

function cancelLeave(req, res) {
  try {
    const request = leaveService.cancelLeaveRequest(req.auth.sub, req.params.id);
    return res.json({ message: 'Leave request cancelled successfully.', request });
  } catch (error) {
    if (error instanceof leaveService.LeaveValidationError) return res.status(error.status).json({ message: error.message });
    return res.status(500).json({ message: 'Unable to cancel your leave request.' });
  }
}

function createLeave(req, res) {
  try {
    const request = leaveService.createLeaveRequest(req.auth.sub, req.body);
    return res.status(201).json({ message: 'Leave request submitted successfully.', request });
  } catch (error) {
    if (error instanceof leaveService.LeaveValidationError) return res.status(error.status).json({ message: error.message });
    return res.status(500).json({ message: 'Unable to submit your leave request.' });
  }
}

module.exports = { cancelLeave, createLeave, getLeave, getLeaveBalance, getLeaveTypes, getLeaves };
