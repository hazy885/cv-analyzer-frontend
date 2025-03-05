// src/components/settings/types/settings.ts

export interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  company: string;
  phone: string;
  avatar: string;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  density: 'compact' | 'default' | 'comfortable';
  colorScheme: string;
  animations: boolean;
  dashboardLayout: string;
}

export interface LanguageSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  firstDayOfWeek: string;
}

export interface PrivacySettings {
  twoFactorEnabled: boolean;
  activityLogging: boolean;
  dataSharingConsent: boolean;
  autoSignOut: number;
}

export interface LinkedAccount {
  id: string;
  name: string;
  isConnected: boolean;
  icon: React.ReactNode;
  description: string;
}