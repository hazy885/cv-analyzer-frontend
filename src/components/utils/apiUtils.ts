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
export const uploadFiles = async <T>(
  url: string, 
  files: File[], 
  onProgress?: (progress: number) => void
): Promise<{ data?: T; error?: string }> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    
    // Add files with the standard name
    files.forEach(file => {
      formData.append('file', file);
    });

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
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({ data });
        } catch (error) {
          resolve({ data: xhr.responseText as unknown as T });
        }
      } else {
        reject({ error: `HTTP error! status: ${xhr.status}` });
      }
    };

    xhr.onerror = () => {
      reject({ error: 'Network error' });
    };

    xhr.send(formData);
  });
};

// CV API service
export const cvApiService = {
  // Base URL for API
  baseUrl: 'http://localhost:8000',
  
  // Parse LinkedIn profile
  parseLinkedIn: async (url: string) => {
    return apiFetch(`${cvApiService.baseUrl}/extract_linkedin`, {
      method: 'POST',
      body: { url }
    });
  },
  
  // Upload and parse CV files (PDF, DOCX, etc.)
  uploadCV: async (files: File[], onProgress?: (progress: number) => void) => {
    return uploadFiles(`${cvApiService.baseUrl}/extract_document`, files, onProgress);
  },
  
  // Parse CV from text
  parseText: async (text: string) => {
    return apiFetch(`${cvApiService.baseUrl}/extract_text`, {
      method: 'POST',
      body: { text }
    });
  },
  
  // Get all parsed CVs
  getAllCVs: async () => {
    return apiFetch(`${cvApiService.baseUrl}/cvs`, {
      method: 'GET'
    });
  },
  
  // Get a specific CV by ID
  getCV: async (id: string) => {
    return apiFetch(`${cvApiService.baseUrl}/cv/${id}`, {
      method: 'GET'
    });
  },
  
  // Save parsed CV to database
  saveCV: async (cvData: any) => {
    return apiFetch(`${cvApiService.baseUrl}/save_cv`, {
      method: 'POST',
      body: cvData
    });
  }
};