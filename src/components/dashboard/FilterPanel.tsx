import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Search, Grid3X3, List, ChevronDown, ChevronUp, ChevronRight,
  SlidersHorizontal, UserCheck, Briefcase, DollarSign, X,
  MapPin, GraduationCap, Calendar, Clock, BookmarkPlus, BookmarkCheck,
  Globe, Building, Filter, Save, Trash2, Users, Tag, Info,
  Layers, Award, Sparkles, AlertCircle, FileCheck, Heart
} from "lucide-react";

// Types
interface FilterOption {
  value: string;
  label: string;
  icon?: JSX.Element; 
  color?: string;
}

export interface FilterValues {
  experience: string;
  status: string;
  search: string;
  minSalary: number;
  location?: string;
  skills?: string[];
  education?: string;
  availability?: string;
  source?: string;
  applicationDate?: string;
  workAuth?: string;
  isFavorite?: boolean;
  assessmentScore?: number;
  department?: string;
}

interface FilterPanelProps {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  darkMode: boolean;
  layout?: string;
  setLayout?: React.Dispatch<React.SetStateAction<string>>;
  resultCount?: number;
}

// CSS Animation for filter changes
const animationStyle = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.25s ease-out forwards;
  }
  
  @keyframes highlight {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(59, 130, 246, 0.1); }
  }
  .animate-highlight {
    animation: highlight 1s ease-out;
  }
`;

// Component for active filter tags
const ActiveFilterTag: React.FC<{
  label: string;
  onRemove: () => void;
  darkMode: boolean;
}> = ({ label, onRemove, darkMode }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium animate-fadeIn
    ${darkMode 
      ? "bg-blue-900/30 text-blue-300 border border-blue-800/30" 
      : "bg-blue-50 text-blue-700 border border-blue-200"}
  `}>
    <span>{label}</span>
    <button 
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
      className={`p-0.5 rounded-full hover:bg-black/10 transition-colors`}
    >
      <X className="h-3 w-3" />
    </button>
  </div>
);

// Filter section component
const FilterSection: React.FC<{
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
  darkMode: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ title, icon, children, darkMode, isOpen, toggleOpen }) => (
  <div className={`p-4 rounded-lg ${
    darkMode ? "bg-gray-800/70" : "bg-gray-50"
  } transition-colors`}>
    <button 
      onClick={toggleOpen}
      className="w-full flex items-center justify-between"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-2">
        {React.cloneElement(icon, { 
          className: `h-4 w-4 ${darkMode ? "text-blue-400" : "text-blue-600"}` 
        })}
        <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
          {title}
        </span>
      </div>
      {isOpen 
        ? <ChevronUp className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} /> 
        : <ChevronDown className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
      }
    </button>
    
    {isOpen && (
      <div className="mt-3 animate-fadeIn">
        {children}
      </div>
    )}
  </div>
);

// Custom dropdown select component
const CustomSelect: React.FC<{
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon: JSX.Element;
  label: string;
  darkMode: boolean;
  placeholder?: string;
}> = ({ options, value, onChange, icon, label, darkMode, placeholder }) => (
  <div>
    <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        {React.cloneElement(icon, { 
          className: `h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}` 
        })}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={`pl-10 pr-10 py-2.5 w-full rounded-lg appearance-none ${
          darkMode
            ? "bg-gray-700/70 text-white border-gray-600 focus:border-blue-500" 
            : "bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500"
        } border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
        {value !== 'all' && options.find(o => o.value === value)?.color ? (
          <div className={`h-3 w-3 rounded-full ${options.find(o => o.value === value)?.color}`} />
        ) : (
          <ChevronDown className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
        )}
      </div>
    </div>
  </div>
);

// Skills tag component
const SkillTag: React.FC<{
  skill: string;
  isSelected: boolean;
  onToggle: () => void;
  darkMode: boolean;
}> = ({ skill, isSelected, onToggle, darkMode }) => (
  <button
    onClick={onToggle}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
      isSelected
        ? darkMode
          ? "bg-blue-900/40 text-blue-300 border-blue-700"
          : "bg-blue-100 text-blue-700 border-blue-300"
        : darkMode
          ? "bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700"
          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
    }`}
    aria-pressed={isSelected}
  >
    {skill}
  </button>
);

// Main FilterPanel component
const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  setFilters, 
  darkMode,
  layout = "grid",
  setLayout = () => {},
  resultCount = 0
}) => {
  // State management
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [openSections, setOpenSections] = useState({
    basic: true,
    skills: false,
    education: false,
    workDetails: false
  });
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState([
    { name: "Senior Developers", count: 24 },
    { name: "Recent Applicants", count: 47 }
  ]);
  const [showFilterSaveDialog, setShowFilterSaveDialog] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");

  // Sync search input with filters
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Apply search after typing stops (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput }));
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setFilters]);

  // Toggle sections open/closed
  const toggleSection = useCallback((section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Filter options
  const statusOptions = useMemo(() => [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "interviewing", label: "Interviewing", color: "bg-blue-500" },
    { value: "hired", label: "Hired", color: "bg-purple-500" },
    { value: "rejected", label: "Rejected", color: "bg-red-500" }
  ], []);

  const experienceOptions = useMemo(() => [
    { value: "all", label: "Any Experience" },
    { value: "0-1", label: "0-1 Years" },
    { value: "1-3", label: "1-3 Years" },
    { value: "3-5", label: "3-5 Years" },
    { value: "5-10", label: "5-10 Years" },
    { value: "10+", label: "10+ Years" }
  ], []);

  const locationOptions = useMemo(() => [
    { value: "all", label: "All Locations" },
    { value: "remote", label: "Remote", icon: <Globe /> },
    { value: "hybrid", label: "Hybrid", icon: <Building /> },
    { value: "on-site", label: "On-Site", icon: <Building /> },
    { value: "relocate", label: "Willing to Relocate", icon: <MapPin /> }
  ], []);

  const educationOptions = useMemo(() => [
    { value: "all", label: "Any Education" },
    { value: "high school", label: "High School" },
    { value: "bachelor's", label: "Bachelor's Degree" },
    { value: "master's", label: "Master's Degree" },
    { value: "phd", label: "PhD" }
  ], []);
  
  const skills = useMemo(() => [
    "React", "JavaScript", "TypeScript", "Node.js", 
    "Python", "Java", "UI/UX", "DevOps", 
    "Product Management", "Data Science"
  ], []);

  const availabilityOptions = useMemo(() => [
    { value: "all", label: "Any Availability" },
    { value: "immediate", label: "Immediate" },
    { value: "2 weeks", label: "2 Weeks Notice" },
    { value: "1 month", label: "1 Month Notice" },
    { value: "3 months", label: "3+ Months Notice" }
  ], []);

  const applicationDateOptions = useMemo(() => [
    { value: "all", label: "Any Time" },
    { value: "today", label: "Today" },
    { value: "this week", label: "This Week" },
    { value: "this month", label: "This Month" },
    { value: "last 3 months", label: "Last 3 Months" },
    { value: "older", label: "Older" }
  ], []);

  // Calculate active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.experience !== 'all') count++;
    if (filters.location && filters.location !== 'all') count++;
    if (filters.search) count++;
    if (filters.minSalary > 0) count++;
    if (filters.skills && filters.skills.length > 0) count += filters.skills.length;
    if (filters.education && filters.education !== 'all') count++;
    if (filters.availability && filters.availability !== 'all') count++;
    if (filters.applicationDate && filters.applicationDate !== 'all') count++;
    if (filters.workAuth && filters.workAuth !== 'all') count++;
    if (filters.isFavorite) count++;
    if (filters.department && filters.department !== 'all') count++;
    
    return count;
  }, [filters]);

  // Helper functions
  const clearSearch = useCallback(() => {
    setSearchInput("");
    setFilters(prev => ({ ...prev, search: "" }));
  }, [setFilters]);

  const resetAllFilters = useCallback(() => {
    setFilters({
      experience: "all",
      status: "all",
      search: "",
      minSalary: 0,
      location: "all",
      skills: [],
      education: "all",
      availability: "all",
      source: "all",
      applicationDate: "all",
      workAuth: "all",
      isFavorite: false,
      assessmentScore: 0,
      department: "all"
    });
    setSearchInput("");
  }, [setFilters]);

  const toggleSkill = useCallback((skill: string) => {
    setFilters(prev => {
      const currentSkills = prev.skills || [];
      if (currentSkills.includes(skill)) {
        return {
          ...prev,
          skills: currentSkills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          skills: [...currentSkills, skill]
        };
      }
    });
  }, [setFilters]);

  const toggleFavorite = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      isFavorite: !prev.isFavorite
    }));
  }, [setFilters]);

  const saveCurrentFilter = useCallback(() => {
    if (newFilterName.trim()) {
      setSavedFilters(prev => [
        ...prev,
        { name: newFilterName, count: resultCount }
      ]);
      setNewFilterName("");
      setShowFilterSaveDialog(false);
    }
  }, [newFilterName, resultCount]);

  const loadSavedFilter = useCallback((filterName: string) => {
    // In a real app, this would load the saved filter configuration
    alert(`Loading saved filter: ${filterName}`);
  }, []);

  const removeSavedFilter = useCallback((index: number) => {
    setSavedFilters(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  // Render active filter tags for quick removal
  const renderActiveFilterTags = useMemo(() => {
    const tags = [];
    
    if (filters.status !== 'all') {
      tags.push(
        <ActiveFilterTag 
          key="status" 
          label={`Status: ${filters.status}`} 
          onRemove={() => setFilters(prev => ({ ...prev, status: 'all' }))}
          darkMode={darkMode}
        />
      );
    }
    
    if (filters.experience !== 'all') {
      tags.push(
        <ActiveFilterTag 
          key="experience" 
          label={`Experience: ${filters.experience}`} 
          onRemove={() => setFilters(prev => ({ ...prev, experience: 'all' }))}
          darkMode={darkMode}
        />
      );
    }
    
    if (filters.location && filters.location !== 'all') {
      tags.push(
        <ActiveFilterTag 
          key="location" 
          label={`Location: ${filters.location}`} 
          onRemove={() => setFilters(prev => ({ ...prev, location: 'all' }))}
          darkMode={darkMode}
        />
      );
    }
    
    if (filters.education && filters.education !== 'all') {
      tags.push(
        <ActiveFilterTag 
          key="education" 
          label={`Education: ${filters.education}`} 
          onRemove={() => setFilters(prev => ({ ...prev, education: 'all' }))}
          darkMode={darkMode}
        />
      );
    }
    
    if (filters.isFavorite) {
      tags.push(
        <ActiveFilterTag 
          key="favorite" 
          label="Favorites only" 
          onRemove={() => setFilters(prev => ({ ...prev, isFavorite: false }))}
          darkMode={darkMode}
        />
      );
    }
    
    if (filters.skills && filters.skills.length > 0) {
      filters.skills.forEach((skill, index) => {
        tags.push(
          <ActiveFilterTag 
            key={`skill-${index}`} 
            label={`Skill: ${skill}`} 
            onRemove={() => toggleSkill(skill)}
            darkMode={darkMode}
          />
        );
      });
    }
    
    return tags;
  }, [filters, setFilters, toggleSkill, darkMode]);

  return (
    <>
      {/* Include CSS animations */}
      <style>{animationStyle}</style>
      
      <div className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-200"} 
        rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300`}>
        
        {/* Header with filter count and saved filters toggle */}
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                <SlidersHorizontal className={`h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Talent Filters
                </h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {activeFilterCount > 0 ? 
                    `${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}` : 
                    'No active filters'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSavedFilters(!showSavedFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showSavedFilters
                    ? darkMode 
                      ? "bg-blue-900/30 text-blue-300" 
                      : "bg-blue-100 text-blue-700"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Toggle saved filters"
                aria-pressed={showSavedFilters}
              >
                <BookmarkCheck className="h-5 w-5" />
              </button>
              
              <div className={`px-3 py-1.5 rounded-lg flex items-center ${
                darkMode ? "bg-blue-900/20 text-blue-300" : "bg-blue-50 text-blue-700"
              }`}>
                <Users className="h-4 w-4 mr-1.5" />
                <span className="font-medium">{resultCount} candidates</span>
              </div>
            </div>
          </div>
          
          {/* Saved Filters Section */}
          {showSavedFilters && (
            <div className="mb-4 pb-3 border-b animate-fadeIn
              border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Saved Filters
                </h3>
                <button
                  onClick={() => setShowFilterSaveDialog(!showFilterSaveDialog)}
                  className={`text-xs px-2 py-1 rounded ${
                    darkMode 
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showFilterSaveDialog ? "Cancel" : "+ Save Current"}
                </button>
              </div>
              
              {/* Save Filter Dialog */}
              {showFilterSaveDialog && (
                <div className={`p-3 mb-3 rounded-lg ${
                  darkMode ? "bg-gray-700/50" : "bg-gray-50"
                } animate-fadeIn`}>
                  <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Filter Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFilterName}
                      onChange={(e) => setNewFilterName(e.target.value)}
                      placeholder="e.g., Senior Developers"
                      className={`flex-1 px-3 py-1.5 rounded-lg ${
                        darkMode 
                          ? "bg-gray-800 text-white placeholder-gray-400 border-gray-600" 
                          : "bg-white text-gray-900 placeholder-gray-500 border-gray-300"
                      } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                    <button
                      onClick={saveCurrentFilter}
                      disabled={!newFilterName.trim()}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        darkMode 
                          ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-500" 
                          : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-200 disabled:text-gray-400"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
              
              {/* List of saved filters */}
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((filter, index) => (
                  <div 
                    key={index}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                      darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => loadSavedFilter(filter.name)}
                      className="flex items-center gap-1.5"
                    >
                      <BookmarkCheck className="h-3.5 w-3.5" />
                      <span>{filter.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"
                      }`}>
                        {filter.count}
                      </span>
                    </button>
                    <button
                      onClick={() => removeSavedFilter(index)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={`Remove ${filter.name} filter`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {savedFilters.length === 0 && (
                  <p className={`text-xs italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    No saved filters yet. Save your current filters for quick access.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {renderActiveFilterTags}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${
                    darkMode 
                      ? "bg-red-900/30 text-red-300 border border-red-800/30" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <Trash2 className="h-3 w-3" />
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Main filter body */}
        <div className="px-6 pb-6">
          {/* Search Input */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, skills, or keywords..."
                className={`pl-10 pr-10 py-2.5 w-full rounded-lg ${
                  darkMode 
                    ? "bg-gray-700/70 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500" 
                    : "bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500"
                } border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                aria-label="Search candidates"
              />
              {searchInput && (
                <button 
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5"
                  aria-label="Clear search"
                >
                  <X className={`h-4 w-4 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} transition-colors`} />
                </button>
              )}
            </div>
          </div>
          
          {/* Quick Filters (always visible) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <CustomSelect
              options={statusOptions}
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              icon={<UserCheck />}
              label="Status"
              darkMode={darkMode}
            />
            
            <CustomSelect
              options={experienceOptions}
              value={filters.experience}
              onChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}
              icon={<Briefcase />}
              label="Experience"
              darkMode={darkMode}
            />
            
            <CustomSelect
              options={locationOptions}
              value={filters.location || 'all'}
              onChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
              icon={<MapPin />}
              label="Location"
              darkMode={darkMode}
            />
          </div>
          
          {/* Salary Range */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1.5" />
                  <span>Minimum Salary</span>
                </div>
              </label>
              <span className={`text-sm font-medium px-2.5 py-1 rounded-md ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                ${filters.minSalary.toLocaleString()}
              </span>
            </div>
            <div className={`h-10 flex items-center ${darkMode ? "px-1" : ""}`}>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={filters.minSalary}
                onChange={(e) => setFilters((prev: FilterValues) => ({ ...prev, minSalary: parseInt(e.target.value) }))}
                className={`w-full h-2 appearance-none cursor-pointer rounded-lg
                  ${darkMode ? "bg-gradient-to-r from-gray-700 to-gray-600" : "bg-gradient-to-r from-blue-100 to-blue-200"} 
                  accent-blue-500 focus:outline-none`}
                aria-label="Minimum salary"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>$0</span>
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>$200,000</span>
            </div>
          </div>
          
          {/* Toggle button for additional filters */}
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className={`w-full mb-6 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
              darkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-expanded={showAllFilters}
          >
            {showAllFilters ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Show Fewer Filters</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Show More Filters</span>
              </>
            )}
          </button>
          
          {/* Additional Filters (collapsible) */}
          {showAllFilters && (
            <div className="space-y-4 animate-fadeIn">
              {/* Skills Filter */}
              <FilterSection
                title="Technical Skills"
                icon={<Tag />}
                darkMode={darkMode}
                isOpen={openSections.skills}
                toggleOpen={() => toggleSection('skills')}
              >
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      isSelected={(filters.skills || []).includes(skill)}
                      onToggle={() => toggleSkill(skill)}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              </FilterSection>
              
              {/* Education and Certification */}
              <FilterSection
                title="Education & Qualifications"
                icon={<GraduationCap />}
                darkMode={darkMode}
                isOpen={openSections.education}
                toggleOpen={() => toggleSection('education')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    options={educationOptions}
                    value={filters.education || 'all'}
                    onChange={(value) => setFilters((prev: FilterValues) => ({ ...prev, education: value }))}
                    icon={<GraduationCap />}
                    label="Education Level"
                    darkMode={darkMode}
                  />
                  
                  <div className="flex items-center">
                    <button
                      onClick={toggleFavorite}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        filters.isFavorite
                          ? darkMode
                            ? "bg-blue-900/30 text-blue-300 border border-blue-800/30"
                            : "bg-blue-100 text-blue-700 border border-blue-300"
                          : darkMode
                            ? "bg-gray-700/50 text-gray-300 border border-gray-600"
                            : "bg-gray-50 text-gray-700 border border-gray-300"
                      }`}
                      aria-pressed={filters.isFavorite}
                    >
                      <Heart className={`h-4 w-4 ${filters.isFavorite ? "fill-current" : ""}`} />
                      <span>Favorites Only</span>
                    </button>
                  </div>
                </div>
              </FilterSection>
              
              {/* Work Details */}
              <FilterSection
                title="Application Details"
                icon={<FileCheck />}
                darkMode={darkMode}
                isOpen={openSections.workDetails}
                toggleOpen={() => toggleSection('workDetails')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    options={availabilityOptions}
                    value={filters.availability || 'all'}
                    onChange={(value) => setFilters((prev: FilterValues) => ({ ...prev, availability: value }))}
                    icon={<Clock />}
                    label="Availability"
                    darkMode={darkMode}
                  />
                  
                  <CustomSelect
                    options={applicationDateOptions}
                    value={filters.applicationDate || 'all'}
                    onChange={(value) => setFilters((prev: FilterValues) => ({ ...prev, applicationDate: value }))}
                    icon={<Calendar />}
                    label="Application Date"
                    darkMode={darkMode}
                  />
                </div>
              </FilterSection>
            </div>
          )}
          
          {/* Info tip at bottom */}
          <div className={`mt-6 px-4 py-3 rounded-lg flex items-start gap-3 text-sm ${
            darkMode ? "bg-blue-900/20 text-blue-200" : "bg-blue-50 text-blue-700"
          }`}>
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>
              Using more specific filters will help you find the best candidates faster. 
              Try combining skills with experience level for better results.
            </p>
          </div>
        </div>
        
        {/* Footer controls */}
        <div className={`px-6 py-4 flex flex-wrap items-center justify-between border-t
          ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          {/* View toggle */}
          <div className={`flex p-1 rounded-lg mb-4 sm:mb-0 ${darkMode ? "bg-gray-700/70" : "bg-gray-100"}`}>
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-md transition-all duration-200 ${
                layout === "grid"
                  ? darkMode
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-blue-600 shadow-md"
                  : darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Grid view"
              aria-pressed={layout === "grid"}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`p-2 rounded-md transition-all duration-200 ${
                layout === "list"
                  ? darkMode
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-blue-600 shadow-md"
                  : darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="List view"
              aria-pressed={layout === "list"}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowFilterSaveDialog(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                darkMode 
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Save current filters"
            >
              <Save className="h-4 w-4" />
              <span>Save Filter</span>
            </button>
            
            <button 
              onClick={resetAllFilters}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                darkMode 
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label="Reset all filters"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset All</span>
            </button>
            
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                darkMode 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md shadow-blue-900/20" 
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
              }`}
              aria-label="Apply filters"
            >
              <span>Apply Filters</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;