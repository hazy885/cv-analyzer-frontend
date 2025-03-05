// src/components/settings/ui/StatusMessage.tsx
import React from 'react';
import { Check, X, Zap, AlertCircle } from 'lucide-react';

type MessageType = 'success' | 'loading' | 'error' | 'info';

interface StatusMessageProps {
  message: string;
  type: MessageType;
  darkMode: boolean;
  onDismiss: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ 
  message, 
  type, 
  darkMode, 
  onDismiss 
}) => {
  if (!message) return null;
  
  let config: { bgClass: string; textClass: string; icon: JSX.Element } = {
    bgClass: '',
    textClass: '',
    icon: <></>
  };
  
  switch (type) {
    case 'success':
      config = {
        bgClass: darkMode ? 'bg-green-900/30' : 'bg-green-50',
        textClass: darkMode ? 'text-green-200' : 'text-green-800',
        icon: <Check size={18} className={darkMode ? 'text-green-400' : 'text-green-500'} />
      };
      break;
      
    case 'loading':
      config = {
        bgClass: darkMode ? 'bg-blue-900/30' : 'bg-blue-50',
        textClass: darkMode ? 'text-blue-200' : 'text-blue-800',
        icon: <Zap size={18} className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} animate-pulse-slow`} />
      };
      break;
      
    case 'error':
      config = {
        bgClass: darkMode ? 'bg-red-900/30' : 'bg-red-50',
        textClass: darkMode ? 'text-red-200' : 'text-red-800',
        icon: <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-500'} />
      };
      break;
      
    case 'info':
      config = {
        bgClass: darkMode ? 'bg-gray-800' : 'bg-gray-100',
        textClass: darkMode ? 'text-gray-200' : 'text-gray-800',
        icon: <AlertCircle size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
      };
      break;
  }
  
  return (
    <div className={`mb-6 p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${config.bgClass} ${config.textClass}`}>
      <span className="flex items-center gap-2">
        {config.icon}
        {message}
      </span>
      <button 
        onClick={onDismiss} 
        className="text-current hover:bg-black/10 p-1 rounded-full transition-colors"
        aria-label="Dismiss message"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default StatusMessage;