import React, { useState, useRef } from 'react';
import { useDarkMode } from '../ui/DarkModeContext';
import { useCVStore } from '../../store/useCVStore';
import { cvApiService } from '../utils/apiUtils';
import { Upload, File, X, AlertCircle, Check, FileText, RefreshCw } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete?: (success: boolean, message: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const { darkMode } = useDarkMode();
  const { setUploadedCVs, addParsedCV, setIsLoading } = useCVStore();
  
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Process the selected files
  const handleFiles = (selectedFiles: File[]) => {
    // Filter for PDF, DOCX, DOC, RTF, TXT files
    const validFiles = selectedFiles.filter(file => {
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      return fileType.includes('pdf') || 
             fileType.includes('word') || 
             fileType.includes('rtf') || 
             fileType.includes('text/plain') ||
             fileName.endsWith('.pdf') ||
             fileName.endsWith('.docx') ||
             fileName.endsWith('.doc') ||
             fileName.endsWith('.rtf') ||
             fileName.endsWith('.txt');
    });
    
    if (validFiles.length === 0) {
      setUploadStatus({
        status: 'error',
        message: 'Please select valid CV files (PDF, DOCX, DOC, RTF, TXT)'
      });
      return;
    }
    
    setFiles(validFiles);
    setUploadStatus({ status: 'idle', message: '' });
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Clear all files
  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload files to the server
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setIsLoading(true);
    
    try {
      const result = await cvApiService.uploadCV(files, (progress) => {
        setUploadProgress(progress);
      });
      
      if (result.error) {
        setUploadStatus({
          status: 'error',
          message: `Upload failed: ${result.error}`
        });
        if (onUploadComplete) onUploadComplete(false, `Upload failed: ${result.error}`);
      } else {
        // Store the uploaded files
        setUploadedCVs(files);
        
        // Add parsed CV data to store
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach(cv => {
            addParsedCV(cv);
          });
        } else if (result.data) {
          addParsedCV(result.data);
        }
        
        setUploadStatus({
          status: 'success',
          message: 'Files uploaded and processed successfully!'
        });
        if (onUploadComplete) onUploadComplete(true, 'Files uploaded and processed successfully!');
        
        // Clear files after successful upload
        clearFiles();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        status: 'error',
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      if (onUploadComplete) onUploadComplete(false, `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`p-8 rounded-3xl transition-all duration-300 shadow-lg backdrop-blur-sm
      ${darkMode ? 'bg-gray-800/40 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'}`}>
      
      {/* Header */}
      <div className="flex items-center mb-6 gap-3">
        <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
          <FileText size={28} className={darkMode ? "text-purple-400" : "text-purple-600"} />
        </div>
        <h3 className="text-2xl font-medium">CV File Upload</h3>
      </div>
      
      {/* Info box */}
      <div className={`mb-6 p-5 rounded-2xl ${darkMode ? 'bg-purple-900/10 text-purple-200 border border-purple-800/20' : 'bg-purple-50/80 text-purple-800 border border-purple-200/30'}`}>
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5" />
          <div>
            <p className="text-sm">
              Upload CV files for automatic parsing. Supported formats: PDF, DOCX, DOC, RTF, TXT.
            </p>
          </div>
        </div>
      </div>
      
      {/* Status message */}
      {uploadStatus.status !== 'idle' && (
        <div className={`mb-6 p-5 rounded-2xl flex items-center justify-between transition-all duration-300 transform
          ${uploadStatus.status === 'success' 
            ? (darkMode ? 'bg-green-900/20 text-green-200 border border-green-700/20' : 'bg-green-50/80 text-green-800 border border-green-200/30') 
            : (darkMode ? 'bg-red-900/20 text-red-200 border border-red-700/20' : 'bg-red-50/80 text-red-800 border border-red-200/30')}`}>
          <span className="flex items-center gap-2">
            {uploadStatus.status === 'success' 
              ? <Check size={18} className="text-green-500" /> 
              : <AlertCircle size={18} className="text-red-500" />}
            {uploadStatus.message}
          </span>
          <button 
            onClick={() => setUploadStatus({ status: 'idle', message: '' })} 
            className="text-current hover:bg-black/5 p-1 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* File drop zone */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 mb-6 text-center transition-all duration-200
          ${dragActive 
            ? (darkMode ? 'border-purple-500 bg-purple-900/10' : 'border-purple-500 bg-purple-50/50') 
            : (darkMode ? 'border-gray-600 hover:border-purple-500' : 'border-gray-300 hover:border-purple-500')}
          ${files.length > 0 ? 'pb-4' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.rtf,.txt"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          <Upload 
            size={40} 
            className={`mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} 
          />
          <p className="mb-2 text-lg font-medium">
            Drag & drop CV files here
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            or click to select files
          </p>
          <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Supported formats: PDF, DOCX, DOC, RTF, TXT
          </p>
        </div>
        
        {/* File list */}
        {files.length > 0 && (
          <div className={`mt-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Selected Files ({files.length})</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFiles();
                }}
                className={`text-sm px-3 py-1 rounded-lg ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700/50' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 text-left" onClick={(e) => e.stopPropagation()}>
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    darkMode ? 'bg-gray-700/30' : 'bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <File size={16} />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs opacity-70">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className={`p-1 rounded-full ${
                      darkMode 
                        ? 'hover:bg-gray-600/50' 
                        : 'hover:bg-gray-200/70'
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Upload progress */}
      {isUploading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Upload button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          uploadFiles();
        }}
        disabled={files.length === 0 || isUploading}
        className={`w-full px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium
          ${files.length > 0 && !isUploading 
            ? (darkMode 
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg') 
            : (darkMode 
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed')}
        `}
      >
        {isUploading ? (
          <>
            <RefreshCw className="animate-spin h-5 w-5" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload size={20} />
            <span>Upload and Process CV{files.length > 1 ? 's' : ''}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FileUploader;