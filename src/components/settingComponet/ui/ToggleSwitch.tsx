import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  darkMode: boolean;
  id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  darkMode,
  id
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <label htmlFor={id} className="font-medium cursor-pointer">
          {label}
        </label>
        {description && (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          checked 
            ? (darkMode ? 'bg-blue-600 focus:ring-blue-500' : 'bg-blue-600 focus:ring-blue-500') 
            : (darkMode ? 'bg-gray-600 focus:ring-gray-500' : 'bg-gray-300 focus:ring-gray-400')
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;