import { signToken } from '../../middleware/auth.js';

export async function adminLogin(req, res) {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(503).json({
      message: 'Admin portal not configured. Set ADMIN_PASSWORD in server/.env',
    });
  }

  if (!password || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = signToken({ role: 'admin' });
  res.json({ token, expiresIn: '7d' });
}

export async function adminMe(req, res) {
  res.json({ role: req.admin.role, authenticated: true });
}
