import React, { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../components/ui/DarkModeContext';
import { 
  Upload, File, X, Check, AlertCircle, FileText, Database, 
  ThumbsUp, ThumbsDown, BarChart2, Shield, Info, RefreshCw,
  Download, FileUp, Star, Zap, Cpu, ArrowRight, Linkedin, LinkIcon,
  Briefcase, GraduationCap, Hash, Award, Globe, MessageCircle, 
  Mail, Phone, MapPin, Heart
} from 'lucide-react';

// -----------------------------
// Types
// -----------------------------
interface FileWithPreview extends File {
  preview?: string;
}

interface ValidationResult {
  is_valid: boolean | null;
  confidence: number;
  extracted_data: any;
  error?: string;
}

interface CVValidation {
  [key: string]: ValidationResult;
}

interface CVData {
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

interface ParsedFile {
  filename: string;
  cv_data?: CVData;
  validation?: CVValidation;
  error?: string;
}

interface ParsedLinkedIn {
  source: string;
  profile_url?: string;
  filename?: string;
  cv_data?: CVData;
  error?: string;
}

interface FeedbackResponse {
  message: string;
  training_count: number;
}

// -----------------------------
// Progress Bar Component
// -----------------------------
interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4 overflow-hidden">
    <div
      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// -----------------------------
// Dropzone Component
// -----------------------------
interface DropzoneProps {
  isDragging: boolean;
  darkMode: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

const Dropzone: React.FC<DropzoneProps> = ({
  isDragging,
  darkMode,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-12 mb-8 text-center transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-lg
        ${isDragging 
          ? (darkMode ? 'border-blue-400 bg-blue-900/20' : 'border-blue-500 bg-blue-50') 
          : (darkMode ? 'border-gray-700 hover:border-blue-400' : 'border-gray-300 hover:border-blue-400')}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col items-center justify-center">
        {isDragging ? (
          <div className="mb-6 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
            <Download 
              size={48} 
              className="text-blue-500 animate-pulse" 
            />
          </div>
        ) : (
          <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-full">
            <FileUp 
              size={48} 
              className={`transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
            />
          </div>
        )}
        
        <h3 className="mb-2 text-xl font-semibold">
          {isDragging ? 'Drop files to upload' : 'Upload your resume files'}
        </h3>
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Drag & drop files or click to browse
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">PDF</span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">DOCX</span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">DOC</span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">RTF</span>
        </div>
        <button
          type="button"
          className="px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2
            bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white
            shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Upload size={18} />
          Browse Files
        </button>
      </div>
    </div>
  );
};

// -----------------------------
// File List Component
// -----------------------------
interface FileListProps {
  files: FileWithPreview[];
  darkMode: boolean;
  getFileIcon: (file: FileWithPreview) => React.ReactNode;
  getFileSize: (size: number) => string;
  removeFile: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ files, darkMode, getFileIcon, getFileSize, removeFile }) => {
  return (
    <div className={`mb-8 ${darkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300`}>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText size={18} className="text-blue-500" />
        <span>{files.length} {files.length === 1 ? 'File' : 'Files'} Selected</span>
      </h2>
      <div className="space-y-3">
        {files.map((file, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 
              ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700/80' : 'bg-gray-50 hover:bg-gray-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {getFileIcon(file)}
              </div>
              <div>
                <p className="font-medium truncate max-w-xs">{file.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {getFileSize(file.size)}
                </p>
              </div>
            </div>
            <button 
              onClick={() => removeFile(index)}
              className={`p-2 rounded-full transition-colors 
                ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400' : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'}`}
              aria-label="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// -----------------------------
// Status Message Component
// -----------------------------
interface StatusMessageProps {
  status: 'idle' | 'success' | 'error';
  message: string;
  darkMode: boolean;
  onClose: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status, message, darkMode, onClose }) => {
  if (status === 'idle') return null;
  
  const isSuccess = status === 'success';
  return (
    <div className={`mb-6 p-4 rounded-lg flex items-center justify-between transition-all duration-300 transform 
      ${isSuccess 
        ? (darkMode ? 'bg-green-900/30 text-green-200 border border-green-700/30' : 'bg-green-50 text-green-800 border border-green-200') 
        : (darkMode ? 'bg-red-900/30 text-red-200 border border-red-700/30' : 'bg-red-50 text-red-800 border border-red-200')}`}>
      <span className="flex items-center gap-2">
        {isSuccess 
          ? <Check size={18} className="text-green-500" /> 
          : <AlertCircle size={18} className="text-red-500" />}
        {message}
      </span>
      <button 
        onClick={onClose} 
        className="text-current hover:bg-black/10 p-1 rounded-full transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};

// -----------------------------
// Confidence Indicator Component
// -----------------------------
interface ConfidenceIndicatorProps {
  confidence: number;
  isValid: boolean | null;
  darkMode: boolean;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence, isValid, darkMode }) => {
  const getColor = () => {
    if (isValid === null) return darkMode ? 'bg-gray-600' : 'bg-gray-300';
    if (confidence > 0.8) return isValid ? 'bg-green-500' : 'bg-red-500';
    if (confidence > 0.5) return isValid ? 'bg-yellow-500' : 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${Math.max(5, confidence * 100)}%` }}
        ></div>
      </div>
      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {isValid === null ? 'Unknown' : `${Math.round(confidence * 100)}%`}
      </span>
    </div>
  );
};

// -----------------------------
// Feedback Buttons Component
// -----------------------------
interface FeedbackButtonsProps {
  field: string;
  extractedData: any;
  onFeedback: (field: string, extractedData: any, isCorrect: boolean) => void;
  darkMode: boolean;
  feedbackInProgress: boolean;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ 
  field, 
  extractedData, 
  onFeedback, 
  darkMode,
  feedbackInProgress
}) => {
  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => onFeedback(field, extractedData, true)}
        disabled={feedbackInProgress}
        className={`p-1.5 rounded-md flex items-center gap-1 ${
          darkMode 
            ? 'bg-green-900/30 text-green-300 hover:bg-green-800/50' 
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        } transition-colors text-xs`}
      >
        <ThumbsUp size={14} />
        <span>Correct</span>
      </button>
      <button
        onClick={() => onFeedback(field, extractedData, false)}
        disabled={feedbackInProgress}
        className={`p-1.5 rounded-md flex items-center gap-1 ${
          darkMode 
            ? 'bg-red-900/30 text-red-300 hover:bg-red-800/50' 
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        } transition-colors text-xs`}
      >
        <ThumbsDown size={14} />
        <span>Incorrect</span>
      </button>
    </div>
  );
};

// -----------------------------
// LinkedIn URL Input Component
// -----------------------------
interface LinkedInInputProps {
  darkMode: boolean;
  linkedInUrl: string;
  setLinkedInUrl: (url: string) => void;
  isProcessing: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

const LinkedInInput: React.FC<LinkedInInputProps> = ({ 
  darkMode, 
  linkedInUrl, 
  setLinkedInUrl, 
  isProcessing, 
  onSubmit, 
  onClear 
}) => {
  const isValidUrl = linkedInUrl.trim() !== '' && 
    (linkedInUrl.includes('linkedin.com/in/') || 
     linkedInUrl.includes('linkedin.com/profile/'));

  return (
    <div className={`p-6 mb-8 rounded-2xl transition-all duration-300 shadow-lg
      ${darkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white'}`}>
      <div className="flex items-center mb-4 gap-2">
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <Linkedin size={24} className="text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold">LinkedIn Profile Parser</h3>
      </div>
      
      <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-blue-900/10 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
        <div className="flex items-start gap-2">
          <Info size={18} className="mt-0.5" />
          <div>
            <p className="text-sm">
              Enter a LinkedIn profile URL to extract professional information. This works alongside resume uploads to provide comprehensive candidate data.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LinkIcon size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            className={`w-full pl-10 pr-10 py-3 rounded-lg transition-colors border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="https://www.linkedin.com/in/username"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            disabled={isProcessing}
          />
          {linkedInUrl && (
            <button
              type="button"
              onClick={onClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X 
                size={18} 
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`} 
              />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValidUrl || isProcessing}
          className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap
            ${isValidUrl && !isProcessing 
              ? (darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg') 
              : (darkMode 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed')}
          `}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="animate-spin h-5 w-5" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <ArrowRight size={18} />
              <span>Parse Profile</span>
            </>
          )}
        </button>
      </div>
      
      {linkedInUrl && !isValidUrl && (
        <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} flex items-center gap-1`}>
          <AlertCircle size={14} />
          Please enter a valid LinkedIn profile URL
        </p>
      )}
    </div>
  );
};

// -----------------------------
// LinkedIn Profile Display Component
// -----------------------------
interface LinkedInProfileDisplayProps {
  profileData: CVData;
  darkMode: boolean;
  onFeedback: (field: string, data: any, isCorrect: boolean) => void;
  feedbackInProgress: boolean;
}

const LinkedInProfileDisplay: React.FC<LinkedInProfileDisplayProps> = ({ 
  profileData, 
  darkMode, 
  onFeedback,
  feedbackInProgress
}) => {
  // Check if the profile has any contact information
  const hasContact = profileData.email?.length > 0 || profileData.phone?.length > 0 || profileData.location;
  
  // Helper for feedback buttons
  const FeedbackButtons = ({ field, data }: { field: string; data: any }) => {
    return (
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onFeedback(field, data, true)}
          disabled={feedbackInProgress}
          className={`p-1.5 rounded-md flex items-center gap-1 ${
            darkMode 
              ? 'bg-green-900/30 text-green-300 hover:bg-green-800/50' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          } transition-colors text-xs`}
        >
          <Star size={14} />
          <span>Correct</span>
        </button>
        <button
          onClick={() => onFeedback(field, data, false)}
          disabled={feedbackInProgress}
          className={`p-1.5 rounded-md flex items-center gap-1 ${
            darkMode 
              ? 'bg-red-900/30 text-red-300 hover:bg-red-800/50' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          } transition-colors text-xs`}
        >
          <MessageCircle size={14} />
          <span>Issue</span>
        </button>
      </div>
    );
  };
  
  // Helper for section headers
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-1.5 rounded-md ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {title}
      </h3>
    </div>
  );
  
  // Check if profile has any data at all
  const isEmpty = !profileData.name && 
                 (!profileData.skills || profileData.skills.length === 0) && 
                 (!profileData.education || profileData.education.length === 0) && 
                 (!profileData.experience || profileData.experience.length === 0) &&
                 !profileData.headline && 
                 !profileData.summary;
  
  // Display a message when no data was found
  if (isEmpty) {
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/60' : 'bg-white'} shadow-lg transition-all duration-300`}>
        <div className="mb-6 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <Linkedin size={28} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">LinkedIn Profile</h2>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-amber-900/20 text-amber-200 border border-amber-800/30' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5" />
            <div>
              <p className="font-medium">Limited Profile Data Available</p>
              <p className="text-sm mt-1">
                LinkedIn restricts automated access to profiles. For better results:
              </p>
              <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
                <li>Try uploading a screenshot of the profile</li>
                <li>Use a PDF export of the profile</li>
                <li>Make sure the profile is public</li>
              </ul>
            </div>
          </div>
        </div>
        
        {profileData.linkedin_url && (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <a 
                href={profileData.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
              >
                {profileData.linkedin_url}
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/60' : 'bg-white'} shadow-lg transition-all duration-300`}>
      {/* LinkedIn Banner */}
      <div className={`mb-6 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <Linkedin size={28} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profileData.name || 'LinkedIn Profile'}</h2>
            {profileData.headline && (
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{profileData.headline}</p>
            )}
          </div>
        </div>
        {profileData.connections && (
          <div className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-blue-900/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            {profileData.connections} connections
          </div>
        )}
      </div>
      
      {/* Message for limited data */}
      {((!profileData.experience || profileData.experience.length === 0) && 
       (!profileData.education || profileData.education.length === 0)) && (
        <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-amber-900/20 text-amber-200 border border-amber-800/30' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          <div className="flex items-start gap-2">
            <Info size={18} className="mt-0.5" />
            <div>
              <p className="text-sm">
                Limited profile data was extracted. LinkedIn restricts automated access to profiles. For complete data, consider uploading a screenshot or PDF export.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom notification if provided */}
      {profileData.note && (
        <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-amber-900/20 text-amber-200 border border-amber-800/30' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          <div className="flex items-start gap-2">
            <Info size={18} className="mt-0.5" />
            <div>
              <p className="text-sm">{profileData.note}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Contact Information */}
      {hasContact && (
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex flex-wrap gap-4">
            {profileData.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{profileData.location}</span>
              </div>
            )}
            
            {profileData.email?.length > 0 && profileData.email.map((email, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mail size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{email}</span>
              </div>
            ))}
            
            {profileData.phone?.length > 0 && profileData.phone.map((phone, i) => (
              <div key={i} className="flex items-center gap-2">
                <Phone size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{phone}</span>
              </div>
            ))}
            
            {profileData.websites?.length > 0 && profileData.websites.map((website, i) => (
              <div key={i} className="flex items-center gap-2">
                <Globe size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <a href={website} target="_blank" rel="noopener noreferrer" 
                   className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}>
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            ))}
            
            {profileData.linkedin_url && (
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <a 
                  href={profileData.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {profileData.linkedin_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Profile Summary */}
      {profileData.summary && (
        <div className={`mb-6 p-5 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50/90'}`}>
          <SectionHeader 
            icon={<Star className="h-5 w-5 text-blue-500" />} 
            title="About" 
          />
          <p className={`whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {profileData.summary}
          </p>
          <FeedbackButtons field="summary" data={profileData.summary} />
        </div>
      )}
      
      {/* Experience */}
      {profileData.experience?.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Briefcase className="h-5 w-5 text-blue-500" />} 
            title="Experience" 
          />
          <div className="space-y-4">
            {profileData.experience.map((exp, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
              >
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: exp
                      .replace(/at ([^|]+)/, 'at <strong>$1</strong>')
                      .replace(/\(([^)]+)\)/, '<span class="text-gray-500">($1)</span>')
                      .replace(/\| ([^-]+)/, '| <span class="text-gray-500">$1</span>')
                  }} 
                />
              </div>
            ))}
          </div>
          <FeedbackButtons field="experience" data={profileData.experience} />
        </div>
      )}
      
      {/* Education */}
      {profileData.education?.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
            title="Education" 
          />
          <div className="space-y-4">
            {profileData.education.map((edu, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
              >
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: edu
                      .replace(/at ([^(]+)/, 'at <strong>$1</strong>')
                      .replace(/\(([^)]+)\)/, '<span class="text-gray-500">($1)</span>')
                  }} 
                />
              </div>
            ))}
          </div>
          <FeedbackButtons field="education" data={profileData.education} />
        </div>
      )}
      
      {/* Skills - Categorized if available */}
      {(profileData.skills?.length > 0 || Object.keys(profileData.skill_categories || {}).length > 0) && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Hash className="h-5 w-5 text-blue-500" />}
            title="Skills" 
          />
          
          {/* Categorized skills */}
          {profileData.skill_categories && Object.keys(profileData.skill_categories).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(profileData.skill_categories).map(([category, skills]) => (
                <div key={category} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span key={idx} className={`px-3 py-1 rounded-full text-sm 
                        ${darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flat skills list
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-sm 
                    ${darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          <FeedbackButtons field="skills" data={profileData.skills} />
        </div>
      )}
      
      {/* Certifications */}
      {profileData.certifications?.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Award className="h-5 w-5 text-blue-500" />}
            title="Certifications" 
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <ul className="space-y-2">
              {profileData.certifications.map((cert, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
          <FeedbackButtons field="certifications" data={profileData.certifications} />
        </div>
      )}
      
      {/* Languages */}
      {profileData.languages?.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Globe className="h-5 w-5 text-blue-500" />}
            title="Languages" 
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((lang, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-sm 
                  ${darkMode ? 'bg-indigo-900/20 text-indigo-300 border border-indigo-800/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <FeedbackButtons field="languages" data={profileData.languages} />
        </div>
      )}
      
      {/* Accomplishments */}
      {profileData.accomplishments?.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Star className="h-5 w-5 text-blue-500" />}
            title="Accomplishments" 
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <ul className="space-y-2">
              {profileData.accomplishments.map((acc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Volunteering */}
      {profileData.volunteering?.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Heart className="h-5 w-5 text-blue-500" />}
            title="Volunteering" 
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <ul className="space-y-2">
              {profileData.volunteering.map((vol, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <span>{vol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Recommendations */}
      {profileData.recommendations?.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<MessageCircle className="h-5 w-5 text-blue-500" />}
            title="Recommendations" 
          />
          <div className="space-y-4">
            {profileData.recommendations.map((rec, i) => (
              <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} italic`}>
                "{rec}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------
// Parsed Data Display Component
// -----------------------------
interface ParsedDataProps {
  parsedResults: ParsedFile[];
  parsedLinkedIn?: ParsedLinkedIn | null;
  darkMode: boolean;
  onFeedback: (field: string, extractedData: any, isCorrect: boolean) => void;
  feedbackInProgress: boolean;
}

const ParsedDataDisplay: React.FC<ParsedDataProps> = ({ 
  parsedResults, 
  parsedLinkedIn,
  darkMode, 
  onFeedback,
  feedbackInProgress
}) => {
  // Combine resume and LinkedIn data if both are available
  const combinedResults = [...parsedResults];
  
  // Add LinkedIn data as a separate entry if available
  if (parsedLinkedIn && parsedLinkedIn.cv_data) {
    // Create a proper display name for the LinkedIn entry
    let displayName = 'LinkedIn Profile';
    
    if (parsedLinkedIn.cv_data.name) {
      displayName = `LinkedIn: ${parsedLinkedIn.cv_data.name}`;
    } else if (parsedLinkedIn.profile_url) {
      const username = parsedLinkedIn.profile_url.split('/in/')[1]?.split('/')[0];
      if (username) {
        displayName = `LinkedIn: ${username.replace(/-/g, ' ')}`;
      }
    }
    
    const linkedInEntry: ParsedFile = {
      filename: displayName,
      cv_data: parsedLinkedIn.cv_data,
      // Add basic validation for LinkedIn data if it exists
      validation: parsedLinkedIn.cv_data.name ? {
        name: { 
          is_valid: true, 
          confidence: 0.95, 
          extracted_data: parsedLinkedIn.cv_data.name 
        },
        skills: { 
          is_valid: true, 
          confidence: parsedLinkedIn.cv_data.skills?.length > 0 ? 0.9 : 0.5, 
          extracted_data: parsedLinkedIn.cv_data.skills 
        }
      } : undefined
    };
    
    // Add error message if LinkedIn provided one
    if (parsedLinkedIn.error) {
      linkedInEntry.error = parsedLinkedIn.error;
    }
    
    // Add a note if the profile has minimal data
    const hasDetailedData = parsedLinkedIn.cv_data.experience?.length > 0 || 
                            parsedLinkedIn.cv_data.education?.length > 0 || 
                            parsedLinkedIn.cv_data.skills?.length > 0;
    
    if (!hasDetailedData && parsedLinkedIn.cv_data.note === undefined) {
      parsedLinkedIn.cv_data.note = "Limited profile data available. LinkedIn restricts automated access to profiles.";
    }
    
    combinedResults.push(linkedInEntry);
  }
  
  return (
    <div className={`mt-8 ${darkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white'} rounded-xl shadow-lg p-6 transition-all duration-300`}>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Database size={20} className="text-green-500" />
        <span>Extracted Candidate Data</span>
        {parsedLinkedIn && (
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
            darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
          }`}>
            Including LinkedIn
          </span>
        )}
      </h2>
      
      {/* No results message */}
      {combinedResults.length === 0 && (
        <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
          <div className="flex flex-col items-center gap-3 mb-3">
            <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-lg font-medium">No Data Available</p>
            <p className={`text-sm max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Upload resume files or enter a LinkedIn profile URL to extract candidate data.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {combinedResults.map((result, index) => (
          <div key={index} className={`rounded-lg border transition-all ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className="text-lg font-medium p-6 pb-2 flex items-center gap-2">
              {result.filename.includes('LinkedIn') ? 
                <Linkedin size={18} className={darkMode ? "text-blue-400" : "text-blue-500"} /> :
                <FileText size={18} className={darkMode ? "text-blue-400" : "text-blue-500"} />
              }
              {result.filename}
            </h3>
            
            {result.error ? (
              <div className={`p-4 mx-6 mb-6 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'}`}>
                <p className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  Error: {result.error}
                </p>
              </div>
            ) : (
              result.filename.includes('LinkedIn') ? (
                // Use the specialized LinkedIn display component for LinkedIn data
                <LinkedInProfileDisplay 
                  profileData={result.cv_data!}
                  darkMode={darkMode}
                  onFeedback={onFeedback}
                  feedbackInProgress={feedbackInProgress}
                />
              ) : (
                // Standard CV display for resume data - unchanged from original code
                <div className="space-y-6 p-6 pt-0">
                  {/* Name Section */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Name</h4>
                      {result.validation?.name && (
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-md text-xs ${
                            result.validation.name.is_valid 
                              ? (darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-700') 
                              : (darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700')
                          }`}>
                            {result.validation.name.is_valid ? 'Valid' : 'Review'}
                          </div>
                          <ConfidenceIndicator 
                            confidence={result.validation.name.confidence} 
                            isValid={result.validation.name.is_valid} 
                            darkMode={darkMode} 
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xl font-medium">{result.cv_data?.name || 'Not found'}</p>
                    <FeedbackButtons
                      field="name"
                      extractedData={result.cv_data?.name}
                      onFeedback={onFeedback}
                      darkMode={darkMode}
                      feedbackInProgress={feedbackInProgress}
                    />
                  </div>
                  
                  {/* Contact Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Email</h4>
                        {result.validation?.email && (
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-md text-xs ${
                              result.validation.email.is_valid 
                                ? (darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-700') 
                                : (darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700')
                            }`}>
                              {result.validation.email.is_valid ? 'Valid' : 'Review'}
                            </div>
                            <ConfidenceIndicator 
                              confidence={result.validation.email.confidence} 
                              isValid={result.validation.email.is_valid} 
                              darkMode={darkMode} 
                            />
                          </div>
                        )}
                      </div>
                      {result.cv_data?.email && result.cv_data.email.length > 0 ? (
                        <ul className="space-y-1">
                          {result.cv_data.email.map((email, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                              {email}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Not found</p>
                      )}
                      <FeedbackButtons
                        field="email"
                        extractedData={result.cv_data?.email}
                        onFeedback={onFeedback}
                        darkMode={darkMode}
                        feedbackInProgress={feedbackInProgress}
                      />
                    </div>
                    
                    {/* Phone */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Phone</h4>
                        {result.validation?.phone && (
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-md text-xs ${
                              result.validation.phone.is_valid 
                                ? (darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-700') 
                                : (darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700')
                            }`}>
                              {result.validation.phone.is_valid ? 'Valid' : 'Review'}
                            </div>
                            <ConfidenceIndicator 
                              confidence={result.validation.phone.confidence} 
                              isValid={result.validation.phone.is_valid} 
                              darkMode={darkMode} 
                            />
                          </div>
                        )}
                      </div>
                      {result.cv_data?.phone && result.cv_data.phone.length > 0 ? (
                        <ul className="space-y-1">
                          {result.cv_data.phone.map((phone, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className={`w-1 h-1 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                              {phone}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Not found</p>
                      )}
                      <FeedbackButtons
                        field="phone"
                        extractedData={result.cv_data?.phone}
                        onFeedback={onFeedback}
                        darkMode={darkMode}
                        feedbackInProgress={feedbackInProgress}
                      />
                    </div>
                  </div>
                  
                  {/* Skills Section */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Skills</h4>
                      {result.validation?.skills && (
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-md text-xs ${
                            result.validation.skills.is_valid 
                              ? (darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-700') 
                              : (darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700')
                          }`}>
                            {result.validation.skills.is_valid ? 'Valid' : 'Review'}
                          </div>
                          <ConfidenceIndicator 
                            confidence={result.validation.skills.confidence} 
                            isValid={result.validation.skills.is_valid} 
                            darkMode={darkMode} 
                          />
                        </div>
                      )}
                    </div>
                    {result.cv_data?.skills && result.cv_data.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.cv_data.skills.map((skill, i) => (
                          <span key={i} className={`px-3 py-1 rounded-full text-sm 
                            ${darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Not found</p>
                    )}
                    <FeedbackButtons
                      field="skills"
                      extractedData={result.cv_data?.skills}
                      onFeedback={onFeedback}
                      darkMode={darkMode}
                      feedbackInProgress={feedbackInProgress}
                    />
                  </div>
                  
                  {/* Education & Experience Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Education</h4>
                        {result.validation?.education && (
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-md text-xs ${
                              result.validation.education.is_valid 
                                ? (darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-700') 
                                : (darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700')
                            }`}>
                              {result.validation.education.is_valid ? 'Valid' : 'Review'}
                            </div>
                            <ConfidenceIndicator 
                              confidence={result.validation.education.confidence} 
                              isValid={result.validation.education.is_valid} 
                              darkMode={darkMode} 
                            />
                          </div>
                        )}
                      </div>
                      {result.cv_data?.education && result.cv_data.education.length > 0 ? (
                        <ul className="space-y-2">
                          {result.cv_data.education.map((edu, i) => (
                            <li key={i} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/80'}`}>
                              {edu}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Not found</p>
                      )}
                      <FeedbackButtons
                        field="education"
                        extractedData={result.cv_data?.education}
                        onFeedback={onFeedback}
                        darkMode={darkMode}
                        feedbackInProgress={feedbackInProgress}
                      />
                    </div>
                    
                    {/* Experience */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Experience</h4>
                        {result.validation?.experience && (
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-md text-xs ${
                              result.validation.experience.is_valid 
                                ? (darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-700') 
                                : (darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700')
                            }`}>
                              {result.validation.experience.is_valid ? 'Valid' : 'Review'}
                            </div>
                            <ConfidenceIndicator 
                              confidence={result.validation.experience.confidence} 
                              isValid={result.validation.experience.is_valid} 
                              darkMode={darkMode} 
                            />
                          </div>
                        )}
                      </div>
                      {result.cv_data?.experience && result.cv_data.experience.length > 0 ? (
                        <ul className="space-y-2">
                          {result.cv_data.experience.map((exp, i) => (
                            <li key={i} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/80'}`}>
                              {exp}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Not found</p>
                      )}
                      <FeedbackButtons
                        field="experience"
                        extractedData={result.cv_data?.experience}
                        onFeedback={onFeedback}
                        darkMode={darkMode}
                        feedbackInProgress={feedbackInProgress}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// -----------------------------
// AI Model Info Panel Component
// -----------------------------
interface ModelInfoProps {
  darkMode: boolean;
  onTrainModel: () => void;
  isTraining: boolean;
}

const ModelInfoPanel: React.FC<ModelInfoProps> = ({ darkMode, onTrainModel, isTraining }) => {
  return (
    <div className={`mb-6 p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
          <Cpu size={28} className="text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
            AI-Powered Resume & LinkedIn Parser
            <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
              Active
            </span>
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our TensorFlow deep learning model validates extracted information with high accuracy. 
            Your feedback trains the model to become even more precise over time.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={onTrainModel}
              disabled={isTraining}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 
                ${darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white'
                } transition-all duration-200 shadow-md disabled:shadow-none`}
            >
              {isTraining ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Training...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Train Model</span>
                </>
              )}
            </button>
            <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Info size={14} />
              <span>Training uses feedback data to improve accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------
// Main Component: Import
// -----------------------------
const Import: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'resume' | 'linkedin'>('resume');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isProcessingLinkedIn, setIsProcessingLinkedIn] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [parsedResults, setParsedResults] = useState<ParsedFile[]>([]);
  const [parsedLinkedIn, setParsedLinkedIn] = useState<ParsedLinkedIn | null>(null);
  const [showParsedData, setShowParsedData] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [feedbackInProgress, setFeedbackInProgress] = useState<boolean>(false);
  const [feedbackStatus, setFeedbackStatus] = useState<{message: string, count: number} | null>(null);
  const [isTrainingModel, setIsTrainingModel] = useState<boolean>(false);
  const [linkedInUrl, setLinkedInUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set API URL on mount
  useEffect(() => {
    const backendUrl = 'http://localhost:5000';
    setApiUrl(backendUrl);
    console.log(`Backend API URL set to: ${backendUrl}`);
  }, []);

  // -----------------------------
  // File Handling & Utilities
  // -----------------------------
  const handleFiles = (newFiles: FileWithPreview[]) => {
    const filesWithPreviews = newFiles.map(file => {
      if (file.type === 'application/pdf') {
        file.preview = '/pdf-icon.png';
      }
      return file;
    });
    setFiles(prevFiles => [...prevFiles, ...filesWithPreviews]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files) as FileWithPreview[];
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as FileWithPreview[];
      handleFiles(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.includes('pdf')) {
      return <FileText size={24} className="text-red-500" />;
    } else if (file.type.includes('doc') || file.type.includes('word')) {
      return <FileText size={24} className="text-blue-500" />;
    } else {
      return <File size={24} className="text-gray-500" />;
    }
  };

  // -----------------------------
  // Process Resume Files
  // -----------------------------
  const processCV = async () => {
    if (!files.length) return console.log('No files to process');

    setIsProcessing(true);
    setImportStatus('idle');
    setStatusMessage('');
    setParsedResults([]);
    setShowParsedData(false);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach(file => {
      console.log(`Adding file: ${file.name}`);
      formData.append('files', file);
    });

    const xhr = new XMLHttpRequest();
    const url = `${apiUrl}/api/parse-cv`;
    xhr.open('POST', url, true);

    // Update progress as the file(s) are uploaded
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = function() {
      setIsProcessing(false);
      setUploadProgress(100);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data && data.results) {
            setParsedResults(data.results);
            setImportStatus('success');
            setShowParsedData(true);
            setStatusMessage('Resumes processed successfully!');
          } else {
            throw new Error('Invalid response format from server');
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          setImportStatus('error');
          setStatusMessage('Error parsing server response');
        }
      } else {
        console.error('Error response:', xhr.status, xhr.statusText, xhr.responseText);
        setImportStatus('error');
        setStatusMessage(`Server error: ${xhr.status} ${xhr.statusText}`);
      }
    };

    xhr.onerror = function() {
      console.error('Request error');
      setIsProcessing(false);
      setImportStatus('error');
      setStatusMessage('Network error - could not connect to server');
    };

    xhr.send(formData);
  };

  // -----------------------------
  // Process LinkedIn Profile - UPDATED
  // -----------------------------
  const processLinkedIn = async () => {
    if (!linkedInUrl) return;
    
    setIsProcessingLinkedIn(true);
    setImportStatus('idle'); 
    setStatusMessage('');
    setParsedLinkedIn(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/parse-linkedin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: linkedInUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        setImportStatus('error');
        setStatusMessage(data.error);
      } else {
        // Ensure cv_data structure exists even if empty
        if (!data.cv_data) {
          data.cv_data = {
            name: linkedInUrl.split('/in/')[1]?.split('/')[0]?.replace(/-/g, ' ') || '',
            email: [],
            phone: [],
            education: [],
            experience: [],
            skills: [],
            linkedin_url: linkedInUrl
          };
        }
        
        // Add the LinkedIn URL if it's not already there
        if (!data.cv_data.linkedin_url) {
          data.cv_data.linkedin_url = linkedInUrl;
        }
        
        // Ensure all required arrays exist
        data.cv_data.email = data.cv_data.email || [];
        data.cv_data.phone = data.cv_data.phone || [];
        data.cv_data.education = data.cv_data.education || [];
        data.cv_data.experience = data.cv_data.experience || [];
        data.cv_data.skills = data.cv_data.skills || [];
        
        // Set the parsed LinkedIn data
        setParsedLinkedIn(data);
        setImportStatus('success');
        setShowParsedData(true);
        
        // Show appropriate message based on how much data was found
        const hasDetailedData = data.cv_data.experience?.length > 0 || 
                               data.cv_data.education?.length > 0 || 
                               data.cv_data.skills?.length > 0;
                               
        if (hasDetailedData) {
          setStatusMessage('LinkedIn profile processed successfully!');
        } else {
          setStatusMessage('LinkedIn profile processed with limited data. For better results, try uploading a screenshot or PDF of the profile.');
        }
      }
    } catch (error) {
      console.error('Error processing LinkedIn profile:', error);
      setImportStatus('error');
      
      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('network')) {
          setStatusMessage('Network error: Cannot connect to the server. Please check your connection.');
        } else if (error.message.includes('LinkedIn restricts')) {
          setStatusMessage(error.message);
        } else {
          setStatusMessage(`Error: ${error.message}`);
        }
      } else {
        setStatusMessage('Failed to process LinkedIn profile');
      }
    } finally {
      setIsProcessingLinkedIn(false);
    }
  };

  // -----------------------------
  // Submit Feedback 
  // -----------------------------
  const handleFeedback = async (field: string, extractedData: any, isCorrect: boolean) => {
    setFeedbackInProgress(true);
    setFeedbackStatus(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field,
          extracted_data: extractedData,
          is_correct: isCorrect,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: FeedbackResponse = await response.json();
      console.log('Feedback submitted successfully:', data);
      
      // Show status message
      setFeedbackStatus({
        message: data.message,
        count: data.training_count
      });
      
      // Hide status after 3 seconds
      setTimeout(() => {
        setFeedbackStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setFeedbackInProgress(false);
    }
  };

  // -----------------------------
  // Train Model
  // -----------------------------
  const handleTrainModel = async () => {
    setIsTrainingModel(true);
    
    try {
      const response = await fetch(`${apiUrl}/api/train-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          epochs: 20,
          batch_size: 8
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Model training completed:', data);
      
      // Show status
      setImportStatus('success');
      setStatusMessage('Model trained successfully! Future validations will be more accurate.');
    } catch (error) {
      console.error('Error training model:', error);
      setImportStatus('error');
      setStatusMessage('Failed to train model. Please try again later.');
    } finally {
      setIsTrainingModel(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClearLinkedIn = () => {
    setLinkedInUrl('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
              Resume & LinkedIn Parser
            </span>
            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
              darkMode ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800/50' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}>AI Powered</span>
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Extract and validate candidate information from resumes and LinkedIn profiles with machine learning
          </p>
        </div>
        
        {/* AI Model Info */}
        <ModelInfoPanel 
          darkMode={darkMode} 
          onTrainModel={handleTrainModel}
          isTraining={isTrainingModel}
        />

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'resume' 
                ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600') 
                : (darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700')
            }`}
            onClick={() => setActiveTab('resume')}
          >
            <span className="flex items-center gap-2">
              <FileText size={16} />
              Resume Upload
            </span>
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'linkedin' 
                ? (darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600') 
                : (darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700')
            }`}
            onClick={() => setActiveTab('linkedin')}
          >
            <span className="flex items-center gap-2">
              <Linkedin size={16} />
              LinkedIn Profile
            </span>
          </button>
        </div>
        
        {/* Status Messages */}
        <StatusMessage 
          status={importStatus} 
          message={statusMessage} 
          darkMode={darkMode} 
          onClose={() => setImportStatus('idle')} 
        />
        
        {/* Feedback Status */}
        {feedbackStatus && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-200 border border-green-700/30' : 'bg-green-50 text-green-800 border border-green-200'}`}>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-green-500" />
              <p>{feedbackStatus.message}</p>
            </div>
          </div>
        )}
        
        {/* Resume Tab Content */}
        {activeTab === 'resume' && (
          <>
            {/* Dropzone */}
            <Dropzone 
              isDragging={isDragging}
              darkMode={darkMode}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.rtf"
              className="hidden"
            />
            
            {/* File List */}
            {files.length > 0 && (
              <FileList 
                files={files} 
                darkMode={darkMode} 
                getFileIcon={getFileIcon} 
                getFileSize={getFileSize} 
                removeFile={removeFile} 
              />
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mb-8">
              <button
                onClick={processCV}
                disabled={files.length === 0 || isProcessing}
                className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2
                  ${files.length === 0 
                    ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                    : (darkMode 
                       ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white' 
                       : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white')}
                  ${isProcessing ? 'opacity-90 cursor-wait' : 'shadow-lg hover:shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20'}
                `}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="animate-spin h-5 w-5" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} />
                    <span>Parse Resumes</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Scanning Status and Progress Bar */}
            {isProcessing && (
              <div className={`mt-4 mb-8 p-6 rounded-lg ${darkMode ? 'bg-gray-800/60' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <Cpu className="h-6 w-6 text-blue-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Analyzing Documents with AI</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      TensorFlow is extracting and validating resume data
                    </p>
                  </div>
                </div>
                <ProgressBar progress={uploadProgress} />
              </div>
            )}
          </>
        )}
        
        {/* LinkedIn Tab Content */}
        {activeTab === 'linkedin' && (
          <LinkedInInput
            darkMode={darkMode}
            linkedInUrl={linkedInUrl}
            setLinkedInUrl={setLinkedInUrl}
            isProcessing={isProcessingLinkedIn}
            onSubmit={processLinkedIn}
            onClear={handleClearLinkedIn}
          />
        )}
        
        {/* Parsed Data Display - Shows combined data from both sources */}
        {showParsedData && (parsedResults.length > 0 || parsedLinkedIn) && (
          <ParsedDataDisplay 
            parsedResults={parsedResults} 
            parsedLinkedIn={parsedLinkedIn}
            darkMode={darkMode} 
            onFeedback={handleFeedback}
            feedbackInProgress={feedbackInProgress}
          />
        )}
      </div>
    </div>
  );
};

export default Import;