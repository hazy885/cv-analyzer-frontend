import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Mail, 
  MapPin, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Linkedin
} from 'lucide-react';
import { useDarkMode } from '../components/ui/DarkModeContext';

// Types for Candidate
interface Candidate {
  _id: string;
  name: string;
  email?: string[];
  role?: string;
  headline?: string;
  location?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  linkedin_url?: string;
  status?: 'Active' | 'Inactive' | 'Interviewing' | 'Hired';
  _profile_id?: string;
  _last_updated?: string;
}

// API Utility
const fetchLinkedInProfiles = async (): Promise<Candidate[]> => {
  try {
    // This endpoint should return all LinkedIn profiles from your MongoDB
    const response = await fetch('http://localhost:8888/api/linkedin/profiles');
    if (!response.ok) {
      throw new Error('Failed to fetch LinkedIn profiles');
    }
    const data = await response.json();
    console.log('Fetched LinkedIn profiles:', data);
    
    // Transform the LinkedIn profile data to match the Candidate interface
    const candidates = data.profiles.map((profile: any) => transformProfileToCandidate(profile));
    
    return candidates;
  } catch (error) {
    console.error('Error fetching LinkedIn profiles:', error);
    return [];
  }
};

// Transform LinkedIn profile data to Candidate format
const transformProfileToCandidate = (profile: any): Candidate => {
  return {
    _id: profile._id || profile._profile_id || Math.random().toString(36).substr(2, 9),
    name: profile.full_name || profile.name || 'Unknown Name',
    email: profile.email_address ? [profile.email_address] : [],
    role: profile.headline || getLatestExperience(profile),
    headline: profile.headline,
    location: profile.location?.country 
      ? `${profile.location.city || ''}, ${profile.location.country}` 
      : (profile.location || ''),
    skills: Array.isArray(profile.skills) 
      ? profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name) 
      : [],
    experience: Array.isArray(profile.experiences) ? profile.experiences : [],
    education: Array.isArray(profile.education) ? profile.education : [],
    certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
    linkedin_url: profile.public_identifier 
      ? `https://www.linkedin.com/in/${profile.public_identifier}/` 
      : profile.linkedin_url,
    status: 'Active', // Default status
    _profile_id: profile._profile_id || profile.public_identifier,
    _last_updated: profile._last_updated
  };
};

// Helper to get the latest job title from experiences
const getLatestExperience = (profile: any): string => {
  if (!profile.experiences || !Array.isArray(profile.experiences) || profile.experiences.length === 0) {
    return 'No position listed';
  }
  
  const latestExp = profile.experiences[0];
  if (typeof latestExp === 'string') {
    return latestExp.split(' at ')[0] || latestExp;
  }
  
  return latestExp.title || 'No position listed';
};

const Candidates: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch candidates on component mount
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      const fetchedProfiles = await fetchLinkedInProfiles();
      setCandidates(fetchedProfiles);
      setFilteredCandidates(fetchedProfiles);
      setIsLoading(false);
    };
    loadProfiles();
  }, []);

  // Filter candidates based on search and status
  useEffect(() => {
    let result = candidates;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(candidate => 
        (candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (candidate.role?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (candidate.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (candidate.email?.some(email => email.toLowerCase().includes(searchTerm.toLowerCase())) ?? false)
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      result = result.filter(candidate => candidate.status === statusFilter);
    }

    setFilteredCandidates(result);
  }, [searchTerm, statusFilter, candidates]);

  // Status color mapping
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active': return darkMode 
        ? 'bg-green-900/30 text-green-300 border border-green-800/30' 
        : 'bg-green-100 text-green-800';
      case 'Interviewing': return darkMode
        ? 'bg-blue-900/30 text-blue-300 border border-blue-800/30'
        : 'bg-blue-100 text-blue-800';
      case 'Hired': return darkMode
        ? 'bg-purple-900/30 text-purple-300 border border-purple-800/30'
        : 'bg-purple-100 text-purple-800';
      case 'Inactive': return darkMode
        ? 'bg-gray-900/30 text-gray-300 border border-gray-800/30'
        : 'bg-gray-100 text-gray-800';
      default: return darkMode 
        ? 'bg-green-900/30 text-green-300 border border-green-800/30' 
        : 'bg-green-100 text-green-800';
    }
  };

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          LinkedIn Profiles
        </h1>
        <a 
          href="/import"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${darkMode 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          <Plus size={20} />
          Add LinkedIn Profile
        </a>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search profiles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${darkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900'}`}
          />
          <Search 
            size={20} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 
              ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} 
          />
        </div>

        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`appearance-none w-full pl-4 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${darkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Hired">Hired</option>
            <option value="Inactive">Inactive</option>
          </select>
          <Filter 
            size={20} 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 
              ${darkMode ? 'text-gray-400' : 'text-gray-400'} pointer-events-none`} 
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={`text-center py-12 rounded-lg
          ${darkMode 
            ? 'bg-gray-800 text-gray-400' 
            : 'bg-gray-50 text-gray-600'}`}>
          <p className="text-lg">Loading LinkedIn profiles...</p>
        </div>
      )}

      {/* Candidates List */}
      {!isLoading && (
        <div className="grid gap-4">
          {filteredCandidates.map((candidate) => (
            <div 
              key={candidate._id} 
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <h2 className={`text-xl font-semibold mr-3 
                      ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                      {candidate.name}
                    </h2>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(candidate.status)}`}
                    >
                      {candidate.status || 'Active'}
                    </span>
                  </div>
                  <div className={`flex flex-wrap items-center gap-3 mb-3 
                    ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {candidate.role && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span>{candidate.role}</span>
                      </div>
                    )}
                    {candidate.email && candidate.email.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span>{candidate.email[0]}</span>
                      </div>
                    )}
                    {candidate.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span>{candidate.location}</span>
                      </div>
                    )}
                    {candidate.linkedin_url && (
                      <div className="flex items-center gap-2">
                        <Linkedin size={16} className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                        <a 
                          href={candidate.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Updated: {formatDate(candidate._last_updated)}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 rounded-full text-xs
                          ${darkMode 
                            ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' 
                            : 'bg-blue-50 text-blue-700 border border-blue-200'}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {candidate.certifications && candidate.certifications.length > 0 && (
                <div className="mb-4">
                  <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.certifications.map((cert, index) => {
                      const certText = typeof cert === 'string' ? cert : (cert.name || 'Unknown Certification');
                      return (
                        <span 
                          key={index} 
                          className={`px-2 py-1 rounded-full text-xs
                            ${darkMode 
                              ? 'bg-purple-900/20 text-purple-300 border border-purple-800/30' 
                              : 'bg-purple-50 text-purple-700 border border-purple-200'}`}
                        >
                          {certText}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-3">
                <button 
                  className={`p-2 rounded-full transition-colors
                    ${darkMode 
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-blue-300' 
                      : 'hover:bg-blue-50 text-blue-600'}`}
                  title="Edit Candidate"
                >
                  <Edit size={20} />
                </button>
                <button 
                  className={`p-2 rounded-full transition-colors
                    ${darkMode 
                      ? 'hover:bg-gray-700 text-gray-300 hover:text-red-300' 
                      : 'hover:bg-red-50 text-red-600'}`}
                  title="Delete Candidate"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Candidates Message */}
      {!isLoading && filteredCandidates.length === 0 && (
        <div className={`text-center py-12 rounded-lg
          ${darkMode 
            ? 'bg-gray-800 text-gray-400' 
            : 'bg-gray-50 text-gray-600'}`}>
          <p className="text-lg">
            No LinkedIn profiles found. 
            {searchTerm || statusFilter !== 'All' 
              ? " Try adjusting your search or filter." 
              : " Add your first LinkedIn profile!"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Candidates;