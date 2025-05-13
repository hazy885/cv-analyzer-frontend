import React from 'react';
import { useDarkMode } from '../components/ui/DarkModeContext';
import { Sun, Moon, FilePlus, LayoutDashboard, Users, Briefcase, Settings } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  
  // Get current page from path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/import') return 'Import';
    if (path === '/candidates') return 'Candidates';
    if (path === '/jobs') return 'Jobs';
    if (path === '/settings') return 'Settings';
    return '';
  };
  
  const currentPage = getCurrentPage();
  
  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`w-64 h-screen sticky top-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
        {/* Logo */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`font-medium text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            CV <span className="font-semibold">Analyzer</span>
          </h2>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8">
          <ul className="space-y-1 px-4">
            <li>
              <Link 
                to="/"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  currentPage === 'Dashboard' 
                    ? darkMode 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard size={20} />
                <span className="ml-3 font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/import"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  currentPage === 'Import' 
                    ? darkMode 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FilePlus size={20} />
                <span className="ml-3 font-medium">Import</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/candidates"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  currentPage === 'Candidates' 
                    ? darkMode 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users size={20} />
                <span className="ml-3 font-medium">Candidates</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/jobs"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  currentPage === 'Jobs' 
                    ? darkMode 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Briefcase size={20} />
                <span className="ml-3 font-medium">Jobs</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/settings"
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  currentPage === 'Settings' 
                    ? darkMode 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={20} />
                <span className="ml-3 font-medium">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Dark Mode Toggle */}
        <div className={`absolute bottom-0 left-0 right-0 px-4 py-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
              darkMode
                ? 'text-gray-300 hover:bg-gray-700/50'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="ml-3 font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className={`py-4 px-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm sticky top-0 z-10`}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-medium">{currentPage}</h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                JS
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className={`py-6 px-8 ${darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-white text-gray-500 border-gray-200'} border-t`}>
          <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CV Analyzer. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;