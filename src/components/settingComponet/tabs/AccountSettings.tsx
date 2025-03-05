// src/components/settings/tabs/AccountSettings.tsx
import React from 'react';
import { UserCircle, Mail, Database } from 'lucide-react';
import SettingsHeader from '../ui/SettingsHeader';
import { UserProfile, LinkedAccount } from '../types/settings';

// Helper component for edit icon
const EditIcon: React.FC<{size: number, className?: string}> = ({size, className}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
      <path d="m15 5 4 4"></path>
    </svg>
  );
};

interface AccountSettingsProps {
  userProfile: UserProfile;
  updateProfile: (field: string, value: string) => void;
  linkedAccounts: LinkedAccount[];
  darkMode: boolean;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ 
  userProfile, 
  updateProfile, 
  linkedAccounts, 
  darkMode 
}) => {
  return (
    <div className="animate-fadeIn">
      <SettingsHeader 
        icon={<UserCircle />} 
        title="Account Information" 
        darkMode={darkMode} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Profile Photo Section */}
        <div className="md:col-span-2 flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-2">
          <div className="relative group">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-blue-500">
              <img src={userProfile.avatar} alt="User avatar" className="h-full w-full object-cover" />
            </div>
            <div className={`absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 
              flex items-center justify-center transition-opacity cursor-pointer`}>
              <EditIcon size={16} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{userProfile.fullName}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {userProfile.role} at {userProfile.company}
            </p>
            <div className="mt-2">
              <button className={`text-sm px-3 py-1 rounded-md ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                Change Photo
              </button>
            </div>
          </div>
        </div>
        
        {/* Form Fields */}
        <div>
          <label htmlFor="fullName" className="block mb-2 font-medium text-sm">Full Name</label>
          <input 
            type="text" 
            id="fullName" 
            value={userProfile.fullName}
            onChange={(e) => updateProfile('fullName', e.target.value)}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              darkMode ? 'bg-gray-700/70 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`} 
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2 font-medium text-sm">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={userProfile.email}
            onChange={(e) => updateProfile('email', e.target.value)}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              darkMode ? 'bg-gray-700/70 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`} 
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block mb-2 font-medium text-sm">Role</label>
          <select 
            id="role" 
            value={userProfile.role}
            onChange={(e) => updateProfile('role', e.target.value)}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              darkMode ? 'bg-gray-700/70 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`}
          >
            <option>Administrator</option>
            <option>Recruiter</option>
            <option>Hiring Manager</option>
            <option>Team Member</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="phone" className="block mb-2 font-medium text-sm">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            value={userProfile.phone}
            onChange={(e) => updateProfile('phone', e.target.value)}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              darkMode ? 'bg-gray-700/70 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`} 
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="company" className="block mb-2 font-medium text-sm">Company</label>
          <input 
            type="text" 
            id="company" 
            value={userProfile.company}
            onChange={(e) => updateProfile('company', e.target.value)}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              darkMode ? 'bg-gray-700/70 border-gray-600' : 'bg-gray-50 border-gray-300'
            }`} 
          />
        </div>
      </div>
      
      {/* Linked Accounts Section */}
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4">Linked Accounts</h3>
        
        <div className="space-y-4">
          {linkedAccounts.map((account) => (
            <div key={account.id} className={`p-4 rounded-lg flex items-center justify-between ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  account.isConnected
                    ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-100')
                    : (darkMode ? 'bg-gray-800' : 'bg-gray-200')
                }`}>
                  {React.cloneElement(account.icon as React.ReactElement<any>, { 
                    size: 18,
                    className: account.isConnected 
                      ? 'text-blue-500' 
                      : (darkMode ? 'text-gray-400' : 'text-gray-500')
                  })}
                </div>
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {account.description}
                  </p>
                </div>
              </div>
              <div>
                {account.isConnected ? (
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    Connected
                  </span>
                ) : (
                  <button className={`px-3 py-1 rounded-md text-sm ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;