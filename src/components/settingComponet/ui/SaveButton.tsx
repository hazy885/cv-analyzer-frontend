// src/components/settings/ui/SaveButton.tsx
import React from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  darkMode: boolean;
  hasChanges?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  disabled = false,
  darkMode,
  hasChanges = false
}) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <div>
        {hasChanges && (
          <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
            You have unsaved changes
          </p>
        )}
      </div>
      
      <div className="flex gap-3">
        <button 
          className={`px-4 py-2.5 rounded-lg transition-all duration-200 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Cancel
        </button>
        
        <button 
          onClick={onClick}
          className={`flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 px-5 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 ${
            disabled ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={disabled}
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SaveButton;