import { verifySession } from '../_utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ authenticated: false, error: 'Not authenticated' });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      role: session.role || 'admin',
      authenticatedAt: session.authenticatedAt,
    },
  });
}
