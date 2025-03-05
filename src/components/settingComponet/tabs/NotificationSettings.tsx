// src/components/settings/tabs/NotificationSettings.tsx
import React from 'react';
import { Bell, Mail, Smartphone } from 'lucide-react';
import SettingsHeader from '../ui/SettingsHeader';
import SettingsCard from '../ui/SettingsCard';
import ToggleSwitch from '../ui/ToggleSwitch';
import { NotificationSetting } from '../types/settings';

interface NotificationSettingsProps {
  notificationSettings: NotificationSetting[];
  toggleNotification: (id: string) => void;
  darkMode: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationSettings,
  toggleNotification,
  darkMode
}) => {
  return (
    <div className="animate-fadeIn">
      <SettingsHeader 
        icon={<Bell />} 
        title="Notification Preferences" 
        darkMode={darkMode} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SettingsCard darkMode={darkMode} className={darkMode ? 'bg-gray-700/30' : 'bg-blue-50'}>
          <div className="flex items-center gap-3 mb-2">
            <Mail size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className="font-medium">Email Notifications</h3>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Receive notifications via email for important updates
          </p>
        </SettingsCard>
        
        <SettingsCard darkMode={darkMode} className={darkMode ? 'bg-gray-700/30' : 'bg-blue-50'}>
          <div className="flex items-center gap-3 mb-2">
            <Smartphone size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className="font-medium">Push Notifications</h3>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Receive push notifications for real-time updates
          </p>
        </SettingsCard>
      </div>
      
      <div className="space-y-1 divide-y divide-gray-200 dark:divide-gray-700">
        {notificationSettings.map(setting => (
          <ToggleSwitch
            key={setting.id}
            checked={setting.enabled}
            onChange={() => toggleNotification(setting.id)}
            label={setting.title}
            description={setting.description}
            darkMode={darkMode}
            id={`notification-${setting.id}`}
          />
        ))}
      </div>
      
      <div className="mt-8">
        <SettingsCard darkMode={darkMode} border>
          <h3 className="font-medium mb-2">Notification Schedule</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            Control when you receive notifications
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="quietHours" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                defaultChecked={true}
              />
              <label htmlFor="quietHours" className="text-sm">Enable quiet hours</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4 ml-7">
              <div>
                <label htmlFor="quietStart" className="block text-sm mb-1">
                  Start time
                </label>
                <select 
                  id="quietStart"
                  className={`w-full py-2 px-3 rounded border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}
                  defaultValue="22:00"
                >
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                </select>
              </div>
              <div>
                <label htmlFor="quietEnd" className="block text-sm mb-1">
                  End time
                </label>
                <select 
                  id="quietEnd"
                  className={`w-full py-2 px-3 rounded border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}
                  defaultValue="07:00"
                >
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                </select>
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>
      
      <div className="mt-8">
        <SettingsCard darkMode={darkMode} border>
          <h3 className="font-medium mb-2">Notification Channels</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            Choose how you want to receive different types of notifications
          </p>
          
          <div className="overflow-x-auto">
            <table className={`w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <thead>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <th className="text-left pb-2 font-medium">Notification Type</th>
                  <th className="text-center pb-2 font-medium">Email</th>
                  <th className="text-center pb-2 font-medium">In-App</th>
                  <th className="text-center pb-2 font-medium">SMS</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-3">New Candidates</td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                  </td>
                </tr>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-3">Interview Scheduled</td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                </tr>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-3">Status Changes</td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3">Team Activity</td>
                  <td className="text-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
};

export default NotificationSettings;