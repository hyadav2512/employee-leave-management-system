const bcrypt = require('bcryptjs');

// Dummy user data for demonstration purpose
const demoUser = {
    id: 'employee-001',
    employeeId: 'EMP001',
    name: 'Mansi Employee',
    email: 'employee@company.com',
    phone: '',
    profileImage: '',
    dateOfBirth: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    manager: 'John Smith',
    joiningDate: '2022-12-01',
    role: 'employee',
    passwordHash: bcrypt.hashSync('password123', 10)
};

function findByEmail(email) {
    return email.toLowerCase() === demoUser.email ? demoUser : null;
}

function findById(id) {
    return id === demoUser.id ? demoUser : null;
}

function updateProfile(id, updates) {
    const user = findById(id);
    if (!user) return null;
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.profileImage !== undefined) user.profileImage = updates.profileImage;
    return user;
}

function updatePassword(id, passwordHash) {
    const user = findById(id);
    if (!user) return null;
    user.passwordHash = passwordHash;
    return user;
}

function toProfile(user) {
    return {
        id: user.id, employeeId: user.employeeId, name: user.name, email: user.email,
        phone: user.phone, profileImage: user.profileImage, dateOfBirth: user.dateOfBirth,
        department: user.department, designation: user.designation, manager: user.manager,
        joiningDate: user.joiningDate, role: user.role,
    };
}

module.exports = { findByEmail, findById, toProfile, updatePassword, updateProfile };