/**
 * API Service for fetching JSON content, saving via Serverless Functions,
 * admin authentication, and Cloudinary image uploads.
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

// Cloudinary Image Upload
export async function uploadToCloudinary(file) {
  // 1. Request signature from serverless function
  const signRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
  });

  const signData = await signRes.json();

  if (!signRes.ok || !signData.configured) {
    // If Cloudinary server credentials are not fully configured in env,
    // we can convert to a base64 data URL or notify user
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Return data URL as fallback
        resolve({
          url: reader.result,
          isLocal: true,
          notice: 'Cloudinary not configured; used inline image.',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 2. Perform signed upload to Cloudinary API
  const { signature, timestamp, apiKey, cloudName, folder } = signData;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const uploadResult = await uploadRes.json();
  if (!uploadRes.ok) {
    throw new Error(uploadResult.error?.message || 'Cloudinary upload failed');
  }

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
}
