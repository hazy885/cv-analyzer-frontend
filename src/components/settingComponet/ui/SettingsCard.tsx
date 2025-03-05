// src/components/settings/ui/SettingsCard.tsx
import React from 'react';

interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
  darkMode: boolean;
  border?: boolean;
  danger?: boolean;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ 
  children, 
  className = '', 
  darkMode,
  border = false,
  danger = false
}) => {
  let cardClass = '';
  
  if (danger) {
    cardClass = border 
      ? `${darkMode ? 'border border-red-900/30' : 'border border-red-200'}`
      : `${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`;
  } else {
    cardClass = border 
      ? `${darkMode ? 'border border-gray-700' : 'border border-gray-200'}`
      : `${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`;
  }
  
  return (
    <div className={`p-4 rounded-lg ${cardClass} ${className}`}>
      {children}
    </div>
  );
};

export default SettingsCard;