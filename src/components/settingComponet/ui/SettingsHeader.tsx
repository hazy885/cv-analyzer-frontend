// src/components/settings/ui/SettingsHeader.tsx
import React from 'react';

interface SettingsHeaderProps {
  icon: React.ReactNode;
  title: string;
  darkMode: boolean;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ icon, title, darkMode }) => {
  return (
    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
      {React.cloneElement(icon as React.ReactElement, { 
        size: 20, 
        className: "text-blue-500" 
      })}
      <span>{title}</span>
    </h2>
  );
};

export default SettingsHeader;