import React, { useState, useCallback } from "react";
import { 
  Search, Grid3X3, List, ChevronDown, ChevronUp, 
  SlidersHorizontal, UserCheck, Briefcase, DollarSign, X,
  MapPin, Calendar, Filter, Save, Trash2, Users
} from "lucide-react";

// Types
interface FilterValues {
  experience: string;
  status: string;
  search: string;
  minSalary: number;
  location?: string;
  skills?: string[];
  education?: string;
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
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState([
    { name: "Senior Developers", count: 24 },
    { name: "Recent Applicants", count: 47 }
  ]);

  // Filter options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "interviewing", label: "Interviewing", color: "bg-blue-500" },
    { value: "hired", label: "Hired", color: "bg-purple-500" },
    { value: "rejected", label: "Rejected", color: "bg-red-500" }
  ];

  const experienceOptions = [
    { value: "all", label: "Any Experience" },
    { value: "0-1", label: "0-1 Years" },
    { value: "1-3", label: "1-3 Years" },
    { value: "3-5", label: "3-5 Years" },
    { value: "5-10", label: "5-10 Years" },
    { value: "10+", label: "10+ Years" }
  ];

  const locationOptions = [
    { value: "all", label: "All Locations" },
    { value: "remote", label: "Remote" },
    { value: "cape town", label: "Cape Town" },
    { value: "johannesburg", label: "Johannesburg" },
    { value: "durban", label: "Durban" }
  ];

  const educationOptions = [
    { value: "all", label: "Any Education" },
    { value: "high school", label: "High School" },
    { value: "bachelor's", label: "Bachelor's Degree" },
    { value: "master's", label: "Master's Degree" },
    { value: "phd", label: "PhD" }
  ];
  
  const skills = [
    "React", "JavaScript", "TypeScript", "Node.js", 
    "Python", "Java", "UI/UX", "DevOps"
  ];

  // Calculate active filters count
  const activeFilterCount = 
    (filters.status !== 'all' ? 1 : 0) +
    (filters.experience !== 'all' ? 1 : 0) +
    (filters.location && filters.location !== 'all' ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.minSalary > 0 ? 1 : 0) +
    (filters.skills?.length || 0) +
    (filters.education && filters.education !== 'all' ? 1 : 0);

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
      education: "all"
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

  // Custom select component
  const CustomSelect = ({ 
    options, 
    value, 
    onChange, 
    icon, 
    label, 
    darkMode 
  }: { 
    options: any[], 
    value: string, 
    onChange: (value: string) => void, 
    icon: React.ReactNode, 
    label: string, 
    darkMode: boolean 
  }) => (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {React.cloneElement(icon as React.ReactElement, { 
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
  const SkillTag = ({ 
    skill, 
    isSelected, 
    onToggle, 
    darkMode 
  }: { 
    skill: string, 
    isSelected: boolean, 
    onToggle: () => void, 
    darkMode: boolean 
  }) => (
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

  return (
    <>
      {/* Include CSS animations */}
      <style>{animationStyle}</style>
      
      <div className={`${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-200"} 
        rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300`}>
        
        {/* Header with filter count */}
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                <SlidersHorizontal className={`h-5 w-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Filters
                </h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {activeFilterCount > 0 ? 
                    `${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}` : 
                    'No active filters'}
                </p>
              </div>
            </div>
            
            <div className={`px-3 py-1.5 rounded-lg flex items-center ${
              darkMode ? "bg-blue-900/20 text-blue-300" : "bg-blue-50 text-blue-700"
            }`}>
              <Users className="h-4 w-4 mr-1.5" />
              <span className="font-medium">{resultCount} candidates</span>
            </div>
          </div>
          
          {/* Active filter tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.status !== 'all' && (
                <ActiveFilterTag 
                  label={`Status: ${filters.status}`} 
                  onRemove={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                  darkMode={darkMode}
                />
              )}
              
              {filters.experience !== 'all' && (
                <ActiveFilterTag 
                  label={`Experience: ${filters.experience}`} 
                  onRemove={() => setFilters(prev => ({ ...prev, experience: 'all' }))}
                  darkMode={darkMode}
                />
              )}
              
              {filters.location && filters.location !== 'all' && (
                <ActiveFilterTag 
                  label={`Location: ${filters.location}`} 
                  onRemove={() => setFilters(prev => ({ ...prev, location: 'all' }))}
                  darkMode={darkMode}
                />
              )}
              
              {filters.education && filters.education !== 'all' && (
                <ActiveFilterTag 
                  label={`Education: ${filters.education}`} 
                  onRemove={() => setFilters(prev => ({ ...prev, education: 'all' }))}
                  darkMode={darkMode}
                />
              )}
              
              {filters.skills && filters.skills.length > 0 && filters.skills.map((skill: string, index: number) => (
                <ActiveFilterTag 
                  key={`skill-${index}`} 
                  label={`Skill: ${skill}`} 
                  onRemove={() => toggleSkill(skill)}
                  darkMode={darkMode}
                />
              ))}
              
              {filters.minSalary > 0 && (
                <ActiveFilterTag 
                  label={`Min Salary: R${filters.minSalary.toLocaleString()}`} 
                  onRemove={() => setFilters(prev => ({ ...prev, minSalary: 0 }))}
                  darkMode={darkMode}
                />
              )}
              
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
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setFilters(prev => ({ ...prev, search: e.target.value }));
                }}
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
                R{filters.minSalary.toLocaleString()}
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
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>R0</span>
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>R200,000</span>
            </div>
          </div>
          
          {/* Skills Filter */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Skills
            </label>
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
          </div>
          
          {/* Education */}
          <div className="mb-6">
            <CustomSelect
              options={educationOptions}
              value={filters.education || 'all'}
              onChange={(value) => setFilters((prev: FilterValues) => ({ ...prev, education: value }))}
              icon={<Calendar />}
              label="Education Level"
              darkMode={darkMode}
            />
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
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;