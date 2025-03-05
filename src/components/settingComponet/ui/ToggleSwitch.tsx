// src/components/settings/ui/ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  description?: string;
  darkMode: boolean;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  description,
  darkMode,
  id
}) => {
  // Generate a random ID if one isn't provided
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="flex items-center justify-between py-3">
      {(label || description) && (
        <div>
          {label && (
            <label htmlFor={toggleId} className="font-medium cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
        </div>
      )}
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={toggleId}
          className="sr-only peer" 
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-11 h-6 rounded-full peer ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        } peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 transition-all duration-200`}></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;