const leaveService = require('../services/leaveService');

function getLeaveTypes(req, res) {
  return res.json(leaveService.getLeaveTypes());
}

function getLeaveBalance(req, res) {
  return res.json(leaveService.getLeaveBalance(req.auth.sub));
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

module.exports = { createLeave, getLeaveBalance, getLeaveTypes };
