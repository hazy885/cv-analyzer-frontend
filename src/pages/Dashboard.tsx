import React, { useState, useEffect } from "react";
import { useDarkMode } from "../components/ui/DarkModeContext"; 
import FilterPanel from "../components/dashboard/FilterPanel";
import { Header } from "../components/dashboard/Navbar";
import { CandidateGrid } from "../components/dashboard/CandidateGrid";
import { CandidateList } from "../components/dashboard/CandidateList";
import TopCandidateRanking from "../components/dashboard/TopCandidateRanking";
import { candidates } from "../data"; // Import the sample data
import { 
  Users, UserCheck, Award, Briefcase, TrendingUp, ChevronRight, 
  Clock, Calendar, Target, Mail, Filter, Zap, Cpu, Search,
  Layout, Grid, List, Sliders, ChevronDown, Sparkles
} from "lucide-react";

// Define interfaces to match what TopCandidateRanking expects
interface Candidate {
  id: number;
  name: string;
  role: string;
  experience: number;
  status: string;
  salary: number;
  location: string;
  matchScore: number;
  skills?: string[];
  applied?: string;
  email?: string;
  avatar?: string;
  lastActive?: string;
}

interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  requiredSkills?: string[];
}

// Enhanced positions with required skills
const positions: Position[] = [
  { 
    id: 1, 
    title: "Senior Frontend Developer", 
    department: "Engineering", 
    location: "Remote",
    requiredSkills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"]
  },
  { 
    id: 2, 
    title: "UX Designer", 
    department: "Design", 
    location: "New York",
    requiredSkills: ["Figma", "UI Design", "User Research", "Wireframing"]
  },
  { 
    id: 3, 
    title: "Product Manager", 
    department: "Product", 
    location: "San Francisco",
    requiredSkills: ["Agile", "Roadmapping", "User Stories", "Prioritization"]
  }
];

const Dashboard: React.FC = () => {
  // Use dark mode from context
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  const [filters, setFilters] = useState({
    experience: "all",
    status: "all",
    search: "",
    minSalary: 0,
    role: "all",
    location: "",
    jobType: "all",
    skills: [],
    education: "all",
    source: "all",
    dateRange: "anytime",
    availability: "all",
    rating: 0
  });

  const [layout, setLayout] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPosition, setSelectedPosition] = useState<Position>(positions[0]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "interviewing", "hired"
  const [activityPeriod, setActivityPeriod] = useState("week"); // "day", "week", "month", "year"
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    active: 0,
    senior: 0,
    newThisWeek: 0,
    interviews: 0,
    hired: 0
  });

  // Transform original candidates data to ensure each candidate has role and correct properties
  const enhancedCandidates: Candidate[] = candidates.map((candidate, index) => ({
    id: candidate.id !== undefined ? candidate.id : index + 1, // Ensure unique IDs
    name: candidate.name || "Unknown",
    role: candidate.skills?.includes("React") 
      ? "Frontend Developer" 
      : candidate.skills?.includes("Node.js") 
      ? "Backend Developer" 
      : candidate.skills?.includes("Vue.js") 
      ? "Frontend Developer" 
      : "Software Engineer",
    experience: candidate.experience || 0,
    status: candidate.status || "Inactive",
    salary: candidate.salary || 0,
    location: candidate.location || "Unknown",
    matchScore: 0, // Will be calculated below
    skills: candidate.skills || [],
    applied: candidate.applied,
    email: candidate.email || `${candidate.name?.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    avatar: candidate.avatar,
    lastActive: candidate.lastActive || "2 days ago"
  }));

  useEffect(() => {
    // Calculate dashboard statistics when candidates change
    setDashboardStats({
      total: enhancedCandidates.length,
      active: enhancedCandidates.filter(c => c.status.toLowerCase() === "active").length,
      senior: enhancedCandidates.filter(c => c.experience >= 5).length,
      newThisWeek: enhancedCandidates.filter(c => c.applied?.includes("2023") || Math.random() > 0.7).length,
      interviews: enhancedCandidates.filter(c => c.status.toLowerCase() === "interviewing").length,
      hired: enhancedCandidates.filter(c => c.status.toLowerCase() === "hired").length
    });
  }, [enhancedCandidates]);

  // Filter logic with enhanced filters
  const filteredCandidates = enhancedCandidates
    .filter((candidate) => {
      // Basic filters from original code
      if (filters.experience === "5+" && candidate.experience < 5) return false;
      if (filters.experience === "3-" && candidate.experience >= 3) return false;
      if (filters.status !== "all" && candidate.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.search && !candidate.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (candidate.salary < filters.minSalary) return false;
      
      // New enhanced filters
      if (filters.role !== "all" && !candidate.role.toLowerCase().includes(filters.role.toLowerCase())) return false;
      if (filters.location && !candidate.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      // Skills filtering
      if (filters.skills.length > 0) {
        const hasRequiredSkills = filters.skills.some(skill => 
          candidate.skills?.some(candidateSkill => 
            candidateSkill.toLowerCase() === skill.toLowerCase()
          )
        );
        if (!hasRequiredSkills) return false;
      }
      
      // Tab filtering
      if (activeTab !== "all" && candidate.status.toLowerCase() !== activeTab) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "experience") {
        return sortOrder === "asc"
          ? a.experience - b.experience
          : b.experience - a.experience;
      } else if (sortBy === "matchScore") {
        return sortOrder === "asc"
          ? a.matchScore - b.matchScore
          : b.matchScore - a.matchScore;
      }
      return 0;
    });

  // Calculate match score once (deterministically) and cache the results
  const calculateMatchScore = (candidate: Candidate, position: Position): number => {
    let score = 0;
    
    // Experience-based scoring
    if (position.title.includes("Senior")) {
      score += Math.min(candidate.experience * 10, 50);
    } else {
      score += Math.min(candidate.experience * 5, 30);
    }
    
    // Status-based scoring
    if (candidate.status.toLowerCase() === "active") {
      score += 20;
    }
    
    // Salary-based scoring
    if (candidate.salary < 80000) {
      score += 15;
    }
    
    // Location-based scoring
    if (candidate.location === position.location || position.location === "Remote") {
      score += 10;
    }
    
    // Skills-based scoring with required skills
    if (position.requiredSkills) {
      const matchedSkills = position.requiredSkills.filter(skill => 
        candidate.skills?.some(candidateSkill => 
          candidateSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      const skillScore = Math.min((matchedSkills.length / position.requiredSkills.length) * 40, 40);
      score += skillScore;
    }
    
    // Use a consistent seed instead of random to avoid unexpected changes
    const seedValue = candidate.id * 100 + position.id;
    const pseudoRandom = (seedValue % 10); // 0-9 range
    
    return Math.min(score + pseudoRandom, 100);
  };

  // Apply match scores based on selected position
  const candidatesWithScores = enhancedCandidates.map(candidate => ({
    ...candidate,
    matchScore: calculateMatchScore(candidate, selectedPosition)
  }));

  // Get top 5 candidates ranked by match score
  const rankedCandidates = [...candidatesWithScores]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3); 

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle period change for analytics
  const handlePeriodChange = (period: string) => {
    setActivityPeriod(period);
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-500";
      case "interviewing": return "bg-blue-500";
      case "hired": return "bg-purple-500";
      case "inactive": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  // Toggle filters visibility
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  return (
    <div
      className={`min-h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        setFilters={setFilters}
      />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {/* Page Title with Search */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
                Recruitment Dashboard
              </span>
            </h1>
            <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Manage candidates, track applications, and find perfect matches
            </p>
          </div>
          
          {/* Search Bar */}
          <div className={`relative flex-shrink-0 w-full md:w-auto min-w-64 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            <input
              type="text"
              placeholder="Search candidates..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:outline-none transition-all duration-200 ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 focus:ring-blue-500/40 focus:border-blue-500" 
                  : "bg-white border-gray-200 focus:ring-blue-500/30 focus:border-blue-500"
              }`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      
        {/* Dashboard Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className={`p-5 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Candidates
                </p>
                <h3 className="text-2xl font-bold mt-1">{dashboardStats.total}</h3>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className={`mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className="inline-flex items-center text-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                12% growth
              </span> from last {activityPeriod}
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active Candidates
                </p>
                <h3 className="text-2xl font-bold mt-1">{dashboardStats.active}</h3>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className={`mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className="inline-flex items-center text-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                8% growth
              </span> from last {activityPeriod}
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Senior Candidates
                </p>
                <h3 className="text-2xl font-bold mt-1">{dashboardStats.senior}</h3>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                <Award className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className={`mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className={`inline-flex items-center ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                <Briefcase className="h-3 w-3 mr-1" />
                5+ years experience
              </span>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  New Applications
                </p>
                <h3 className="text-2xl font-bold mt-1">{dashboardStats.newThisWeek}</h3>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                <Calendar className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className={`mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className="inline-flex items-center text-indigo-500">
                <Clock className="h-3 w-3 mr-1" />
                This {activityPeriod}
              </span>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Interviews
                </p>
                <h3 className="text-2xl font-bold mt-1">{dashboardStats.interviews}</h3>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <Target className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className={`mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className={`inline-flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <Clock className="h-3 w-3 mr-1" />
                {Math.round(dashboardStats.interviews * 0.35)} scheduled today
              </span>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Hired
                </p>
                <h3 className="text-2xl font-bold mt-1">{dashboardStats.hired}</h3>
              </div>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className={`mt-2 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <span className="inline-flex items-center text-purple-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                15% growth
              </span> from last {activityPeriod}
            </div>
          </div>
        </div>
          
        {/* AI Assistant Card */}
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
                Our AI has analyzed your candidate pool and found <span className="font-medium">{rankedCandidates.length} strong matches</span> for the {selectedPosition.title} position based on skills, experience, and availability.
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
          
        {/* Top Candidates Ranking Section */}
        <TopCandidateRanking
          rankedCandidates={rankedCandidates}
          selectedPosition={selectedPosition}
          darkMode={darkMode}
          setSelectedPosition={setSelectedPosition}
          positions={positions}
        />
        
        {/* Tabs and Controls Bar */}
        <div className="mb-6 bg-gradient-to-r from-transparent via-gray-200/10 to-transparent h-px"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Tabs for quick status filtering */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? darkMode
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                    : "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All Candidates
            </button>
            <button
              onClick={() => handleTabChange("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "active"
                  ? darkMode
                    ? "bg-green-600 text-white shadow-md shadow-green-500/10"
                    : "bg-green-500 text-white shadow-md shadow-green-500/20"
                  : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Active</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange("interviewing")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "interviewing"
                  ? darkMode
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Interviewing</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange("hired")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "hired"
                  ? darkMode
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                    : "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                  : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" 
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span>Hired</span>
              </div>
            </button>
          </div>
          
          {/* Activity period selector */}
          <div>
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
          </div>
        </div>
        
        {/* View & Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-6">
          {/* View Controls */}
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
          
          {/* Filter and Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filter Button */}
            <button
              onClick={toggleFilterPanel}
              className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
              }`}
            >
              <Sliders className="h-4 w-4 mr-2" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${showFilterPanel ? "rotate-180" : "rotate-0"}`} />
            </button>
            
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-700 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200`}
              >
                <option value="name">Sort by Name</option>
                <option value="experience">Sort by Experience</option>
                <option value="matchScore">Sort by Match Score</option>
              </select>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-700 border-gray-200"
                } border focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow duration-200`}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Expanded Filter Panel */}
        {showFilterPanel && (
          <div className={`mb-6 p-4 rounded-xl ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-md"
          } transition-all duration-300`}>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              darkMode={darkMode}
              layout={layout}
              setLayout={setLayout}
            />
          </div>
        )}
          
        {/* Results Count */}
        <div className={`flex flex-wrap items-center justify-between mb-5 px-4 py-3 rounded-lg ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <Filter className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Showing <span className="font-medium">{filteredCandidates.length}</span> of <span className="font-medium">{enhancedCandidates.length}</span> candidates
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
          
        {/* Candidate Display */}
        {layout === "grid" ? (
          <div className="mb-10">
            <CandidateGrid
              candidates={filteredCandidates}
              darkMode={darkMode}
            />
          </div>
        ) : (
          <div className="mb-10">
            <CandidateList
              candidates={filteredCandidates}
              darkMode={darkMode}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;