const userService = require('../services/userService');

function getProfile(req, res) {
  const user = userService.findById(req.auth.sub);
  if (!user) return res.status(404).json({ message: 'Employee profile not found.' });
  return res.json(userService.toProfile(user));
}

function updateProfile(req, res) {
  const { name, phone, profileImage } = req.body || {};
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80)) {
    return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
  }
  if (phone !== undefined && phone !== '' && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Please enter a valid 10-digit phone number.' });
  }
  if (profileImage !== undefined && profileImage !== '' && (!/^data:image\/(jpeg|png|webp);base64,/.test(profileImage) || profileImage.length > 2 * 1024 * 1024)) {
    return res.status(400).json({ message: 'Profile image must be a JPEG, PNG, or WEBP image under 1.5 MB.' });
  }
  const user = userService.updateProfile(req.auth.sub, { name: name?.trim(), phone, profileImage });
  if (!user) return res.status(404).json({ message: 'Employee profile not found.' });
  return res.json({ message: 'Profile updated successfully.', user: userService.toProfile(user) });
}

module.exports = { getProfile, updateProfile };
