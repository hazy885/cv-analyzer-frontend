import React, { useState } from "react";
import { Search, Moon, Sun, Filter, Bell, Menu, User, ChevronDown, Settings, LogOut, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  toggleFilterPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  setFilters,
  toggleFilterPanel,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setFilters((prev: any) => ({ ...prev, search: e.target.value }));
  };

  const clearSearch = () => {
    setSearchValue("");
    setFilters((prev: any) => ({ ...prev, search: "" }));
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
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
          <Link to="/dashboard" className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-2">
              CV
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              CV<span className="text-blue-500 font-extrabold">Analyzer</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:hidden">
          <button
            onClick={() => toggleFilterPanel?.()}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
            aria-label="Toggle filters"
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
            aria-label="Toggle dark mode"
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
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center space-x-3">
          <button
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors relative`}
            aria-label="Notifications"
          >
            <Bell
              size={18}
              className={darkMode ? "text-gray-300" : "text-gray-600"}
            />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500"></span>
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-300" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
          </button>
          
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className={`flex items-center gap-2 px-2 py-1 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } transition-colors`}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                JS
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>
            
            {userMenuOpen && (
              <div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-20 ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                }`}
              >
                <div className={`px-4 py-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <p className="text-sm font-medium">John Smith</p>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>john.smith@example.com</p>
                </div>
                <Link 
                  to="/settings" 
                  className={`flex items-center px-4 py-2 text-sm ${
                    darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
                <Link 
                  to="/help" 
                  className={`flex items-center px-4 py-2 text-sm ${
                    darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  <HelpCircle size={16} className="mr-2" />
                  Help & Support
                </Link>
                <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <button 
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;