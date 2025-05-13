import React, { useState } from 'react';
import { useDarkMode } from '../components/ui/DarkModeContext';
import { useCVStore, ParsedCV } from '../store/useCVStore';
import LinkedInExtractor from '../components/import/LinkedInExtractor';
import FileUploader from '../components/import/FileUploader';
import TextExtractor from '../components/import/TextExtractor';
import CVDisplay from '../components/import/CVDisplay';
import { 
  Linkedin, FileText, Upload, AlertCircle, 
  RefreshCw, Check, X, ChevronRight, ChevronLeft,
  Save, Database
} from 'lucide-react';
import { cvApiService } from '../components/utils/apiUtils';

// Status Message Component
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
    <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between transition-all duration-300
      ${isSuccess 
        ? (darkMode ? 'bg-green-900/20 text-green-200 border border-green-700/20' : 'bg-green-50 text-green-800 border border-green-200') 
        : (darkMode ? 'bg-red-900/20 text-red-200 border border-red-700/20' : 'bg-red-50 text-red-800 border border-red-200')}`}>
      <span className="flex items-center gap-2">
        {isSuccess 
          ? <Check size={18} className="text-green-500" /> 
          : <AlertCircle size={18} className="text-red-500" />}
        {message}
      </span>
      <button 
        onClick={onClose} 
        className="text-current hover:bg-black/5 p-1 rounded-full transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};

// Method Selection Card
interface MethodCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
}

const MethodCard: React.FC<MethodCardProps> = ({ 
  title, 
  description, 
  icon, 
  active, 
  onClick, 
  darkMode 
}) => {
  return (
    <div 
      className={`p-6 rounded-3xl cursor-pointer transition-all duration-300
        ${active 
          ? (darkMode 
            ? 'bg-blue-900/10 border border-blue-500/30 shadow-lg' 
            : 'bg-white border border-blue-200 shadow-lg')
          : (darkMode 
            ? 'bg-gray-800/40 border border-gray-700 hover:bg-gray-800/60' 
            : 'bg-white border border-gray-200 hover:bg-white')
        }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-4 rounded-full ${
          active
            ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50')
            : (darkMode ? 'bg-gray-700' : 'bg-gray-50')
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-lg font-medium ${
            active ? (darkMode ? 'text-blue-400' : 'text-blue-600') : ''
          }`}>
            {title}
          </h3>
          <p className={`text-sm mt-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component: CV Extractor
const Import: React.FC = () => {
  const { darkMode } = useDarkMode();
  const { 
    parsedCVs, 
    currentCVIndex, 
    setCurrentCVIndex,
    isLoading
  } = useCVStore();
  
  const [importMethod, setImportMethod] = useState<'linkedin' | 'upload' | 'text'>('linkedin');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Handle import completion
  const handleImportComplete = (success: boolean, message: string) => {
    setImportStatus(success ? 'success' : 'error');
    setStatusMessage(message);
    
    // If successful, show the latest CV
    if (success) {
      setCurrentCVIndex(parsedCVs.length);
    }
  };
  
  // Navigate between parsed CVs
  const goToPreviousCV = () => {
    if (currentCVIndex !== null && currentCVIndex > 0) {
      setCurrentCVIndex(currentCVIndex - 1);
    }
  };
  
  const goToNextCV = () => {
    if (currentCVIndex !== null && currentCVIndex < parsedCVs.length - 1) {
      setCurrentCVIndex(currentCVIndex + 1);
    }
  };
  
  // Get current CV to display
  const currentCV: ParsedCV | null = 
    currentCVIndex !== null && parsedCVs[currentCVIndex] 
      ? parsedCVs[currentCVIndex] 
      : null;

  // Save CV to database
  const saveToDatabase = async () => {
    if (!currentCV) return;
    
    setIsSaving(true);
    
    try {
      const result = await cvApiService.saveCV(currentCV.cv_data);
      
      if (result.error) {
        setImportStatus('error');
        setStatusMessage(`Failed to save to database: ${result.error}`);
      } else {
        setImportStatus('success');
        setStatusMessage('CV saved to database successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      setImportStatus('error');
      setStatusMessage(`Failed to save to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-medium mb-3">
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
              CV Extractor
            </span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Extract professional information from LinkedIn profiles or CV documents with our AI-powered tools
          </p>
        </div>

        {/* Status Messages */}
        {importStatus !== 'idle' && (
          <div className="max-w-3xl mx-auto">
            <StatusMessage 
              status={importStatus} 
              message={statusMessage} 
              darkMode={darkMode} 
              onClose={() => setImportStatus('idle')} 
            />
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className={`max-w-3xl mx-auto mb-8 p-5 rounded-2xl flex items-center justify-center ${
            darkMode ? 'bg-blue-900/10 text-blue-200 border border-blue-800/20' : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <RefreshCw className="animate-spin h-5 w-5 mr-3" />
            <span className="font-medium">Processing your request...</span>
          </div>
        )}

        {/* Method Selection */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MethodCard 
              title="LinkedIn Profile" 
              description="Extract from a LinkedIn URL"
              icon={<Linkedin size={32} className={importMethod === 'linkedin' ? (darkMode ? 'text-blue-400' : 'text-blue-600') : darkMode ? 'text-gray-400' : 'text-gray-500'} />}
              active={importMethod === 'linkedin'}
              onClick={() => setImportMethod('linkedin')}
              darkMode={darkMode}
            />
            <MethodCard 
              title="Upload CV" 
              description="Upload PDF, DOCX, or other formats"
              icon={<Upload size={32} className={importMethod === 'upload' ? (darkMode ? 'text-blue-400' : 'text-blue-600') : darkMode ? 'text-gray-400' : 'text-gray-500'} />}
              active={importMethod === 'upload'}
              onClick={() => setImportMethod('upload')}
              darkMode={darkMode}
            />
            <MethodCard 
              title="Paste Text" 
              description="Paste CV text content"
              icon={<FileText size={32} className={importMethod === 'text' ? (darkMode ? 'text-blue-400' : 'text-blue-600') : darkMode ? 'text-gray-400' : 'text-gray-500'} />}
              active={importMethod === 'text'}
              onClick={() => setImportMethod('text')}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Input Methods */}
          <div>
            {/* Selected Method Component */}
            {importMethod === 'linkedin' && (
              <LinkedInExtractor onExtractComplete={handleImportComplete} />
            )}
            
            {importMethod === 'upload' && (
              <FileUploader onUploadComplete={handleImportComplete} />
            )}
            
            {importMethod === 'text' && (
              <TextExtractor onExtractComplete={handleImportComplete} />
            )}
          </div>
          
          {/* Right Column: CV Display */}
          <div>
            {/* CV Navigation */}
            {parsedCVs.length > 0 && (
              <div className={`flex items-center justify-between mb-6 p-4 rounded-2xl ${
                darkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={goToPreviousCV}
                  disabled={currentCVIndex === null || currentCVIndex <= 0}
                  className={`p-2 rounded-xl flex items-center gap-2 ${
                    currentCVIndex === null || currentCVIndex <= 0
                      ? (darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed')
                      : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>
                
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentCVIndex !== null && parsedCVs.length > 0 
                    ? `CV ${currentCVIndex + 1} of ${parsedCVs.length}` 
                    : 'No CVs'}
                </span>
                
                <button
                  onClick={goToNextCV}
                  disabled={currentCVIndex === null || currentCVIndex >= parsedCVs.length - 1}
                  className={`p-2 rounded-xl flex items-center gap-2 ${
                    currentCVIndex === null || currentCVIndex >= parsedCVs.length - 1
                      ? (darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed')
                      : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            
            {/* CV Display */}
            {currentCV ? (
              <>
                <div className="mb-6">
                  <button
                    onClick={saveToDatabase}
                    disabled={isSaving}
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                      ${isSaving 
                        ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                        : (darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                      }`}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="animate-spin h-5 w-5" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <Database size={18} />
                        <span>Save to Database</span>
                      </>
                    )}
                  </button>
                </div>
                <CVDisplay 
                  cvData={currentCV.cv_data} 
                  source={currentCV.source} 
                />
              </>
            ) : (
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg transition-all duration-300 text-center`}>
                <div className="py-16">
                  <div className="mb-6 flex justify-center">
                    <div className={`p-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <FileText size={48} className={`${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-medium mb-3">No CV Data Available</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto`}>
                    Use one of the methods on the left to extract CV information. 
                    The parsed data will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Import;