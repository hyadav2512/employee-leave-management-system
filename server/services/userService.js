const bcrypt = require('bcrypt');
const demoUser = { id: 'employee-001', name: 'Alex Employee', email: 'employee@company.com', role: 'employee', passwordHash: bcrypt.hashSync('password123', 10) };
function findByEmail(email) { return email.toLowerCase() === demoUser.email ? demoUser : null; }
module.exports = { findByEmail, verifyPassword: bcrypt.compare };