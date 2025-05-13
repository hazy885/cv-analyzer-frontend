import React from 'react';

interface DashboardTabsProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  darkMode: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab, 
  handleTabChange, 
  darkMode 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleTabChange("all")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "all"
            ? darkMode
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
              : "bg-blue-500 text-white shadow-md shadow-blue-500/20"
            : darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      >
        All Candidates
      </button>
      <button
        onClick={() => handleTabChange("active")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "active"
            ? darkMode
              ? "bg-green-600 text-white shadow-md shadow-green-500/10"
              : "bg-green-500 text-white shadow-md shadow-green-500/20"
            : darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Active</span>
        </div>
      </button>
      <button
        onClick={() => handleTabChange("interviewing")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "interviewing"
            ? darkMode
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
              : "bg-blue-500 text-white shadow-md shadow-blue-500/20"
            : darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span>Interviewing</span>
        </div>
      </button>
      <button
        onClick={() => handleTabChange("hired")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "hired"
            ? darkMode
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
              : "bg-purple-500 text-white shadow-md shadow-purple-500/20"
            : darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          <span>Hired</span>
        </div>
      </button>
    </div>
  );
};

export default DashboardTabs;