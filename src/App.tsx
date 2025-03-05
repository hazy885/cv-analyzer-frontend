import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Import from "./pages/Import";
import Settings from "./pages/Setting";
import { useDarkMode } from "./components/ui/DarkModeContext";
// Import other pages like Candidates, Jobs, etc.

// Create a wrapper component to access location
const AppContent = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();
  const [activePage, setActivePage] = useState("Dashboard");

  // Update active page based on route
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes("/dashboard")) {
      setActivePage("Dashboard");
    } else if (path.includes("/candidates")) {
      setActivePage("Candidates");
    } else if (path.includes("/jobs")) {
      setActivePage("Jobs");
    } else if (path.includes("/calendar")) {
      setActivePage("Calendar");
    } else if (path.includes("/reports")) {
      setActivePage("Reports");
    } else if (path.includes("/settings")) {
      setActivePage("Settings");
    } else if (path.includes("/import")) {
      setActivePage("Import");
    }
  }, [location]);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen`}>
      <div className="flex h-screen">
        <Sidebar
          darkMode={darkMode}
          setDarkMode={toggleDarkMode}
          activePage={activePage}
        />
        <div className="flex-1 flex flex-col overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            {/* Define other routes here */}
            <Route path="/candidates" element={<div className="p-6"><h1 className="text-2xl font-bold">Candidates</h1></div>} />
            <Route path="/jobs" element={<div className="p-6"><h1 className="text-2xl font-bold">Jobs</h1></div>} />
            <Route path="/calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1></div>} />
            <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div>} />
            <Route path="/import" element={<Import />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;