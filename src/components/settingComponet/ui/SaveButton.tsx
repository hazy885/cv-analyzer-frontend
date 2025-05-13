import React from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  disabled: boolean;
  darkMode: boolean;
  hasChanges: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, disabled, darkMode, hasChanges }) => {
  return (
    <div className={`fixed bottom-8 right-8 z-10 transition-all duration-300 transform ${
      hasChanges ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
    }`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
          disabled
            ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')
            : (darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white')
        }`}
      >
        <Save size={18} />
        <span className="font-medium">Save Changes</span>
      </button>
    </div>
  );
};

export default SaveButton;