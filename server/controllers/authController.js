const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const userService = require('../services/userService');
async function login(req, res) {
  const { email, password } = req.body;
  const user = typeof email === 'string' && userService.findByEmail(email);
  const validPassword = user && typeof password === 'string' ? await userService.verifyPassword(password, user.passwordHash) : false;
  if (!user || !validPassword) return res.status(401).json({ message: 'Invalid email or password.' });
  const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '8h' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
module.exports = { login };