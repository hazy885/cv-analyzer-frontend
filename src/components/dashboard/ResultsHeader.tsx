import React from 'react';
import { Filter } from 'lucide-react';

interface ResultsHeaderProps {
  filteredCount: number;
  totalCount: number;
  darkMode: boolean;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  filteredCount, 
  totalCount, 
  darkMode 
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between mb-5 px-4 py-3 rounded-lg ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center gap-2">
        <Filter className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalCount}</span> candidates
        </span>
      </div>
      
      {/* Status Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interviewing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hired</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inactive</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;