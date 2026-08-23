const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { jwtSecret } = require('../config/config');
const userService = require('../services/userService');

async function login(req, res) {
  const { email, password } = req.body;
  const user = typeof email === 'string' && userService.findByEmail(email);
  const validPassword = user && typeof password === 'string' ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !validPassword){
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '8h' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};
  if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({ message: 'All password fields are required.' });
  if (newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  if (newPassword !== confirmPassword) return res.status(400).json({ message: 'New passwords do not match.' });
  const user = userService.findById(req.auth.sub);
  const validCurrent = user && await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validCurrent) return res.status(400).json({ message: 'Incorrect current password.' });
  if (currentPassword === newPassword) return res.status(400).json({ message: 'New password must be different from current password.' });
  userService.updatePassword(user.id, await bcrypt.hash(newPassword, 10));
  return res.json({ message: 'Password changed successfully.' });
}

module.exports = { changePassword, login };