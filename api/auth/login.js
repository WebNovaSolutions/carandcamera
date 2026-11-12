import bcrypt from 'bcryptjs';
import { signSession, setSessionCookie } from '../_utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { password } = body || {};

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const envHash = process.env.ADMIN_PASSWORD_HASH;
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    let isValid = false;

    if (envHash) {
      isValid = bcrypt.compareSync(password, envHash);
    } else {
      isValid = password === envPass;
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = signSession({ role: 'admin', authenticatedAt: Date.now() });
    setSessionCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      user: { role: 'admin' },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
}
