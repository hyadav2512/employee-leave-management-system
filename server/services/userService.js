const bcrypt = require('bcrypt');

// Dummy user data for demonstration purpose
const demoUser = {
    id: 'employee-001',
    name: 'Mansi Employee',
    email: 'employee@company.com',
    role: 'employee',
    passwordHash: bcrypt.hashSync('password123', 10)
};

function findByEmail(email) {
    return email.toLowerCase() === demoUser.email ? demoUser : null;
}
module.exports = { findByEmail };