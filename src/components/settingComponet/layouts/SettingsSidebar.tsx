import React from 'react';
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
    <div className={`hidden lg:block w-64 h-fit sticky top-24 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    } rounded-3xl shadow-lg overflow-hidden transition-all duration-300`}>
      {/* User profile section */}
      <div className={`p-6 ${
        darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.fullName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{userProfile.fullName}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {userProfile.role}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <nav className="p-3">
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? (darkMode 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200/50')
                    : (darkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                {React.cloneElement(tab.icon as React.ReactElement, { 
                  size: 20,
                  className: activeTab === tab.id 
                    ? (darkMode ? 'text-blue-400' : 'text-blue-600') 
                    : undefined
                })}
                <span className="font-medium">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SettingsSidebar;