import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };
  
  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={toggleDropdown}
        className={`w-full flex items-center justify-between p-4 rounded-xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        } shadow-md transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          {activeTabData?.icon}
          <span className="font-medium">{activeTabData?.label}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isOpen && (
        <div className={`mt-2 rounded-xl overflow-hidden shadow-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 p-4 transition-colors ${
                    activeTab === tab.id
                      ? (darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700')
                      : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                  }`}
                >
                  {React.cloneElement(tab.icon as React.ReactElement, { 
                    size: 20,
                    className: activeTab === tab.id 
                      ? (darkMode ? 'text-blue-400' : 'text-blue-600') 
                      : undefined
                  })}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsMobileNav;