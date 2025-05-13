import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  requiredSkills?: string[];
}

interface AIInsightCardProps {
  selectedPosition: Position;
  matchCount: number;
  darkMode: boolean;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ 
  selectedPosition, 
  matchCount, 
  darkMode 
}) => {
  return (
    <div className={`mb-8 p-5 rounded-xl shadow-lg ${
      darkMode ? 
        'bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border border-blue-900/40' : 
        'bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200'
    } overflow-hidden relative`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-28 h-28 rounded-full bg-indigo-500/10 blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 relative z-10">
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-900/40 border border-blue-800/50' : 'bg-blue-100 border border-blue-200'}`}>
          <Sparkles className="h-7 w-7 text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-xl">AI Recruitment Assistant</h3>
          <p className={`text-sm mt-2 md:max-w-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our AI has analyzed your candidate pool and found <span className="font-medium">{matchCount} strong matches</span> for the {selectedPosition.title} position based on skills, experience, and availability.
          </p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedPosition.requiredSkills?.map((skill, index) => (
              <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium 
              ${darkMode 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20'
              } transition-all duration-200 flex items-center gap-1.5 hover:scale-105`}
          >
            <Zap className="h-4 w-4" />
            <span>See AI Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;