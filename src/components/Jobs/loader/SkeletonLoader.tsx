import React from 'react';

interface SkeletonLoaderProps {
  darkMode: boolean;
}

export const JobCardSkeleton: React.FC<SkeletonLoaderProps> = ({ darkMode }) => {
  return (
    <div 
      className={`rounded-xl transition-all duration-300 shadow-lg overflow-hidden border animate-pulse ${
        darkMode 
          ? 'bg-gray-800/60 backdrop-blur-sm border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-6">
        <div className={`inline-block w-24 h-6 rounded-full mb-4 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
        <div className={`w-3/4 h-7 rounded mb-2 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
        <div className={`w-full h-4 rounded mb-1 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
        <div className={`w-full h-4 rounded mb-1 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
        <div className={`w-2/3 h-4 rounded mb-4 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`w-20 h-6 rounded-md ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`w-28 h-6 rounded-md ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
        <div className={`w-28 h-5 rounded ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
      </div>
    </div>
  );
};

export const JobListSkeleton: React.FC<SkeletonLoaderProps> = ({ darkMode }) => {
  return (
    <>
      <div className={`p-6 mb-8 rounded-2xl transition-all duration-300 shadow-lg animate-pulse ${darkMode ? 'bg-gray-800/60' : 'bg-white'}`}>
        <div className="flex items-center mb-4 gap-2">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="w-6 h-6"></div>
          </div>
          <div className={`h-8 w-48 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className={`h-12 flex-grow rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-12 w-48 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className={`mt-4 h-5 w-36 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <JobCardSkeleton key={index} darkMode={darkMode} />
        ))}
      </div>
    </>
  );
};