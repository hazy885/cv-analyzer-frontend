import React, { useState, useEffect } from "react";
import { useDarkMode } from "../components/ui/DarkModeContext"; 
import { Sliders, ChevronDown } from "lucide-react";

// Components
import Header from "../components/dashboard/Navbar";
import FilterPanel from "../components/dashboard/FilterPanel";
import CandidateGrid from "../components/dashboard/CandidateGrid";
import CandidateList from "../components/dashboard/CandidateList";
import TopCandidateRanking from "../components/dashboard/TopCandidateRanking";
import DashboardStats from "../components/dashboard/DashboardStats";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import DashboardTabs from "../components/dashboard/DashboardTabs";
import PeriodSelector from "../components/dashboard/PeriodSelector";
import ViewControls from "../components/dashboard/ViewControls";
import ResultsHeader from "../components/dashboard/ResultsHeader";

// Sample data
import { candidates } from "../data";

// Define interfaces
interface Candidate {
  id: number | string;
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
  
  // State management
  const [filters, setFilters] = useState({
    experience: "all",
    status: "all",
    search: "",
    minSalary: 0,
    location: "all",
    skills: [],
    education: "all"
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

  // Transform original candidates data
  const enhancedCandidates: Candidate[] = candidates.map((candidate, index) => ({
    id: candidate.id !== undefined ? candidate.id : index + 1,
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

  // Calculate dashboard statistics
  useEffect(() => {
    setDashboardStats({
      total: enhancedCandidates.length,
      active: enhancedCandidates.filter(c => c.status.toLowerCase() === "active").length,
      senior: enhancedCandidates.filter(c => c.experience >= 5).length,
      newThisWeek: enhancedCandidates.filter(c => c.applied?.includes("2023") || Math.random() > 0.7).length,
      interviews: enhancedCandidates.filter(c => c.status.toLowerCase() === "interviewing").length,
      hired: enhancedCandidates.filter(c => c.status.toLowerCase() === "hired").length
    });
  }, [enhancedCandidates]);

  // Filter logic
  const filteredCandidates = enhancedCandidates
    .filter((candidate) => {
      // Basic filters
      if (filters.experience !== "all") {
        if (filters.experience === "0-1" && candidate.experience > 1) return false;
        if (filters.experience === "1-3" && (candidate.experience < 1 || candidate.experience > 3)) return false;
        if (filters.experience === "3-5" && (candidate.experience < 3 || candidate.experience > 5)) return false;
        if (filters.experience === "5-10" && (candidate.experience < 5 || candidate.experience > 10)) return false;
        if (filters.experience === "10+" && candidate.experience < 10) return false;
      }
      
      if (filters.status !== "all" && candidate.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.search && !candidate.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (candidate.salary < filters.minSalary) return false;
      
      // Location filter
      if (filters.location && filters.location !== "all" && 
          !candidate.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      // Skills filtering
      if (filters.skills.length > 0) {
        const hasRequiredSkills = filters.skills.some(skill => 
          candidate.skills?.some(candidateSkill => 
            candidateSkill.toLowerCase() === skill.toLowerCase()
          )
        );
        if (!hasRequiredSkills) return false;
      }
      
      // Education filter
      if (filters.education && filters.education !== "all") return false;
      
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

  // Calculate match score
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
    const seedValue = Number(candidate.id) * 100 + position.id;
    const pseudoRandom = (seedValue % 10); // 0-9 range
    
    return Math.min(score + pseudoRandom, 100);
  };

  // Apply match scores based on selected position
  const candidatesWithScores = enhancedCandidates.map(candidate => ({
    ...candidate,
    matchScore: calculateMatchScore(candidate, selectedPosition)
  }));

  // Get top candidates ranked by match score
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
        toggleFilterPanel={toggleFilterPanel}
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
        </div>
      
        {/* Dashboard Stats */}
        <DashboardStats 
          stats={dashboardStats} 
          darkMode={darkMode} 
          activityPeriod={activityPeriod} 
        />
          
        {/* AI Assistant Card */}
        <AIInsightCard 
          selectedPosition={selectedPosition} 
          matchCount={rankedCandidates.length} 
          darkMode={darkMode} 
        />
          
        {/* Top Candidates Ranking Section */}
        <TopCandidateRanking
          rankedCandidates={rankedCandidates}
          selectedPosition={selectedPosition}
          darkMode={darkMode}
          setSelectedPosition={setSelectedPosition}
          positions={positions}
        />
        
        {/* Divider */}
        <div className="mb-6 bg-gradient-to-r from-transparent via-gray-200/10 to-transparent h-px"></div>
        
        {/* Tabs and Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Tabs for quick status filtering */}
          <DashboardTabs 
            activeTab={activeTab} 
            handleTabChange={handleTabChange} 
            darkMode={darkMode} 
          />
          
          {/* Activity period selector */}
          <PeriodSelector 
            activityPeriod={activityPeriod} 
            handlePeriodChange={handlePeriodChange} 
            darkMode={darkMode} 
          />
        </div>
        
        {/* View & Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-6">
          {/* View Controls */}
          <ViewControls 
            layout={layout} 
            setLayout={setLayout} 
            darkMode={darkMode} 
          />
          
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
        </div>
        
        {/* Expanded Filter Panel */}
        {showFilterPanel && (
          <div className="mb-6">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              darkMode={darkMode}
              layout={layout}
              setLayout={setLayout}
              resultCount={filteredCandidates.length}
            />
          </div>
        )}
          
        {/* Results Header */}
        <ResultsHeader 
          filteredCount={filteredCandidates.length} 
          totalCount={enhancedCandidates.length} 
          darkMode={darkMode} 
        />
          
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