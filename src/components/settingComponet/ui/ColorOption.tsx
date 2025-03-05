// src/components/settings/ui/ColorOption.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface ColorOptionProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  darkMode: boolean;
}

const ColorOption: React.FC<ColorOptionProps> = ({ 
  color, 
  isSelected, 
  onClick, 
  darkMode 
}) => {
  // Color mapping for different themes
  const colorMap: Record<string, { light: string, dark: string }> = {
    'blue': { light: '#3b82f6', dark: '#1e3a8a' },
    'purple': { light: '#8b5cf6', dark: '#581c87' },
    'green': { light: '#22c55e', dark: '#14532d' },
    'orange': { light: '#f97316', dark: '#7c2d12' },
    'red': { light: '#ef4444', dark: '#7f1d1d' },
    'teal': { light: '#14b8a6', dark: '#134e4a' },
    'gray': { light: '#6b7280', dark: '#1f2937' },
  };
  
  const bgColor = darkMode ? colorMap[color]?.dark : colorMap[color]?.light;
  
  return (
    <button 
      onClick={onClick}
      className={`relative h-12 rounded-lg transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800'
          : ''
      }`}
      style={{ backgroundColor: bgColor }}
      aria-pressed={isSelected}
      aria-label={`${color} color theme`}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="text-white h-5 w-5" />
        </div>
      )}
    </button>
  );
};

export default ColorOption;