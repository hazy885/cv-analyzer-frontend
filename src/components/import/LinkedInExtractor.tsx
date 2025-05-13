import React, { useState } from 'react';
import { useDarkMode } from '../ui/DarkModeContext';
import { useCVStore } from '../../store/useCVStore';
import { cvApiService } from '../utils/apiUtils';
import { 
  X, Check, AlertCircle, Linkedin, LinkIcon, Info, RefreshCw
} from 'lucide-react';

interface LinkedInExtractorProps {
  onExtractComplete?: (success: boolean, message: string) => void;
}

const LinkedInExtractor: React.FC<LinkedInExtractorProps> = ({ onExtractComplete }) => {
  const { darkMode } = useDarkMode();
  const { addParsedCV, setIsLoading } = useCVStore();
  
  const [linkedInUrl, setLinkedInUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  // Validate LinkedIn URL
  const isValidUrl = linkedInUrl.trim() !== '' && 
    (linkedInUrl.includes('linkedin.com/in/') || 
     linkedInUrl.includes('linkedin.com/profile/'));

  // Process LinkedIn Profile 
  const processLinkedIn = async () => {
    if (!linkedInUrl || !isValidUrl) return;
    
    setIsProcessing(true);
    setIsLoading(true);
    setStatus({ status: 'idle', message: '' });
    
    try {
      const result = await cvApiService.parseLinkedIn(linkedInUrl);
      
      if (result.error) {
        setStatus({
          status: 'error',
          message: `Processing failed: ${result.error}`
        });
        if (onExtractComplete) onExtractComplete(false, `Processing failed: ${result.error}`);
      } else if (result.data) {
        // Add parsed CV data to store
        addParsedCV(result.data);
        
        setStatus({
          status: 'success',
          message: 'LinkedIn profile processed successfully!'
        });
        if (onExtractComplete) onExtractComplete(true, 'LinkedIn profile processed successfully!');
      }
    } catch (error) {
      console.error('Processing error:', error);
      setStatus({
        status: 'error',
        message: `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      if (onExtractComplete) onExtractComplete(false, `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  // Clear LinkedIn URL
  const clearLinkedIn = () => {
    setLinkedInUrl('');
    setStatus({ status: 'idle', message: '' });
  };

  return (
    <div className={`p-8 rounded-3xl transition-all duration-300 shadow-lg backdrop-blur-sm
      ${darkMode ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
      
      {/* Header */}
      <div className="flex items-center mb-6 gap-3">
        <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <Linkedin size={28} className={darkMode ? "text-blue-400" : "text-blue-600"} />
        </div>
        <h3 className="text-2xl font-medium">LinkedIn Profile Parser</h3>
      </div>
      
      {/* Info box */}
      <div className={`mb-6 p-5 rounded-2xl ${darkMode ? 'bg-blue-900/10 text-blue-200 border border-blue-800/20' : 'bg-blue-50/80 text-blue-800 border border-blue-200/30'}`}>
        <div className="flex items-start gap-3">
          <Info size={20} className="mt-0.5" />
          <div>
            <p className="text-sm">
              Enter a LinkedIn profile URL to extract professional information. Our AI will analyze the profile and extract key details.
            </p>
          </div>
        </div>
      </div>
      
      {/* Status message */}
      {status.status !== 'idle' && (
        <div className={`mb-6 p-5 rounded-2xl flex items-center justify-between transition-all duration-300 transform
          ${status.status === 'success' 
            ? (darkMode ? 'bg-green-900/20 text-green-200 border border-green-700/20' : 'bg-green-50/80 text-green-800 border border-green-200/30') 
            : (darkMode ? 'bg-red-900/20 text-red-200 border border-red-700/20' : 'bg-red-50/80 text-red-800 border border-red-200/30')}`}>
          <span className="flex items-center gap-2">
            {status.status === 'success' 
              ? <Check size={18} className="text-green-500" /> 
              : <AlertCircle size={18} className="text-red-500" />}
            {status.message}
          </span>
          <button 
            onClick={() => setStatus({ status: 'idle', message: '' })} 
            className="text-current hover:bg-black/5 p-1 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* LinkedIn URL input */}
      <div className="flex flex-col gap-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <LinkIcon size={20} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            className={`w-full pl-12 pr-12 py-4 rounded-xl transition-colors border text-lg ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' 
                : 'bg-gray-50/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="https://www.linkedin.com/in/username"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            disabled={isProcessing}
          />
          {linkedInUrl && (
            <button
              type="button"
              onClick={clearLinkedIn}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              <X 
                size={20} 
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`} 
              />
            </button>
          )}
        </div>
        
        <button
          type="button"
          onClick={processLinkedIn}
          disabled={!isValidUrl || isProcessing}
          className={`w-full px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium
            ${isValidUrl && !isProcessing 
              ? (darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg') 
              : (darkMode 
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed')}
          `}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="animate-spin h-5 w-5" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Linkedin size={20} />
              <span>Parse LinkedIn Profile</span>
            </>
          )}
        </button>
      </div>
      
      {linkedInUrl && !isValidUrl && (
        <p className={`mt-4 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} flex items-center gap-2`}>
          <AlertCircle size={16} />
          Please enter a valid LinkedIn profile URL
        </p>
      )}
    </div>
  );
};

export default LinkedInExtractor;