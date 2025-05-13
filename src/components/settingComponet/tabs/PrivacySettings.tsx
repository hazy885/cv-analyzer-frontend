import React from 'react';
import { Shield, Lock, Clock, FileText, AlertTriangle } from 'lucide-react';
import SettingsHeader from '../ui/SettingsHeader';
import ToggleSwitch from '../ui/ToggleSwitch';
import { PrivacySettings as PrivacySettingsType } from '../types/settings';

interface PrivacySettingsProps {
  privacySettings: PrivacySettingsType;
  updatePrivacySettings: (settings: Partial<PrivacySettingsType>) => void;
  darkMode: boolean;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  privacySettings,
  updatePrivacySettings,
  darkMode
}) => {
  return (
    <div>
      <SettingsHeader 
        icon={<Shield />} 
        title="Privacy & Security" 
        darkMode={darkMode} 
      />
      
      <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-gray-700/30 border border-gray-600' : 'bg-white border border-gray-200'}`}>
        <h3 className="font-medium mb-4">Account Security</h3>
        
        <div className="space-y-4">
          <ToggleSwitch
            checked={privacySettings.twoFactorEnabled}
            onChange={() => updatePrivacySettings({ twoFactorEnabled: !privacySettings.twoFactorEnabled })}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            darkMode={darkMode}
            id="two-factor-toggle"
          />
          
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Last changed 3 months ago
                </p>
              </div>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200 border border-gray-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}>
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </div>
          
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto Sign Out</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Automatically sign out after period of inactivity
                </p>
              </div>
              <select
                value={privacySettings.autoSignOut.toString()}
                onChange={(e) => updatePrivacySettings({ autoSignOut: parseInt(e.target.value) })}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  darkMode 
                    ? 'bg-gray-600 text-gray-200 border border-gray-500' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <option value="0">Never</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-gray-700/30 border border-gray-600' : 'bg-white border border-gray-200'}`}>
        <h3 className="font-medium mb-4">Data Privacy</h3>
        
        <div className="space-y-4">
          <ToggleSwitch
            checked={privacySettings.activityLogging}
            onChange={() => updatePrivacySettings({ activityLogging: !privacySettings.activityLogging })}
            label="Activity Logging"
            description="Track your actions within the application for security purposes"
            darkMode={darkMode}
            id="activity-logging-toggle"
          />
          
          <ToggleSwitch
            checked={privacySettings.dataSharingConsent}
            onChange={() => updatePrivacySettings({ dataSharingConsent: !privacySettings.dataSharingConsent })}
            label="Data Sharing"
            description="Allow anonymous usage data to be shared for product improvement"
            darkMode={darkMode}
            id="data-sharing-toggle"
          />
          
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Activity Log</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  View your recent account activity
                </p>
              </div>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200 border border-gray-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}>
                <Clock size={16} />
                View Log
              </button>
            </div>
          </div>
          
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Privacy Policy</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Read our privacy policy
                </p>
              </div>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200 border border-gray-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}>
                <FileText size={16} />
                View Policy
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/10 border border-red-800/30' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`mt-1 ${darkMode ? 'text-red-400' : 'text-red-500'}`} size={20} />
          <div>
            <h3 className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Danger Zone</h3>
            <p className={`text-sm mt-1 mb-4 ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
              These actions are irreversible. Please proceed with caution.
            </p>
            
            <div className="space-y-3">
              <button className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}>
                Export All Data
              </button>
              
              <button className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium ${
                darkMode 
                  ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-800/30' 
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
              }`}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;