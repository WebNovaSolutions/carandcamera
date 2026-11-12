import crypto from 'crypto';
import { verifySession } from '../_utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || '';

  if (!apiSecret || !apiKey || !cloudName) {
    return res.status(200).json({
      configured: false,
      message: 'Cloudinary credentials not configured in environment variables. You can still paste direct image URLs.',
    });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'cameracarrentals';

  // Cloudinary signature parameters must be ordered alphabetically by key
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  return res.status(200).json({
    configured: true,
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    uploadPreset,
  });
}
