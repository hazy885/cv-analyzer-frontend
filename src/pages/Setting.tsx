// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../components/ui/DarkModeContext';
import { Bell, UserCircle, Shield, Eye, Globe, Mail, Database } from 'lucide-react';

// Layout Components
import SettingsLayout from '../components/settingComponet/layouts/SettingsLayout';

// Tab Components
import AccountSettings from '../components/settingComponet/tabs/AccountSettings';
import AppearanceSettings from '../components/settingComponet/tabs/AppearanceSettings';
import NotificationSettings from '../components/settingComponet/tabs/NotificationSettings';
// Import other tab components as needed

// UI Components
import SaveButton from '../components/settingComponet/ui/SaveButton';

// Types
import { 
  SettingsTab, 
  UserProfile, 
  NotificationSetting,
  DisplaySettings,
  LanguageSettings,
  PrivacySettings,
  LinkedAccount
} from '../components/settingComponet/types/settings';

export interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Settings: React.FC = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('account');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'loading' | 'error' | 'info'>('success');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Define tabs configuration
  const tabs: SettingsTab[] = [
    { id: 'account', label: 'Account', icon: <UserCircle size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'appearance', label: 'Appearance', icon: <Eye size={20} /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={20} /> },
    { id: 'language', label: 'Language & Region', icon: <Globe size={20} /> },
  ];

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'Administrator',
    company: 'Acme Recruiting',
    phone: '+1 (555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?img=32',
  });

  // Linked accounts state
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    {
      id: 'office365',
      name: 'Microsoft Office 365',
      isConnected: true,
      icon: <Mail />,
      description: 'Connected for calendar sync'
    },
    {
      id: 'ats',
      name: 'ATS System',
      isConnected: false,
      icon: <Database />,
      description: 'Connect to import data'
    }
  ]);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'newCandidates',
      title: 'New Candidates',
      description: 'Get notified when new candidates apply',
      enabled: true
    },
    {
      id: 'statusChanges',
      title: 'Status Changes',
      description: 'Get notified when candidate status changes',
      enabled: true
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Get notified for new messages',
      enabled: false
    },
    {
      id: 'interviews',
      title: 'Interview Scheduling',
      description: 'Get notified when interviews are scheduled or changed',
      enabled: true
    },
    {
      id: 'teamActivity',
      title: 'Team Activity',
      description: 'Get notified about your team members\' activities',
      enabled: false
    }
  ]);
  
  // Display settings state
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: darkMode ? 'dark' : 'light',
    density: 'default',
    colorScheme: 'blue',
    animations: true,
    dashboardLayout: 'default'
  });
  
  // Language settings state
  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>({
    language: 'english',
    timezone: 'Pacific Time (UTC-08:00)',
    dateFormat: 'MM/DD/YYYY',
    firstDayOfWeek: 'sunday'
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    twoFactorEnabled: false,
    activityLogging: true,
    dataSharingConsent: true,
    autoSignOut: 30, // minutes
  });

  // Update dark mode when theme changes
  useEffect(() => {
    setDisplaySettings((prev: DisplaySettings) => ({ ...prev, theme: darkMode ? 'dark' : 'light' }));
  }, [darkMode]);

  // Mark as having unsaved changes when any settings change
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [userProfile, notificationSettings, displaySettings, languageSettings, privacySettings]);

  // Clear status message
  const clearStatusMessage = () => {
    setStatusMessage('');
  };

  // Update user profile
  const updateProfile = (field: string, value: string) => {
      setUserProfile((prev: UserProfile) => ({ ...prev, [field]: value }));
  };

  // Toggle a notification setting
  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
  };

  // Update display settings
  const updateDisplaySettings = (settings: Partial<DisplaySettings>) => {
      setDisplaySettings((prev: DisplaySettings) => ({ ...prev, ...settings }));
  };

  // Update language settings
  const updateLanguageSettings = (settings: Partial<LanguageSettings>) => {
    setLanguageSettings((prev: LanguageSettings) => ({ ...prev, ...settings }));
  };

  // Update privacy settings
  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setPrivacySettings((prev: PrivacySettings) => ({ ...prev, ...settings }));
  };

  // Handle theme change
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateDisplaySettings({ theme });
    
    // If 'system', we would typically check system preference here
    // For simplicity, we're just using the current state for 'system'
    if (theme !== 'system') {
      setDarkMode(theme === 'dark');
    }
  };

  // Handle save changes
  const handleSave = () => {
    // Here we would normally save to a backend
    // Simulate API call with loading state
    setStatusMessage('Saving changes...');
    setStatusType('loading');
    
    setTimeout(() => {
      setStatusMessage('Settings saved successfully!');
      setStatusType('success');
      setHasUnsavedChanges(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        clearStatusMessage();
      }, 3000);
    }, 800);
  };

  return (
    <SettingsLayout
      title="Account Settings"
      subtitle="Manage your preferences and account details"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
      userProfile={userProfile}
      darkMode={darkMode}
      statusMessage={statusMessage}
      statusType={statusType}
      clearStatusMessage={clearStatusMessage}
    >
      {/* Render the appropriate tab content based on activeTab */}
      {activeTab === 'account' && (
        <AccountSettings 
          userProfile={userProfile} 
          updateProfile={updateProfile}
          linkedAccounts={linkedAccounts}
          darkMode={darkMode} 
        />
      )}
      
      {activeTab === 'appearance' && (
        <AppearanceSettings 
          displaySettings={displaySettings}
          updateDisplaySettings={updateDisplaySettings}
          handleThemeChange={handleThemeChange}
          darkMode={darkMode}
        />
      )}
      
      {/* Add other tab content components here */}
      
      {/* Save Button (common across all tabs) */}
      <SaveButton 
        onClick={handleSave}
        disabled={!hasUnsavedChanges}
        darkMode={darkMode}
        hasChanges={hasUnsavedChanges}
      />
    </SettingsLayout>
  );
};

export default Settings;