import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const SESSION_COOKIE_NAME = 'admin_session';
const DEFAULT_SECRET = 'cameracarrentals_fallback_secret_key_2026';

export function getSecret() {
  return process.env.SESSION_SECRET || DEFAULT_SECRET;
}

export function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  return cookie.parse(cookieHeader);
}

export function verifySession(req) {
  try {
    const cookies = parseCookies(req);
    const token = cookies[SESSION_COOKIE_NAME];
    if (!token) return null;
    const decoded = jwt.verify(token, getSecret());
    return decoded;
  } catch (err) {
    return null;
  }
}

export function signSession(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

export function setSessionCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieStr = cookie.serialize(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  res.setHeader('Set-Cookie', cookieStr);
}

export function clearSessionCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieStr = cookie.serialize(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookieStr);
}
