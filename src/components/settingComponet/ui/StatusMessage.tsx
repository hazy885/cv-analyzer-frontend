import React from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader } from 'lucide-react';

interface StatusMessageProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'loading';
  darkMode: boolean;
  onDismiss: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type, darkMode, onDismiss }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      case 'loading':
        return <Loader size={20} className="animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return darkMode 
          ? 'bg-green-900/20 border border-green-700/30 text-green-200' 
          : 'bg-green-50 border border-green-200 text-green-800';
      case 'error':
        return darkMode 
          ? 'bg-red-900/20 border border-red-700/30 text-red-200' 
          : 'bg-red-50 border border-red-200 text-red-800';
      case 'info':
        return darkMode 
          ? 'bg-blue-900/20 border border-blue-700/30 text-blue-200' 
          : 'bg-blue-50 border border-blue-200 text-blue-800';
      case 'loading':
        return darkMode 
          ? 'bg-blue-900/20 border border-blue-700/30 text-blue-200' 
          : 'bg-blue-50 border border-blue-200 text-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between ${getStyles()}`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span>{message}</span>
      </div>
      {type !== 'loading' && (
        <button 
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-black/5"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default StatusMessage;