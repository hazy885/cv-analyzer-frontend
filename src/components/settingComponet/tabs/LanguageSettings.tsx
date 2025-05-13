import React from 'react';
import { Globe, Clock, Calendar } from 'lucide-react';
import SettingsHeader from '../ui/SettingsHeader';
import { LanguageSettings as LanguageSettingsType } from '../types/settings';

interface LanguageSettingsProps {
  languageSettings: LanguageSettingsType;
  updateLanguageSettings: (settings: Partial<LanguageSettingsType>) => void;
  darkMode: boolean;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  languageSettings,
  updateLanguageSettings,
  darkMode
}) => {
  // Available languages
  const languages = [
    { code: 'english', name: 'English (US)' },
    { code: 'spanish', name: 'Spanish (Español)' },
    { code: 'french', name: 'French (Français)' },
    { code: 'german', name: 'German (Deutsch)' },
    { code: 'chinese', name: 'Chinese (中文)' },
    { code: 'japanese', name: 'Japanese (日本語)' },
    { code: 'portuguese', name: 'Portuguese (Português)' },
    { code: 'russian', name: 'Russian (Русский)' },
  ];

  // Available timezones
  const timezones = [
    'Pacific Time (UTC-08:00)',
    'Mountain Time (UTC-07:00)',
    'Central Time (UTC-06:00)',
    'Eastern Time (UTC-05:00)',
    'Atlantic Time (UTC-04:00)',
    'GMT (UTC+00:00)',
    'Central European Time (UTC+01:00)',
    'Eastern European Time (UTC+02:00)',
    'India Standard Time (UTC+05:30)',
    'China Standard Time (UTC+08:00)',
    'Japan Standard Time (UTC+09:00)',
    'Australian Eastern Time (UTC+10:00)',
  ];

  // Date formats
  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (31.12.2023)' },
  ];

  // First day of week options
  const weekStartOptions = [
    { value: 'sunday', label: 'Sunday' },
    { value: 'monday', label: 'Monday' },
    { value: 'saturday', label: 'Saturday' },
  ];

  return (
    <div>
      <SettingsHeader 
        icon={<Globe />} 
        title="Language & Region" 
        darkMode={darkMode} 
      />
      
      <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-gray-700/30 border border-gray-600' : 'bg-white border border-gray-200'}`}>
        <h3 className="font-medium mb-4">Language</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="language" className="block mb-2 text-sm font-medium">
              Display Language
            </label>
            <select
              id="language"
              value={languageSettings.language}
              onChange={(e) => updateLanguageSettings({ language: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This will change the language across the entire application
            </p>
          </div>
          
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-blue-900/10 border border-blue-800/30' : 'bg-blue-50 border border-blue-100'}`}>
            <div className="flex items-start gap-3">
              <Globe className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
              <div>
                <h4 className="font-medium">Translation Support</h4>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our application supports 8 languages with automatic translation for candidate profiles and resumes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-gray-700/30 border border-gray-600' : 'bg-white border border-gray-200'}`}>
        <h3 className="font-medium mb-4">Region & Time</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="timezone" className="block mb-2 text-sm font-medium">
              Timezone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <select
                id="timezone"
                value={languageSettings.timezone}
                onChange={(e) => updateLanguageSettings({ timezone: e.target.value })}
                className={`w-full pl-10 p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                {timezones.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="dateFormat" className="block mb-2 text-sm font-medium">
              Date Format
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <select
                id="dateFormat"
                value={languageSettings.dateFormat}
                onChange={(e) => updateLanguageSettings({ dateFormat: e.target.value })}
                className={`w-full pl-10 p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                {dateFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700/30 border border-gray-600' : 'bg-white border border-gray-200'}`}>
        <h3 className="font-medium mb-4">Calendar Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstDayOfWeek" className="block mb-2 text-sm font-medium">
              First Day of Week
            </label>
            <select
              id="firstDayOfWeek"
              value={languageSettings.firstDayOfWeek}
              onChange={(e) => updateLanguageSettings({ firstDayOfWeek: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              {weekStartOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This affects how calendars and weekly views are displayed
            </p>
          </div>
          
          <div className={`flex items-center justify-center ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="grid grid-cols-7 gap-1 w-full max-w-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div 
                  key={index} 
                  className={`text-center py-1 text-sm font-medium ${
                    (languageSettings.firstDayOfWeek === 'sunday' && index === 0) ||
                    (languageSettings.firstDayOfWeek === 'monday' && index === 1) ||
                    (languageSettings.firstDayOfWeek === 'saturday' && index === 6)
                      ? darkMode ? 'text-blue-400' : 'text-blue-600'
                      : ''
                  }`}
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 28 }).map((_, index) => (
                <div 
                  key={`day-${index}`} 
                  className={`text-center py-1 text-sm rounded-md ${
                    index === 15
                      ? darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                      : darkMode ? 'bg-gray-700/50' : 'bg-white'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;