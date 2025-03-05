import React, { useState } from "react";
import { Search, Moon, Sun, Filter, Bell, Menu } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  toggleFilterPanel?: () => void; // Optional function to toggle filter panel
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  setFilters,
  toggleFilterPanel,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setFilters((prev: any) => ({ ...prev, search: e.target.value }));
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilters((prev: any) => ({ ...prev, search: "" }));
  };

  return (
    <header
      className={`sticky top-0 z-10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        darkMode
          ? "bg-gray-900 text-white border-b border-gray-700 shadow-md"
          : "bg-white text-gray-800 border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight">
            Candidate<span className="text-blue-500 font-extrabold">DB</span>
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:hidden">
          <button
            onClick={() => toggleFilterPanel?.()}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <Filter
              size={18}
              className={darkMode ? "text-gray-300" : "text-gray-600"}
            />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-300" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
        <div className="relative flex-grow max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            value={searchValue}
            placeholder="Search candidates..."
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-8 py-2 rounded-full border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-600"
                : "bg-gray-50 border-gray-300 focus:border-blue-500"
            } focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all`}
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <button
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors relative`}
          >
            <Bell
              size={18}
              className={darkMode ? "text-gray-300" : "text-gray-600"}
            />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500"></span>
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
