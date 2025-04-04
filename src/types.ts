// Type definitions for CV Parser application

declare global {
  interface Window {
    ENV?: {
      REACT_APP_API_URL?: string;
      REACT_APP_MAX_UPLOAD_SIZE?: number;
    }
  }
}

export interface FileWithPreview extends File {
  preview?: string;
}

export interface ValidationResult {
  is_valid: boolean | null;
  confidence: number;
  extracted_data: any;
  error?: string;
}

export interface CVValidation {
  [key: string]: ValidationResult;
}

export interface CVData {
  name: string;
  email: string[];
  phone: string[];
  education: string[];
  experience: string[];
  skills: string[];
  headline?: string;
  summary?: string;
  linkedin_url?: string;
  certifications?: string[];
  languages?: string[];
  connections?: string;
  accomplishments?: string[];
  skill_categories?: Record<string, string[]>;
  volunteering?: string[];
  websites?: string[];
  recommendations?: string[];
  location?: string;
  note?: string; // Added for notification messages
}

export interface ParsedFile {
  filename: string;
  cv_data?: CVData;
  validation?: CVValidation;
  error?: string;
}

export interface ParsedLinkedIn {
  source: string;
  profile_url?: string;
  filename?: string;
  cv_data?: CVData;
  error?: string;
}

export interface FeedbackResponse {
  message: string;
  training_count: number;
}