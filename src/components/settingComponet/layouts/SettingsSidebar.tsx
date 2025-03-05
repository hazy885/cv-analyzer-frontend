// src/components/settings/layout/SettingsSidebar.tsx
import React from 'react';
import { LogOut } from 'lucide-react';
import { SettingsTab, UserProfile } from '../types/settings';

interface SettingsSidebarProps {
  tabs: SettingsTab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  userProfile: UserProfile;
  darkMode: boolean;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  userProfile,
  darkMode
}) => {
  return (
    <div className={`hidden lg:block w-72 flex-shrink-0 ${
      darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white'
    } rounded-xl shadow-lg p-4 h-fit sticky top-4 transition-all duration-300`}>
      <div className="flex items-center gap-3 p-3 mb-4">
        <div className="h-10 w-10 rounded-full overflow-hidden">
          <img src={userProfile.avatar} alt="User avatar" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-medium">{userProfile.fullName}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {userProfile.email}
          </p>
        </div>
      </div>
      
      <nav>
        <ul className="space-y-1">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button 
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? (darkMode ? 'bg-blue-600/20 text-blue-200 border-l-4 border-blue-500' : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500') 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                {React.cloneElement(tab.icon as React.ReactElement<any>, { 
                  className: activeTab === tab.id ? 'text-blue-500' : '' 
                })}
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
            darkMode ? 'hover:bg-red-900/20 text-red-300' : 'hover:bg-red-50 text-red-600'
          }`}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
        
        <div className="mt-4 px-3">
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p>Version 0.0.1</p>
            <p className="mt-1">© 2025 Recruitment Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;