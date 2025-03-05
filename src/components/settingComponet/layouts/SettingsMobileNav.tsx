// src/components/settings/layout/SettingsMobileNav.tsx
import React, { useState } from 'react';
import { ChevronRight, SettingsIcon } from 'lucide-react';
import { SettingsTab } from '../types/settings';

interface SettingsMobileNavProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: SettingsTab[];
  darkMode: boolean;
}

const SettingsMobileNav: React.FC<SettingsMobileNavProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  darkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };
  
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);
  
  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-4 rounded-lg ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } shadow-sm`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <SettingsIcon size={18} className="text-blue-500" />
          <span className="font-medium">
            {activeTabInfo?.label || 'Settings'}
          </span>
        </div>
        <ChevronRight 
          size={18} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className={`mt-2 rounded-lg shadow-lg overflow-hidden animate-fadeIn ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <nav>
            <ul className="py-2">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button 
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left p-3 px-4 flex items-center gap-3 ${
                      activeTab === tab.id 
                        ? (darkMode ? 'bg-blue-600/20 text-blue-200' : 'bg-blue-50 text-blue-700') 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {React.cloneElement(tab.icon as React.ReactElement, { 
                      className: activeTab === tab.id 
                        ? 'text-blue-500' 
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    })}
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default SettingsMobileNav;