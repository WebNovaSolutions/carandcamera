/**
 * API Service for fetching JSON content, saving via Serverless Functions,
 * and admin authentication.
 */

// Fetch JSON data file at runtime with cache-busting
export async function fetchJsonData(fileName) {
  try {
    const timestamp = Date.now();
    const response = await fetch(`/data/${fileName}?_t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load /data/${fileName}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    throw error;
  }
}

// Save JSON data via Vercel Serverless Function / GitHub API
export async function saveJsonData(fileName, content) {
  const response = await fetch('/api/admin/save-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: fileName,
      content,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || result.message || 'Failed to save content');
  }

  return result;
}

// Admin Authentication
export async function loginAdmin(password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Authentication failed');
  }

  return result;
}

export async function logoutAdmin() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  return await response.json();
}

export async function checkAdminAuth() {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) return { authenticated: false };
    const data = await response.json();
    return data;
  } catch (err) {
    return { authenticated: false };
  }
}

