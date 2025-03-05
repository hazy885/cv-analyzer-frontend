import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  BarChart, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  FilePlus // Add this for Import icon
} from "lucide-react";
import { useDarkMode } from "./ui/DarkModeContext";

interface SidebarProps {
  activePage?: string;
  // darkMode and setDarkMode are optional here if using context
  darkMode?: boolean;
  setDarkMode?: (darkMode: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activePage = "Dashboard",
  // These props are now optional if using context
  darkMode: propsDarkMode,
  setDarkMode: propsSetDarkMode
}) => {
  // Use context or props (props take precedence)
  const contextValues = useDarkMode();
  const darkMode = propsDarkMode !== undefined ? propsDarkMode : contextValues.darkMode;
  const toggleDarkMode = () => {
    if (propsSetDarkMode) {
      propsSetDarkMode(!darkMode);
    } else {
      contextValues.toggleDarkMode();
    }
  };

  const [collapsed, setCollapsed] = useState(false);

  // Automatically collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // Mobile and tablet screens
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Initial check for screen size
    handleResize();

    // Set up resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Candidates", icon: <Users size={20} />, path: "/candidates" },
    { name: "Jobs", icon: <Briefcase size={20} />, path: "/jobs" },
    { name: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
    { name: "Reports", icon: <BarChart size={20} />, path: "/reports" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Import", icon: <FilePlus size={20} />, path: "/import" } 
  ];

  return (
    <div 
      className={`${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } ${
        collapsed ? "w-20" : "w-64"
      } border-r transition-all duration-300 ease-in-out relative group flex flex-col h-full`}
    >
      <div className={`flex ${collapsed ? "justify-center" : "justify-between"} items-center p-4 border-b ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}>
        {!collapsed && <h2 className={`font-bold text-lg ${darkMode ? "text-blue-400" : "text-blue-600"}`}>Recruit<span className="font-extrabold">CRM</span></h2>}
        {collapsed && <div className={`font-bold text-2xl ${darkMode ? "text-blue-400" : "text-blue-600"}`}>R</div>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="mt-2 flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = item.name === activePage;
            return (
              <li key={item.name}>
                <Link 
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? darkMode 
                        ? "bg-blue-600 text-white" 
                        : "bg-blue-50 text-blue-700" 
                      : darkMode 
                        ? "text-gray-300 hover:bg-gray-700" 
                        : "text-gray-700 hover:bg-gray-100"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <span className={`${isActive ? darkMode ? "text-white" : "text-blue-600" : ""}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className={`px-4 py-3 ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } border-t`}>
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <span>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </span>
          {!collapsed && <span className="ml-3">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>

      <div className={`p-4 border-t ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}>
        <div className={`flex ${collapsed ? "justify-center" : ""} items-center`}>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
              JS
            </div>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="font-medium">John Smith</p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
