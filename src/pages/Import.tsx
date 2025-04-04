import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../components/ui/DarkModeContext';
import { 
  X, Check, AlertCircle, Linkedin, LinkIcon, Info, RefreshCw,
  Briefcase, GraduationCap, Hash, Award, Globe, MessageCircle, 
  Mail, Phone, MapPin, Heart
} from 'lucide-react';

// Types
interface CVData {
  name?: string;
  headline?: string;
  location?: string;
  connections?: string;
  linkedin_url?: string;
  email?: string[];
  phone?: string[];
  skills?: string[];
  experience?: string[];
  education?: string[];
  certifications?: string[];
  languages?: string[];
  volunteering?: string[];
  recommendations?: string[];
}

interface ParsedLinkedIn {
  source: string;
  profile_url: string;
  cv_data: CVData;
  error?: string;
}

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
              Enter a LinkedIn profile URL to extract professional information.
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
              <Linkedin size={18} />
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
// Section Header Component
// -----------------------------
const SectionHeader = ({ 
  icon, 
  title, 
  darkMode 
}: { 
  icon: React.ReactNode; 
  title: string; 
  darkMode: boolean 
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div className={`p-1.5 rounded-md ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
      {icon}
    </div>
    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {title}
    </h3>
  </div>
);

// -----------------------------
// LinkedIn Profile Display Component
// -----------------------------
interface LinkedInProfileDisplayProps {
  profileData: CVData;
  darkMode: boolean;
}

const LinkedInProfileDisplay: React.FC<LinkedInProfileDisplayProps> = ({ 
  profileData, 
  darkMode
}) => {
  // Check if the profile has any contact information
  const hasContact = (profileData.email?.length ?? 0) > 0 || 
                     (profileData.phone?.length ?? 0) > 0 || 
                     !!profileData.location;
  
  // Check if profile has any data at all
  const isEmpty = !profileData.name && 
                 (!profileData.skills || profileData.skills.length === 0) && 
                 (!profileData.education || profileData.education.length === 0) && 
                 (!profileData.experience || profileData.experience.length === 0) &&
                 !profileData.headline;
  
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
            
            {(profileData.email?.length ?? 0) > 0 && (profileData.email ?? []).map((email, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mail size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{email}</span>
              </div>
            ))}
            
            {(profileData.phone?.length ?? 0) > 0 && (profileData.phone ?? []).map((phone, i) => (
              <div key={i} className="flex items-center gap-2">
                <Phone size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                <span>{phone}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Experience */}
      {(profileData.experience ?? []).length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Briefcase className="h-5 w-5 text-blue-500" />} 
            title="Experience" 
            darkMode={darkMode}
          />
          <div className="space-y-4">
            {(profileData.experience ?? []).map((exp, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
              >
                {exp}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education */}
      {(profileData.education ?? []).length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
            title="Education" 
            darkMode={darkMode}
          />
          <div className="space-y-4">
            {(profileData.education ?? []).map((edu, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
              >
                {edu}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {(profileData.skills ?? []).length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Hash className="h-5 w-5 text-blue-500" />}
            title="Skills" 
            darkMode={darkMode}
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className="flex flex-wrap gap-2">
              {(profileData.skills ?? []).map((skill, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-sm 
                  ${darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Certifications */}
      {(profileData.certifications?.length ?? 0) > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Award className="h-5 w-5 text-blue-500" />}
            title="Certifications" 
            darkMode={darkMode}
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <ul className="space-y-2">
              {(profileData.certifications ?? []).map((cert, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Languages */}
      {(profileData.languages?.length ?? 0) > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Globe className="h-5 w-5 text-blue-500" />}
            title="Languages" 
            darkMode={darkMode}
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <div className="flex flex-wrap gap-2">
              {profileData.languages?.map((lang, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-sm 
                  ${darkMode ? 'bg-indigo-900/20 text-indigo-300 border border-indigo-800/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Volunteering */}
      {profileData.volunteering && profileData.volunteering.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<Heart className="h-5 w-5 text-blue-500" />}
            title="Volunteering" 
            darkMode={darkMode}
          />
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
            <ul className="space-y-2">
              {profileData.volunteering?.map((vol, i) => (
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
      {profileData.recommendations && profileData.recommendations.length > 0 && (
        <div className="mb-6">
          <SectionHeader 
            icon={<MessageCircle className="h-5 w-5 text-blue-500" />}
            title="Recommendations" 
            darkMode={darkMode}
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
// Main Component: LinkedIn Parser
// -----------------------------
const Import: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [linkedInUrl, setLinkedInUrl] = useState<string>('');
  const [isProcessingLinkedIn, setIsProcessingLinkedIn] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [parsedLinkedIn, setParsedLinkedIn] = useState<ParsedLinkedIn | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

 // In your frontend code
useEffect(() => {
  // Make sure this matches your backend exactly
  let backendUrl = 'http://localhost:8888';
  
  // Debug the URL
  console.log(`Using backend URL: ${backendUrl}`);
  setApiUrl(backendUrl);
}, []);

  // Process LinkedIn Profile 
  const processLinkedIn = async () => {
    if (!linkedInUrl) return;
    
    // Hardcode the correct URL for testing
    const correctApiUrl = 'http://localhost:8888';
    console.log('Using API URL:', correctApiUrl);
    
    setIsProcessingLinkedIn(true);
    setImportStatus('idle'); 
    setStatusMessage('');
    setParsedLinkedIn(null);
    
    try {
      const response = await fetch(`${correctApiUrl}/api/linkedin/parse-linkedin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url: linkedInUrl })
      });
    
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers]));
          
      const data = await response.json();
      console.log('Response data:', data);
  
      setIsProcessingLinkedIn(false);
      
      if (response.ok) {
        // Ensure cv_data exists and has required fields
        const cvData = data.cv_data || {};
        cvData.email = cvData.email || [];
        cvData.phone = cvData.phone || [];
        cvData.skills = cvData.skills || [];
        cvData.experience = cvData.experience || [];
        cvData.education = cvData.education || [];
        cvData.linkedin_url = cvData.linkedin_url || linkedInUrl;
  
        setParsedLinkedIn({
          source: data.source || 'linkedin_url',
          profile_url: data.profile_url || linkedInUrl,
          cv_data: cvData,
          error: data.error
        });
  
        setImportStatus('success');
        setStatusMessage('LinkedIn profile processed successfully!');
      } else {
        setImportStatus('error');
        setStatusMessage(data.error || 'Failed to process LinkedIn profile');
      }
    } catch (error) {
      console.error('Error processing LinkedIn URL:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setIsProcessingLinkedIn(false);
      setImportStatus('error');
      setStatusMessage('Network error or invalid response');
    }
  };

  
  // Clear LinkedIn URL
  const handleClearLinkedIn = () => {
    setLinkedInUrl('');
    setParsedLinkedIn(null);
    setImportStatus('idle');
    setStatusMessage('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
              LinkedIn Profile Parser
            </span>
            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
              darkMode ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800/50' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}>AI Powered</span>
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Extract professional information from LinkedIn profiles
          </p>
        </div>

        {/* Status Messages */}
        <StatusMessage 
          status={importStatus} 
          message={statusMessage} 
          darkMode={darkMode} 
          onClose={() => setImportStatus('idle')} 
        />

        {/* LinkedIn Input */}
        <LinkedInInput
          darkMode={darkMode}
          linkedInUrl={linkedInUrl}
          setLinkedInUrl={setLinkedInUrl}
          isProcessing={isProcessingLinkedIn}
          onSubmit={processLinkedIn}
          onClear={handleClearLinkedIn}
        />

        {/* Parsed LinkedIn Profile */}
        {parsedLinkedIn && parsedLinkedIn.cv_data && (
          <LinkedInProfileDisplay 
            profileData={parsedLinkedIn.cv_data}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default Import;