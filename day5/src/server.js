import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userStore } from './userStore.js';
import { protect, requireRole } from './authMiddleware.js';

const app = express();
const { PORT = 3002, JWT_SECRET, JWT_EXPIRES_IN = '1h', ALLOWED_ORIGIN } = process.env;

app.use(cors({ origin: ALLOWED_ORIGIN }), express.json(), express.static('../public'));

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || (password?.length ?? 0) < 6) {
    return res.status(400).json({ error: 'Name, email, and 6+ char password required' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = userStore.create({ name: name.trim(), email: email.trim(), passwordHash, role });
  if (!created) return res.status(409).json({ error: 'Email already registered' });

  res.status(201).json(created);
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email = '', newPassword = '' } = req.body || {};
  const user = userStore.findByEmail(email.trim());

  if (!user) return res.status(404).json({ error: 'Email not found' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  res.json({ message: 'Password updated successfully!' });
});

app.get('/api/user/profile', protect, requireRole('user'), 
(req, res) => res.json({ message: 'Welcome User!', user: req.user }));
app.get('/api/admin/dashboard', protect, requireRole('admin'), 
(req, res) => res.json({ message: 'Welcome Admin!', user: req.user }));

app.listen(PORT, () => console.log(`Day 5 Server running on http://localhost:${PORT}`));