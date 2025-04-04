// Robust API fetch utility with detailed error handling
export const apiFetch = async <T>(
  url: string, 
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<{ data?: T; error?: string }> => {
  try {
    console.log('API Request:', {
      url,
      method: options.method || 'POST',
      body: options.body
    });

    const response = await fetch(url, {
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const responseText = await response.text();
    console.log('API Response:', responseText);

    if (!response.ok) {
      return { 
        error: `HTTP error! status: ${response.status}, message: ${responseText}` 
      };
    }

    const data = responseText ? JSON.parse(responseText) : {};
    return { data };
  } catch (error) {
    console.error('API fetch error:', error);
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
};

// Utility for file uploads with progress tracking
export const uploadFiles = (
  url: string, 
  files: File[], 
  onProgress?: (progress: number) => void
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    // Track upload progress
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(xhr.responseText));
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error'));
    };

    xhr.send(formData);
  });
};