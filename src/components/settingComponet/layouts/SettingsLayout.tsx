// src/components/settings/layout/SettingsLayout.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { fadeAnimations } from '../utils/animations';
import StatusMessage from '../ui/StatusMessage';
import SettingsSidebar from './SettingsSidebar';
import SettingsMobileNav from './SettingsMobileNav';
import { SettingsTab, UserProfile } from '../types/settings';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: SettingsTab[];
  userProfile: UserProfile;
  darkMode: boolean;
  statusMessage: string;
  statusType: 'success' | 'loading' | 'error' | 'info';
  clearStatusMessage: () => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  title,
  subtitle,
  activeTab,
  setActiveTab,
  tabs,
  userProfile,
  darkMode,
  statusMessage,
  statusType,
  clearStatusMessage
}) => {
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
    }`}>
      <style>{fadeAnimations}</style>
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => window.history.back()}
            className={`p-2 rounded-full mr-3 transition-colors ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            }`}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Status message notification */}
        {statusMessage && (
          <StatusMessage
            message={statusMessage}
            type={statusType}
            darkMode={darkMode}
            onDismiss={clearStatusMessage}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Navigation */}
          <SettingsMobileNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            darkMode={darkMode}
          />
          
          {/* Sidebar Navigation */}
          <SettingsSidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userProfile={userProfile}
            darkMode={darkMode}
          />

          {/* Main content area */}
          <div className={`flex-1 ${
            darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white'
          } rounded-xl shadow-lg p-6 transition-all duration-300`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;