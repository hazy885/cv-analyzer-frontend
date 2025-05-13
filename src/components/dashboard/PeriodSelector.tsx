import React from 'react';

interface PeriodSelectorProps {
  activityPeriod: string;
  handlePeriodChange: (period: string) => void;
  darkMode: boolean;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  activityPeriod, 
  handlePeriodChange, 
  darkMode 
}) => {
  return (
    <div className={`flex p-1 rounded-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"}`}>
      <button
        onClick={() => handlePeriodChange("day")}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          activityPeriod === "day"
            ? darkMode
              ? "bg-gray-700 text-white"
              : "bg-gray-100 text-gray-800"
            : ""
        }`}
      >
        Day
      </button>
      <button
        onClick={() => handlePeriodChange("week")}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          activityPeriod === "week"
            ? darkMode
              ? "bg-gray-700 text-white"
              : "bg-gray-100 text-gray-800"
            : ""
        }`}
      >
        Week
      </button>
      <button
        onClick={() => handlePeriodChange("month")}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          activityPeriod === "month"
            ? darkMode
              ? "bg-gray-700 text-white"
              : "bg-gray-100 text-gray-800"
            : ""
        }`}
      >
        Month
      </button>
      <button
        onClick={() => handlePeriodChange("year")}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          activityPeriod === "year"
            ? darkMode
              ? "bg-gray-700 text-white"
              : "bg-gray-100 text-gray-800"
            : ""
        }`}
      >
        Year
      </button>
    </div>
  );
};

export default PeriodSelector;