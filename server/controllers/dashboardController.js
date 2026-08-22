const dashboardService = require('../services/dashboardService');

function getEmployeeDashboard(req, res) {
  return res.json(dashboardService.getEmployeeDashboard(req.auth.sub));
}

module.exports = { getEmployeeDashboard };