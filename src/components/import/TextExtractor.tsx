import React, { useState } from 'react';
import { useDarkMode } from '../ui/DarkModeContext';
import { useCVStore } from '../../store/useCVStore';
import { cvApiService } from '../utils/apiUtils';
import { 
  FileText, X, Check, AlertCircle, RefreshCw, 
  ClipboardCopy, ClipboardCheck
} from 'lucide-react';

interface TextExtractorProps {
  onExtractComplete?: (success: boolean, message: string) => void;
}

const TextExtractor: React.FC<TextExtractorProps> = ({ onExtractComplete }) => {
  const { darkMode } = useDarkMode();
  const { addParsedCV, setIsLoading } = useCVStore();
  
  const [cvText, setCvText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
  const [copied, setCopied] = useState<boolean>(false);

  // Process the CV text
  const processText = async () => {
    if (!cvText.trim()) {
      setStatus({
        status: 'error',
        message: 'Please enter CV text to process'
      });
      return;
    }
    
    setIsProcessing(true);
    setIsLoading(true);
    setStatus({ status: 'idle', message: '' });
    
    try {
      const result = await cvApiService.parseText(cvText);
      
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
          message: 'CV text processed successfully!'
        });
        if (onExtractComplete) onExtractComplete(true, 'CV text processed successfully!');
        
        // Clear text after successful processing
        setCvText('');
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

  // Clear the text area
  const clearText = () => {
    setCvText('');
    setStatus({ status: 'idle', message: '' });
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cvText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Paste from clipboard
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCvText(text);
    } catch (err) {
      console.error('Failed to paste text: ', err);
      setStatus({
        status: 'error',
        message: 'Failed to paste from clipboard. Please check browser permissions.'
      });
    }
  };

  return (
    <div className={`p-8 rounded-3xl transition-all duration-300 shadow-lg backdrop-blur-sm
      ${darkMode ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
      
      {/* Header */}
      <div className="flex items-center mb-6 gap-3">
        <div className={`p-3 rounded-full ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
          <FileText size={28} className={darkMode ? "text-emerald-400" : "text-emerald-600"} />
        </div>
        <h3 className="text-2xl font-medium">CV Text Extractor</h3>
      </div>
      
      {/* Info box */}
      <div className={`mb-6 p-5 rounded-2xl ${darkMode ? 'bg-emerald-900/10 text-emerald-200 border border-emerald-800/20' : 'bg-emerald-50/80 text-emerald-800 border border-emerald-200/30'}`}>
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5" />
          <div>
            <p className="text-sm">
              Paste CV text content for automatic parsing. Our AI will extract key information.
            </p>
          </div>
        </div>
      </div>
      
      {/* Status message */}
      {status.status !== 'idle' && (
        <div className={`mb-6 p-5 rounded-2xl flex items-center justify-between transition-all duration-300 transform 
          ${status.status === 'success' 
            ? (darkMode ? 'bg-green-900/30 text-green-200 border border-green-700/30' : 'bg-green-50 text-green-800 border border-green-200') 
            : (darkMode ? 'bg-red-900/30 text-red-200 border border-red-700/30' : 'bg-red-50 text-red-800 border border-red-200')}`}>
          <span className="flex items-center gap-2">
            {status.status === 'success' 
              ? <Check size={18} className="text-green-500" /> 
              : <AlertCircle size={18} className="text-red-500" />}
            {status.message}
          </span>
          <button 
            onClick={() => setStatus({ status: 'idle', message: '' })} 
            className="text-current hover:bg-black/10 p-1 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Text area with toolbar */}
      <div className="mb-6">
        <div className={`flex items-center justify-between p-2 rounded-t-lg border-b
          ${darkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={pasteFromClipboard}
              className={`p-1.5 rounded text-sm flex items-center gap-1
                ${darkMode 
                  ? 'hover:bg-gray-600 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-700'}`}
            >
              <ClipboardCheck size={16} />
              <span>Paste</span>
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!cvText.trim()}
              className={`p-1.5 rounded text-sm flex items-center gap-1
                ${!cvText.trim() 
                  ? (darkMode ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                  : (darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-700')}`}
            >
              {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={clearText}
            disabled={!cvText.trim()}
            className={`p-1.5 rounded text-sm
              ${!cvText.trim() 
                ? (darkMode ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                : (darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-700')}`}
          >
            Clear
          </button>
        </div>
        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste CV text content here..."
          rows={10}
          className={`w-full p-4 rounded-b-lg transition-colors
            ${darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500'}`}
        />
      </div>
      
      {/* Process button */}
      <button
        type="button"
        onClick={processText}
        disabled={!cvText.trim() || isProcessing}
        className={`w-full px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2
          ${cvText.trim() && !isProcessing 
            ? (darkMode 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg') 
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
            <FileText size={18} />
            <span>Process CV Text</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TextExtractor;