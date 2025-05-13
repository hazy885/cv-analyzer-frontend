import React, { ReactNode } from 'react';

interface SettingsHeaderProps {
  icon: ReactNode;
  title: string;
  darkMode: boolean;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ icon, title, darkMode }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-full ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        {React.cloneElement(icon as React.ReactElement, { 
          size: 24,
          className: darkMode ? 'text-blue-400' : 'text-blue-600'
        })}
      </div>
      <h2 className="text-xl font-medium">{title}</h2>
    </div>
  );
};

export default SettingsHeader;