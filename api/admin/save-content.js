import fs from 'fs';
import path from 'path';
import { verifySession } from '../_utils/auth.js';

const ALLOWED_FILES = [
  'cars.json',
  'cameras.json',
  'services.json',
  'website.json',
  'contact.json',
  'navigation.json',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verify admin session
  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { file, content } = body || {};

    // 2. Validate file parameter
    if (!file || !ALLOWED_FILES.includes(file)) {
      return res.status(400).json({
        error: `Invalid file. Allowed files: ${ALLOWED_FILES.join(', ')}`,
      });
    }

    if (content === undefined || content === null) {
      return res.status(400).json({ error: 'Content payload is required' });
    }

    const formattedJson = JSON.stringify(content, null, 2);

    // 3. Check GitHub configuration
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    if (token && owner && repo) {
      // Use GitHub REST API
      const filePath = `public/data/${file}`;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

      // 4. Get current SHA
      let currentSha = null;
      try {
        const getRes = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'OneRentals-Admin',
          },
        });

        if (getRes.ok) {
          const fileData = await getRes.json();
          currentSha = fileData.sha;
        } else if (getRes.status !== 404) {
          const errText = await getRes.text();
          console.error('Error fetching file SHA from GitHub:', errText);
        }
      } catch (getErr) {
        console.error('Failed to query GitHub for SHA:', getErr);
      }

      // 5. Update / Commit file to GitHub
      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const commitBody = {
        message: `Update ${file} via Admin Dashboard [skip ci]`,
        content: Buffer.from(formattedJson, 'utf-8').toString('base64'),
        branch,
      };

      if (currentSha) {
        commitBody.sha = currentSha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'OneRentals-Admin',
        },
        body: JSON.stringify(commitBody),
      });

      if (!putRes.ok) {
        const errorDetails = await putRes.text();
        console.error('GitHub API Commit Failed:', errorDetails);
        return res.status(putRes.status).json({
          error: 'Failed to commit content update to GitHub',
          details: errorDetails,
        });
      }

      const commitResult = await putRes.json();

      // Also update local file if workspace is accessible
      try {
        const localPath = path.resolve(process.cwd(), 'public', 'data', file);
        if (fs.existsSync(path.dirname(localPath))) {
          fs.writeFileSync(localPath, formattedJson, 'utf-8');
        }
      } catch (e) {
        // Ignored if readonly serverless filesystem
      }

      return res.status(200).json({
        success: true,
        mode: 'github',
        commit: commitResult.commit?.sha || 'committed',
        message: `${file} committed and updated on GitHub successfully`,
        updatedAt: new Date().toISOString(),
      });
    }

    // Fallback: Local filesystem mode (for local dev server)
    const localPath = path.resolve(process.cwd(), 'public', 'data', file);
    fs.writeFileSync(localPath, formattedJson, 'utf-8');

    return res.status(200).json({
      success: true,
      mode: 'local',
      message: `${file} updated on local disk (GitHub credentials not set; running in local dev mode)`,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Save content error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while saving content',
      message: err.message,
    });
  }
}
