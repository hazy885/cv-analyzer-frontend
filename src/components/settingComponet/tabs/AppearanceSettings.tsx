// src/components/settings/tabs/AppearanceSettings.tsx
import React from 'react';
import { Eye, Sun, Moon, Monitor, CloudOff } from 'lucide-react';
import SettingsHeader from '../ui/SettingsHeader';
import SettingsCard from '../ui/SettingsCard';
import ToggleSwitch from '../ui/ToggleSwitch';
import ColorOption from '../ui/ColorOption';
import { DisplaySettings } from '../types/settings';

interface AppearanceSettingsProps {
  displaySettings: DisplaySettings;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  handleThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  darkMode: boolean;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  displaySettings,
  updateDisplaySettings,
  handleThemeChange,
  darkMode
}) => {
  const colorOptions = ['blue', 'purple', 'green', 'orange', 'red', 'teal', 'gray'];
  
  return (
    <div className="animate-fadeIn">
      <SettingsHeader 
        icon={<Eye />} 
        title="Appearance & Display" 
        darkMode={darkMode} 
      />
      
      <div className="space-y-8">
        {/* Theme */}
        <div>
          <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={() => handleThemeChange('light')}
              className={`p-6 rounded-xl flex flex-col items-center gap-4 transition-all duration-200 ${
                displaySettings.theme === 'light' 
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 ring-2 ring-blue-500 shadow-md shadow-blue-500/20' 
                  : darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <div className={`p-3 rounded-full ${
                displaySettings.theme === 'light' ? 'bg-white shadow-inner' : darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Sun size={24} className={displaySettings.theme === 'light' ? "text-blue-500" : ""} />
              </div>
              <span className="font-medium">Light</span>
            </button>
            
            <button 
              onClick={() => handleThemeChange('dark')}
              className={`p-6 rounded-xl flex flex-col items-center gap-4 transition-all duration-200 ${
                displaySettings.theme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-900/50 to-blue-800/40 text-blue-300 ring-2 ring-blue-500 shadow-md shadow-blue-500/10' 
                  : darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <div className={`p-3 rounded-full ${
                displaySettings.theme === 'dark' ? 'bg-gray-800 shadow-inner' : darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <Moon size={24} className={displaySettings.theme === 'dark' ? "text-blue-400" : ""} />
              </div>
              <span className="font-medium">Dark</span>
            </button>
            
            <button 
              onClick={() => handleThemeChange('system')}
              className={`p-6 rounded-xl flex flex-col items-center gap-4 transition-all duration-200 ${
                displaySettings.theme === 'system'
                  ? (darkMode 
                      ? 'bg-gradient-to-br from-indigo-900/50 to-blue-800/40 text-blue-300 ring-2 ring-blue-500 shadow-md' 
                      : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 ring-2 ring-blue-500 shadow-md')
                  : (darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700')
              }`}
            >
              <div className={`p-3 rounded-full ${
                displaySettings.theme === 'system' 
                  ? (darkMode ? 'bg-gray-800 shadow-inner' : 'bg-white shadow-inner')
                  : (darkMode ? 'bg-gray-800' : 'bg-gray-200')
              }`}>
                <Monitor size={24} className={displaySettings.theme === 'system' ? (darkMode ? "text-blue-400" : "text-blue-500") : ""} />
              </div>
              <span className="font-medium">System</span>
            </button>
          </div>
        </div>
        
        {/* Density */}
        <div>
          <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Density</h3>
          <div className="flex flex-wrap gap-4">
            {["compact", "default", "comfortable"].map((density) => (
              <button 
                key={density}
                onClick={() => updateDisplaySettings({ density: density as any })}
                className={`py-3 px-4 rounded-lg transition-all duration-200 min-w-[120px] ${
                  displaySettings.density === density
                    ? (darkMode 
                        ? 'bg-blue-900/40 text-blue-300 border border-blue-700 shadow-lg shadow-blue-800/10' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-lg shadow-blue-100')
                    : (darkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200 border border-gray-200')
                }`}
              >
                {density.charAt(0).toUpperCase() + density.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Color Scheme */}
        <div>
          <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Color Scheme</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {colorOptions.map(color => (
              <ColorOption
                key={color}
                color={color}
                isSelected={displaySettings.colorScheme === color}
                onClick={() => updateDisplaySettings({ colorScheme: color })}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>
        
        {/* Other display options */}
        <div>
          <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Other Options</h3>
          
          <div className="space-y-4">
            <ToggleSwitch
              checked={displaySettings.animations}
              onChange={() => updateDisplaySettings({ animations: !displaySettings.animations })}
              label="Animations"
              description="Enable UI animations and transitions"
              darkMode={darkMode}
              id="animations-toggle"
            />
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium">Offline Mode</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enable working offline (when available)
                </p>
              </div>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                <CloudOff size={16} />
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;