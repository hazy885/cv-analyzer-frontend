import React from 'react';
import { Grid, List } from 'lucide-react';

interface ViewControlsProps {
  layout: string;
  setLayout: (layout: string) => void;
  darkMode: boolean;
}

const ViewControls: React.FC<ViewControlsProps> = ({ 
  layout, 
  setLayout, 
  darkMode 
}) => {
  return (
    <div className={`flex items-center p-1.5 rounded-lg ${
      darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
    }`}>
      <button
        onClick={() => setLayout("grid")}
        className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
          layout === "grid"
            ? darkMode
              ? "bg-gray-700 text-white"
              : "bg-gray-100 text-gray-800"
            : ""
        }`}
      >
        <Grid className="h-4 w-4 mr-1.5" />
        Grid
      </button>
      <button
        onClick={() => setLayout("list")}
        className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
          layout === "list"
            ? darkMode
              ? "bg-gray-700 text-white"
              : "bg-gray-100 text-gray-800"
            : ""
        }`}
      >
        <List className="h-4 w-4 mr-1.5" />
        List
      </button>
    </div>
  );
};

export default ViewControls;