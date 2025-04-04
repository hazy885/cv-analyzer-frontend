import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  GraduationCap,
  Building,
  Code,
  PenTool,
  Layout,
  Database,
  Megaphone,
  UserCheck,
  BarChart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  Star,
  Check,
  X
} from "lucide-react";
import { useDarkMode } from "../components/ui/DarkModeContext";

// Types for Candidate (from your LinkedIn API)
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
  status?: "Active" | "Inactive" | "Interviewing" | "Hired";
  _profile_id?: string;
  _last_updated?: string;
  
  // Match properties (added during matching)
  matchScore?: number;
  matchStrengths?: string[];
  matchWeaknesses?: string[];
}

// Position type for department positions
interface Position {
  id: number;
  title: string;
  department: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  minimumExperience: number; // in years
  level: 'Executive' | 'Management' | 'Senior' | 'Mid' | 'Junior';
}

// Department type
interface Department {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  positionCount: number;
  positions: Position[];
}

// API Utility (directly from your code)
const fetchLinkedInProfiles = async (): Promise<Candidate[]> => {
  try {
    // This endpoint should return all LinkedIn profiles from your MongoDB
    const response = await fetch("http://localhost:8888/api/linkedin/profiles");
    if (!response.ok) {
      throw new Error("Failed to fetch LinkedIn profiles");
    }
    const data = await response.json();
    console.log("Fetched LinkedIn profiles:", data);

    // Transform the LinkedIn profile data to match the Candidate interface
    const candidates = data.profiles.map((profile: any) =>
      transformProfileToCandidate(profile)
    );

    return candidates;
  } catch (error) {
    console.error("Error fetching LinkedIn profiles:", error);
    // Return empty array when there's an error - no mock data
    return [];
  }
};

// Transform LinkedIn profile data to Candidate format (from your code)
const transformProfileToCandidate = (profile: any): Candidate => {
  return {
    _id:
      profile._id ||
      profile._profile_id ||
      Math.random().toString(36).substr(2, 9),
    name: profile.full_name || profile.name || "Unknown Name",
    email: profile.email_address ? [profile.email_address] : [],
    role: profile.headline || getLatestExperience(profile),
    headline: profile.headline,
    location: profile.location?.country
      ? `${profile.location.city || ""}, ${profile.location.country}`
      : profile.location || "",
    skills: Array.isArray(profile.skills)
      ? profile.skills.map((skill: any) =>
          typeof skill === "string" ? skill : skill.name
        )
      : [],
    experience: Array.isArray(profile.experiences) ? profile.experiences : [],
    education: Array.isArray(profile.education) ? profile.education : [],
    certifications: Array.isArray(profile.certifications)
      ? profile.certifications
      : [],
    linkedin_url: profile.public_identifier
      ? `https://www.linkedin.com/in/${profile.public_identifier}/`
      : profile.linkedin_url,
    status: "Active", // Default status
    _profile_id: profile._profile_id || profile.public_identifier,
    _last_updated: profile._last_updated,
  };
};

// Helper to get the latest job title from experiences (from your code)
const getLatestExperience = (profile: any): string => {
  if (
    !profile.experiences ||
    !Array.isArray(profile.experiences) ||
    profile.experiences.length === 0
  ) {
    return "No position listed";
  }

  const latestExp = profile.experiences[0];
  if (typeof latestExp === "string") {
    return latestExp.split(" at ")[0] || latestExp;
  }

  return latestExp.title || "No position listed";
};

// Get summary education (from your code)
const getEducationSummary = (profile: any): string => {
  if (
    !profile.education ||
    !Array.isArray(profile.education) ||
    profile.education.length === 0
  ) {
    return "";
  }

  const edu = profile.education[0];
  if (typeof edu === "string") {
    return edu;
  }

  return edu.school || "";
};

// Helper to estimate years of experience from LinkedIn profile
const estimateYearsOfExperience = (candidate: Candidate): number => {
  if (!candidate.experience || !Array.isArray(candidate.experience) || candidate.experience.length === 0) {
    return 0;
  }

  let totalYears = 0;
  
  candidate.experience.forEach(exp => {
    if (typeof exp === 'string') {
      // If experience is a string, assume 1 year per entry as a rough estimate
      totalYears += 1;
      return;
    }
    
    // Try to extract years from dates
    let startYear: number | null = null;
    let endYear: number | null = null;
    
    if (exp.starts_at && exp.starts_at.year) {
      startYear = parseInt(exp.starts_at.year);
    } else if (exp.date_range) {
      const match = exp.date_range.match(/(\d{4})/g);
      if (match && match.length > 0) {
        startYear = parseInt(match[0]);
      }
    }
    
    if (exp.ends_at && exp.ends_at.year) {
      endYear = parseInt(exp.ends_at.year);
    } else if (exp.date_range && exp.date_range.includes('Present')) {
      endYear = new Date().getFullYear();
    } else if (exp.date_range) {
      const match = exp.date_range.match(/(\d{4})/g);
      if (match && match.length > 1) {
        endYear = parseInt(match[1]);
      }
    }
    
    if (startYear && endYear) {
      totalYears += (endYear - startYear);
    } else {
      // If we can't extract years, assume 2 years per position
      totalYears += 2;
    }
  });
  
  return totalYears;
};

// Department data with positions
const getDepartments = (): Department[] => {
  return [
    {
      id: 'engineering',
      name: 'Engineering',
      description: 'Build and maintain our software products and infrastructure',
      icon: <Code size={24} />,
      color: 'blue',
      positionCount: 3,
      positions: [
        {
          id: 1,
          title: 'Full Stack Developer',
          department: 'Engineering',
          description: 'Develop and maintain web applications using modern technologies',
          responsibilities: [
            'Build frontend UIs using React and TypeScript',
            'Develop backend APIs using Node.js',
            'Implement database models and queries',
            'Write automated tests for code',
            'Participate in code reviews and agile processes'
          ],
          requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
          preferredSkills: ['TypeScript', 'GraphQL', 'AWS', 'Docker', 'CI/CD'],
          minimumExperience: 3,
          level: 'Mid'
        },
        {
          id: 2,
          title: 'DevOps Engineer',
          department: 'Engineering',
          description: 'Manage our cloud infrastructure and deployment processes',
          responsibilities: [
            'Configure and maintain cloud infrastructure (AWS)',
            'Implement and manage CI/CD pipelines',
            'Monitor system performance and troubleshoot issues',
            'Automate deployment processes',
            'Ensure security best practices'
          ],
          requiredSkills: ['AWS', 'Docker', 'Linux', 'CI/CD', 'Bash/Python'],
          preferredSkills: ['Kubernetes', 'Terraform', 'Ansible', 'ELK Stack', 'Prometheus'],
          minimumExperience: 4,
          level: 'Senior'
        },
        {
          id: 3,
          title: 'Frontend Developer',
          department: 'Engineering',
          description: 'Create beautiful and responsive user interfaces',
          responsibilities: [
            'Build responsive user interfaces using modern frameworks',
            'Implement UI designs from Figma/Sketch mockups',
            'Optimize application performance',
            'Ensure cross-browser compatibility',
            'Work with UX designers to improve user experience'
          ],
          requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'],
          preferredSkills: ['TypeScript', 'Next.js', 'React Native', 'UI Animation', 'Testing'],
          minimumExperience: 2,
          level: 'Mid'
        }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      description: 'Create beautiful and intuitive user experiences',
      icon: <PenTool size={24} />,
      color: 'purple',
      positionCount: 2,
      positions: [
        {
          id: 4,
          title: 'UX Designer',
          department: 'Design',
          description: 'Create user-centered designs that enhance the user experience',
          responsibilities: [
            'Conduct user research and usability testing',
            'Create user flows and wireframes',
            'Develop interactive prototypes',
            'Collaborate with product and engineering teams',
            'Analyze user data to inform design decisions'
          ],
          requiredSkills: ['User Research', 'Wireframing', 'Prototyping', 'Figma/Sketch', 'Information Architecture'],
          preferredSkills: ['Usability Testing', 'Design Systems', 'Data Analysis', 'HTML/CSS', 'Accessibility'],
          minimumExperience: 3,
          level: 'Mid'
        },
        {
          id: 5,
          title: 'UI Designer',
          department: 'Design',
          description: 'Design visually appealing interfaces for our digital products',
          responsibilities: [
            'Create visual designs for web and mobile interfaces',
            'Maintain and extend our design system',
            'Create illustrations and icons',
            'Collaborate with UX designers and frontend developers',
            'Keep up with design trends and best practices'
          ],
          requiredSkills: ['Visual Design', 'Figma/Sketch', 'Typography', 'Color Theory', 'Design Systems'],
          preferredSkills: ['Illustration', 'Animation', 'HTML/CSS', 'Photography', 'Branding'],
          minimumExperience: 2,
          level: 'Mid'
        }
      ]
    },
    {
      id: 'product',
      name: 'Product Management',
      description: 'Define product vision and roadmap',
      icon: <Layout size={24} />,
      color: 'green',
      positionCount: 2,
      positions: [
        {
          id: 6,
          title: 'Product Manager',
          department: 'Product Management',
          description: 'Lead product strategy and execution to deliver customer value',
          responsibilities: [
            'Define product vision and strategy',
            'Manage product roadmap and prioritization',
            'Gather and analyze customer feedback',
            'Work with engineering and design teams',
            'Monitor product metrics and KPIs'
          ],
          requiredSkills: ['Product Management', 'User Stories', 'Roadmapping', 'Agile/Scrum', 'Data Analysis'],
          preferredSkills: ['User Research', 'Market Analysis', 'A/B Testing', 'SQL', 'Growth Strategies'],
          minimumExperience: 4,
          level: 'Senior'
        },
        {
          id: 7,
          title: 'Product Analyst',
          department: 'Product Management',
          description: 'Analyze product data to inform decision-making',
          responsibilities: [
            'Analyze product usage data',
            'Create reports and dashboards',
            'Conduct A/B tests',
            'Identify trends and insights',
            'Present findings to stakeholders'
          ],
          requiredSkills: ['Data Analysis', 'SQL', 'Excel/Sheets', 'Data Visualization', 'Statistics'],
          preferredSkills: ['Python/R', 'A/B Testing', 'User Research', 'Product Management', 'Business Intelligence Tools'],
          minimumExperience: 2,
          level: 'Mid'
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Build our brand and drive customer acquisition',
      icon: <Megaphone size={24} />,
      color: 'orange',
      positionCount: 2,
      positions: [
        {
          id: 8,
          title: 'Digital Marketing Specialist',
          department: 'Marketing',
          description: 'Plan and execute digital marketing campaigns',
          responsibilities: [
            'Manage social media platforms',
            'Create and optimize digital ad campaigns',
            'Track and analyze campaign performance',
            'Implement SEO best practices',
            'Collaborate with content team on marketing materials'
          ],
          requiredSkills: ['Digital Marketing', 'Social Media', 'SEO', 'Google Ads', 'Analytics'],
          preferredSkills: ['Content Creation', 'Email Marketing', 'Marketing Automation', 'Graphic Design', 'A/B Testing'],
          minimumExperience: 2,
          level: 'Mid'
        },
        {
          id: 9,
          title: 'Content Marketing Manager',
          department: 'Marketing',
          description: 'Create and manage content strategy to engage and convert customers',
          responsibilities: [
            'Develop content strategy and editorial calendar',
            'Create high-quality content for various channels',
            'Manage content team and freelancers',
            'Optimize content for SEO and conversions',
            'Measure and report on content performance'
          ],
          requiredSkills: ['Content Strategy', 'Copywriting', 'SEO', 'Content Management', 'Editorial Planning'],
          preferredSkills: ['WordPress', 'Email Marketing', 'Social Media', 'Analytics', 'Project Management'],
          minimumExperience: 4,
          level: 'Senior'
        }
      ]
    }
  ];
};

// Main component
const Jobs: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedPositions, setExpandedPositions] = useState<number[]>([]);
  const [positionCandidates, setPositionCandidates] = useState<Map<number, Candidate[]>>(new Map());

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load departments
        const departmentData = getDepartments();
        setDepartments(departmentData);
        
        // Fetch candidates from API
        const fetchedCandidates = await fetchLinkedInProfiles();
        setCandidates(fetchedCandidates);
        
        if (fetchedCandidates.length === 0) {
          setError("No LinkedIn profiles found in the database. Please add profiles first.");
        } else {
          // Match candidates to positions
          const candidateMatchMap = new Map<number, Candidate[]>();
          
          // For each position, find matching candidates
          departmentData.forEach(department => {
            department.positions.forEach(position => {
              const matchingCandidates = matchCandidatesToPosition(fetchedCandidates, position);
              candidateMatchMap.set(position.id, matchingCandidates);
            });
          });
          
          setPositionCandidates(candidateMatchMap);
        }
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Match candidates to positions
  const matchCandidatesToPosition = (candidates: Candidate[], position: Position): Candidate[] => {
    const matchedCandidates = candidates.map(candidate => {
      // Initialize score as 0
      let matchScore = 0;
      const matchStrengths: string[] = [];
      const matchWeaknesses: string[] = [];
      
      // Match required skills - case insensitive matching
      const candidateSkills = candidate.skills?.map(skill => skill.toLowerCase()) || [];
      const requiredSkillsMatched = position.requiredSkills.filter(skill => 
        candidateSkills.some(candidateSkill => 
          candidateSkill.includes(skill.toLowerCase())
        )
      );
      
      // Add points for required skills (more weight)
      matchScore += (requiredSkillsMatched.length / position.requiredSkills.length) * 50;
      
      if (requiredSkillsMatched.length > position.requiredSkills.length / 2) {
        matchStrengths.push(`Matches ${requiredSkillsMatched.length} of ${position.requiredSkills.length} required skills`);
      } else if (requiredSkillsMatched.length < position.requiredSkills.length / 2) {
        matchWeaknesses.push(`Missing ${position.requiredSkills.length - requiredSkillsMatched.length} required skills`);
      }
      
      // Match preferred skills
      const preferredSkillsMatched = position.preferredSkills.filter(skill => 
        candidateSkills.some(candidateSkill => 
          candidateSkill.includes(skill.toLowerCase())
        )
      );
      
      // Add points for preferred skills (less weight)
      matchScore += (preferredSkillsMatched.length / position.preferredSkills.length) * 30;
      
      if (preferredSkillsMatched.length > position.preferredSkills.length / 2) {
        matchStrengths.push(`Has ${preferredSkillsMatched.length} of ${position.preferredSkills.length} preferred skills`);
      }
      
      // Calculate years of experience
      const yearsOfExperience = estimateYearsOfExperience(candidate);
      
      // Add points for experience
      if (yearsOfExperience >= position.minimumExperience) {
        matchScore += 20;
        matchStrengths.push(`${yearsOfExperience}+ years of relevant experience`);
      } else if (yearsOfExperience > 0) {
        const experienceRatio = yearsOfExperience / position.minimumExperience;
        matchScore += 20 * experienceRatio;
        matchWeaknesses.push(`Only ${yearsOfExperience} years of experience (${position.minimumExperience} required)`);
      } else {
        matchWeaknesses.push(`Experience information not available`);
      }
      
      // Return candidate with match score
      return {
        ...candidate,
        matchScore: Math.round(matchScore),
        matchStrengths,
        matchWeaknesses
      };
    });
    
    // Sort by match score (descending) and filter out low matches
    return matchedCandidates
      .filter(candidate => (candidate.matchScore || 0) > 25) // Only include candidates with a reasonable match
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };

  // Toggle position expansion
  const togglePositionExpanded = (positionId: number) => {
    setExpandedPositions(prev => 
      prev.includes(positionId)
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    );
  };

  // Filter departments by search term
  const filteredDepartments = departments.filter(dept => 
    searchTerm === '' || 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Event handlers
  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setSelectedPosition(null);
    setSelectedCandidate(null);
    setExpandedPositions([]);
    window.scrollTo(0, 0);
  };

  const handlePositionClick = (position: Position) => {
    setSelectedPosition(position);
    setSelectedCandidate(null);
    window.scrollTo(0, 0);
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    window.scrollTo(0, 0);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSelectedPosition(null);
    setSelectedCandidate(null);
  };

  const handleBackToPositions = () => {
    setSelectedPosition(null);
    setSelectedCandidate(null);
  };

  const handleBackToCandidates = () => {
    setSelectedCandidate(null);
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // UI helper functions
  const getDepartmentColorClasses = (colorName: string, isDark: boolean) => {
    switch (colorName) {
      case 'blue':
        return isDark 
          ? 'bg-blue-900/20 text-blue-300 border-blue-800/30' 
          : 'bg-blue-50 text-blue-600 border-blue-200';
      case 'purple':
        return isDark 
          ? 'bg-purple-900/20 text-purple-300 border-purple-800/30' 
          : 'bg-purple-50 text-purple-600 border-purple-200';
      case 'green':
        return isDark 
          ? 'bg-green-900/20 text-green-300 border-green-800/30' 
          : 'bg-green-50 text-green-600 border-green-200';
      case 'orange':
        return isDark 
          ? 'bg-orange-900/20 text-orange-300 border-orange-800/30' 
          : 'bg-orange-50 text-orange-600 border-orange-200';
      default:
        return isDark 
          ? 'bg-gray-900/20 text-gray-300 border-gray-800/30' 
          : 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getPositionLevelColor = (level: Position['level'], isDark: boolean) => {
    switch (level) {
      case 'Executive':
        return isDark ? 'text-purple-300' : 'text-purple-700';
      case 'Management':
        return isDark ? 'text-blue-300' : 'text-blue-700';
      case 'Senior':
        return isDark ? 'text-green-300' : 'text-green-700';
      case 'Mid':
        return isDark ? 'text-orange-300' : 'text-orange-700';
      case 'Junior':
        return isDark ? 'text-yellow-300' : 'text-yellow-700';
      default:
        return '';
    }
  };

  const getMatchScoreColor = (score: number, isDark: boolean) => {
    if (score >= 80) {
      return isDark ? 'text-green-300' : 'text-green-600';
    } else if (score >= 60) {
      return isDark ? 'text-blue-300' : 'text-blue-600';
    } else if (score >= 40) {
      return isDark ? 'text-orange-300' : 'text-orange-600';
    } else {
      return isDark ? 'text-red-300' : 'text-red-600';
    }
  };

  // Status color mapping
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
        return darkMode
          ? "bg-green-900/30 text-green-300 border border-green-800/30"
          : "bg-green-100 text-green-800";
      case "Interviewing":
        return darkMode
          ? "bg-blue-900/30 text-blue-300 border border-blue-800/30"
          : "bg-blue-100 text-blue-800";
      case "Hired":
        return darkMode
          ? "bg-purple-900/30 text-purple-300 border border-purple-800/30"
          : "bg-purple-100 text-purple-800";
      case "Inactive":
        return darkMode
          ? "bg-gray-900/30 text-gray-300 border border-gray-800/30"
          : "bg-gray-100 text-gray-800";
      default:
        return darkMode
          ? "bg-green-900/30 text-green-300 border border-green-800/30"
          : "bg-green-100 text-green-800";
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
              LinkedIn Profile Matching
            </h1>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Find the best candidates for each department position
            </p>
          </div>
          <a
            href="/import"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${
                darkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            <Plus size={20} />
            <span>Add LinkedIn Profile</span>
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            className={`text-center py-12 rounded-lg
            ${
              darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-600"
            }`}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading profiles and matching candidates...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className={`p-4 mb-6 rounded-lg flex items-start gap-3
            ${
              darkMode
                ? "bg-red-900/20 text-red-300 border border-red-900/30"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="font-medium">{error}</p>
              {error.includes("No LinkedIn profiles") ? (
                <p className="text-sm mt-1">
                  Go to the "Add LinkedIn Profile" page to import profiles from LinkedIn.
                </p>
              ) : (
                <p className="text-sm mt-1">
                  Check your network connection and make sure the backend server is running.
                </p>
              )}
            </div>
          </div>
        )}

        {!loading && (
          <>
            {selectedCandidate ? (
              // Candidate Details View
              <CandidateDetails 
                candidate={selectedCandidate} 
                onBackClick={handleBackToCandidates} 
                darkMode={darkMode} 
                position={selectedPosition}
                department={selectedDepartment?.name || ''}
                departmentColor={selectedDepartment ? getDepartmentColorClasses(selectedDepartment.color, darkMode) : ''}
                getMatchScoreColor={getMatchScoreColor}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
              />
            ) : selectedPosition ? (
              // Position Candidates View
              <PositionCandidates 
                position={selectedPosition} 
                candidates={positionCandidates.get(selectedPosition.id) || []}
                onCandidateClick={handleCandidateClick}
                onBackClick={handleBackToPositions} 
                darkMode={darkMode} 
                departmentName={selectedDepartment?.name || ''}
                departmentColor={selectedDepartment ? getDepartmentColorClasses(selectedDepartment.color, darkMode) : ''}
                getMatchScoreColor={getMatchScoreColor}
                getStatusColor={getStatusColor}
                getEducationSummary={getEducationSummary}
              />
            ) : selectedDepartment ? (
              // Department Positions View
              <DepartmentPositions
                department={selectedDepartment}
                onPositionClick={handlePositionClick}
                onBackClick={handleBackToDepartments}
                darkMode={darkMode}
                colorClasses={getDepartmentColorClasses(selectedDepartment.color, darkMode)}
                expandedPositions={expandedPositions}
                togglePositionExpanded={togglePositionExpanded}
                getPositionLevelColor={getPositionLevelColor}
                positionCandidates={positionCandidates}
              />
            ) : (
              // Departments View
              <>
                {/* Search */}
                <div className={`p-6 mb-8 rounded-2xl transition-all duration-300 shadow-lg ${darkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white'}`}>
                  <div className="flex items-center mb-4 gap-2">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                      <Building size={24} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold">Browse Departments</h3>
                  </div>
                  
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                      type="text"
                      className={`w-full pl-10 pr-10 py-3 rounded-lg transition-colors border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      placeholder="Search departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search departments"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        aria-label="Clear search"
                      >
                        <X 
                          size={18} 
                          className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`} 
                        />
                      </button>
                    )}
                  </div>
                  
                  {/* Results summary */}
                  <div className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {filteredDepartments.length === 0 ? (
                      <span>No departments found</span>
                    ) : (
                      <span>Showing {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'}</span>
                    )}
                  </div>
                </div>
                
                {/* Department Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list" aria-label="Departments">
                  {filteredDepartments.map((department) => (
                    <DepartmentCard 
                      key={department.id}
                      department={department}
                      onClick={() => handleDepartmentClick(department)}
                      darkMode={darkMode}
                      colorClasses={getDepartmentColorClasses(department.color, darkMode)}
                      candidateCounts={
                        department.positions.reduce((counts, position) => {
                          return counts + (positionCandidates.get(position.id)?.length || 0);
                        }, 0)
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
  darkMode: boolean;
  colorClasses: string;
  candidateCounts: number;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ 
  department, 
  onClick, 
  darkMode, 
  colorClasses,
  candidateCounts
}) => {
  return (
    <div 
      className={`rounded-xl transition-all duration-300 shadow-lg overflow-hidden border cursor-pointer hover:shadow-xl ${
        darkMode 
          ? 'bg-gray-800/60 backdrop-blur-sm border-gray-700 hover:bg-gray-800' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="listitem"
      aria-label={`${department.name} department with ${department.positionCount} positions`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border ${colorClasses}`}>
            {department.icon}
          </span>
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-xs rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {department.positionCount} {department.positionCount === 1 ? 'Position' : 'Positions'}
            </span>
            <span className={`px-3 py-1 text-xs rounded-full ${
              darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-blue-50 text-blue-700'
            }`}>
              {candidateCounts} {candidateCounts === 1 ? 'Match' : 'Matches'}
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">{department.name}</h2>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {department.description}
        </p>
        
        <div className={`flex items-center text-sm font-medium ${
          darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
        }`}>
          View Open Positions
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

interface DepartmentPositionsProps {
  department: Department;
  onPositionClick: (position: Position) => void;
  onBackClick: () => void;
  darkMode: boolean;
  colorClasses: string;
  expandedPositions: number[];
  togglePositionExpanded: (id: number) => void;
  getPositionLevelColor: (level: Position['level'], isDark: boolean) => string;
  positionCandidates: Map<number, Candidate[]>;
}

const DepartmentPositions: React.FC<DepartmentPositionsProps> = ({ 
  department, 
  onPositionClick,
  onBackClick, 
  darkMode,
  colorClasses,
  expandedPositions,
  togglePositionExpanded,
  getPositionLevelColor,
  positionCandidates
}) => {
  return (
    <div className={`rounded-xl transition-all duration-300 shadow-lg p-6 mb-8 ${
      darkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white'
    }`}>
      <button 
        onClick={onBackClick}
        className={`mb-6 flex items-center gap-1 ${
          darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
        }`}
        aria-label="Back to departments"
      >
        <ChevronLeft size={18} />
        <span>Back to Departments</span>
      </button>
      
      <div className="flex items-center mb-6">
        <div className={`mr-4 inline-flex items-center justify-center w-14 h-14 rounded-lg border ${colorClasses}`}>
          {department.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{department.name}</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {department.description}
          </p>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
      
      <div className="space-y-4">
        {department.positions.map((position) => {
          const matchedCandidates = positionCandidates.get(position.id) || [];
          const candidateCount = matchedCandidates.length;
          
          return (
            <div 
              key={position.id}
              className={`rounded-lg border ${
                darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200'
              } shadow-sm overflow-hidden`}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => togglePositionExpanded(position.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{position.title}</h3>
                      <span className={`text-sm font-medium ${getPositionLevelColor(position.level, darkMode)}`}>
                        {position.level} Level
                      </span>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {position.description}
                    </p>
                    
                    <div className="flex items-center mt-2">
                      {candidateCount > 0 ? (
                        <>
                          <div className={`flex -space-x-2 mr-3`}>
                            {matchedCandidates.slice(0, 3).map((candidate, index) => (
                              <div 
                                key={candidate._id}
                                className={`w-8 h-8 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center uppercase font-bold text-sm ${
                                  darkMode ? 'bg-gray-700' : 'bg-blue-100'
                                }`}
                                title={candidate.name}
                              >
                                {candidate.name.charAt(0)}
                              </div>
                            ))}
                            {candidateCount > 3 && (
                              <div className={`w-8 h-8 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs ${
                                darkMode ? 'bg-gray-700' : 'bg-gray-100'
                              }`}>
                                +{candidateCount - 3}
                              </div>
                            )}
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {candidateCount} matching {candidateCount === 1 ? 'candidate' : 'candidates'}
                          </span>
                        </>
                      ) : (
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No matching candidates found
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedPositions.includes(position.id) ? (
                      <ChevronUp size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    ) : (
                      <ChevronDown size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedPositions.includes(position.id) && (
                <div className={`p-4 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.requiredSkills.map((skill, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
                            darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Preferred Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.preferredSkills.map((skill, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPositionClick(position);
                    }}
                    className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      darkMode 
                        ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    View Matching Candidates
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PositionCandidatesProps {
  position: Position;
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
  onBackClick: () => void;
  darkMode: boolean;
  departmentName: string;
  departmentColor: string;
  getMatchScoreColor: (score: number, isDark: boolean) => string;
  getStatusColor: (status?: string) => string;
  getEducationSummary: (profile: any) => string;
}

const PositionCandidates: React.FC<PositionCandidatesProps> = ({ 
  position, 
  candidates,
  onCandidateClick,
  onBackClick, 
  darkMode,
  departmentName,
  departmentColor,
  getMatchScoreColor,
  getStatusColor,
  getEducationSummary
}) => {
  return (
    <div className={`rounded-xl transition-all duration-300 shadow-lg p-6 ${
      darkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white'
    }`}>
      <button 
        onClick={onBackClick}
        className={`mb-6 flex items-center gap-1 ${
          darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
        }`}
        aria-label={`Back to ${departmentName} positions`}
      >
        <ChevronLeft size={18} />
        <span>Back to {departmentName}</span>
      </button>
      
      <div className="mb-6">
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 border ${departmentColor}`}>
          {departmentName}
        </span>
        <h1 className="text-3xl font-bold mb-2">{position.title}</h1>
        <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {position.description}
        </p>
        
        <div className="flex flex-wrap gap-4 mb-2">
          <div>
            <h3 className="text-sm font-medium mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {position.requiredSkills.map((skill, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Preferred Skills</h3>
            <div className="flex flex-wrap gap-2">
              {position.preferredSkills.map((skill, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          Top Matching Candidates
          <span className={`ml-2 px-2 py-0.5 text-sm rounded-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {candidates.length}
          </span>
        </h2>
        
        {candidates.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg`}>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No matching candidates found for this position.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div 
                key={candidate._id}
                className={`rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => onCandidateClick(candidate)}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br mr-4 ${
                      darkMode ? 'from-gray-600 to-gray-800' : 'from-gray-100 to-gray-300'
                    } flex items-center justify-center uppercase font-bold text-lg`}>
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        <div className="flex items-center gap-2">
                          {candidate.status && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          )}
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            getMatchScoreColor(candidate.matchScore || 0, darkMode)
                          }`}>
                            {candidate.matchScore}% Match
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                        {candidate.role || "No Role Listed"}
                      </p>
                      
                      <div className="mt-2 flex flex-col gap-1 text-sm">
                        {candidate.location && (
                          <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <MapPin size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                            <span>{candidate.location}</span>
                          </div>
                        )}
                        
                        {candidate.email && candidate.email.length > 0 && (
                          <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <Mail size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                            <span>{candidate.email[0]}</span>
                          </div>
                        )}
                        
                        {getEducationSummary(candidate) && (
                          <div className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <GraduationCap size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                            <span>{getEducationSummary(candidate)}</span>
                          </div>
                        )}
                      </div>
                      
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 5).map((skill, index) => (
                            <span 
                              key={index}
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                position.requiredSkills.some(req => 
                                  req.toLowerCase().includes(skill.toLowerCase()) || 
                                  skill.toLowerCase().includes(req.toLowerCase())
                                )
                                  ? darkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 5 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              +{candidate.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {candidate.matchStrengths && candidate.matchStrengths.length > 0 && (
                        <div className="mt-3 flex items-center gap-1">
                          <span className={`text-xs font-medium ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                            Strengths:
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {candidate.matchStrengths[0]}
                            {candidate.matchStrengths.length > 1 && ` (+${candidate.matchStrengths.length - 1} more)`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CandidateDetailsProps {
  candidate: Candidate;
  position?: Position | null;
  onBackClick: () => void;
  darkMode: boolean;
  department: string;
  departmentColor: string;
  getMatchScoreColor: (score: number, isDark: boolean) => string;
  getStatusColor: (status?: string) => string;
  formatDate: (dateString?: string) => string;
}

const CandidateDetails: React.FC<CandidateDetailsProps> = ({ 
  candidate, 
  position,
  onBackClick, 
  darkMode,
  department,
  departmentColor,
  getMatchScoreColor,
  getStatusColor,
  formatDate
}) => {
  // Helper to format experience
  const formatExperience = (experience: any) => {
    if (typeof experience === 'string') {
      return experience;
    }
    
    let result = '';
    
    if (experience.title) {
      result += experience.title;
    }
    
    if (experience.company_name || experience.company) {
      result += ` at ${experience.company_name || experience.company}`;
    }
    
    if (experience.date_range || (experience.starts_at && experience.ends_at)) {
      result += ` (${experience.date_range || formatDateRange(experience.starts_at, experience.ends_at)})`;
    }
    
    return result;
  };
  
  const formatDateRange = (starts: any, ends: any) => {
    const startYear = starts?.year || '';
    const endYear = ends?.year || 'Present';
    return `${startYear} - ${endYear}`;
  };
  
  // Helper to format education
  const formatEducation = (education: any) => {
    if (typeof education === 'string') {
      return education;
    }
    
    let result = '';
    
    if (education.school) {
      result += education.school;
    }
    
    if (education.degree_name || education.degree) {
      result += `, ${education.degree_name || education.degree}`;
    }
    
    if (education.date_range || (education.starts_at && education.ends_at)) {
      result += ` (${education.date_range || formatDateRange(education.starts_at, education.ends_at)})`;
    }
    
    return result;
  };

  return (
    <div className={`rounded-xl transition-all duration-300 shadow-lg p-6 ${
      darkMode ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white'
    }`}>
      <button 
        onClick={onBackClick}
        className={`mb-6 flex items-center gap-1 ${
          darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
        }`}
        aria-label={`Back to candidates`}
      >
        <ChevronLeft size={18} />
        <span>Back to Candidates</span>
      </button>
      
      {/* Header with candidate info */}
      <div className="mb-6 flex items-start">
        <div className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br mr-6 ${
          darkMode ? 'from-gray-600 to-gray-800' : 'from-gray-100 to-gray-300'
        } flex items-center justify-center uppercase font-bold text-3xl`}>
          {candidate.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <div className="flex gap-2 items-center">
              {candidate.status && (
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </span>
              )}
              {position && candidate.matchScore && (
                <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                  getMatchScoreColor(candidate.matchScore, darkMode)
                }`}>
                  {candidate.matchScore}% Match
                </div>
              )}
            </div>
          </div>
          <p className={`text-xl font-medium mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {candidate.role || "No Role Listed"}
          </p>
          {candidate.headline && (
            <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {candidate.headline}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {candidate.location && (
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <MapPin size={16} className="mr-1" />
                {candidate.location}
              </div>
            )}
            {candidate.email && candidate.email.length > 0 && (
              <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Mail size={16} className="mr-1" />
                {candidate.email[0]}
              </div>
            )}
            {candidate.linkedin_url && (
              <a 
                href={candidate.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center text-sm ${
                  darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                <Linkedin size={16} className="mr-1" />
                LinkedIn Profile
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Match info if position is provided */}
      {position && candidate.matchScore && (
        <div className={`mb-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-700/40' : 'bg-gray-50'
        }`}>
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mr-2 border ${departmentColor}`}>
              {department}
            </span>
            Match for: {position.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidate.matchStrengths && candidate.matchStrengths.length > 0 && (
              <div>
                <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                  Strengths
                </h3>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {candidate.matchStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={14} className={`mt-1 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {candidate.matchWeaknesses && candidate.matchWeaknesses.length > 0 && (
              <div>
                <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                  Areas for Improvement
                </h3>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {candidate.matchWeaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <X size={14} className={`mt-1 ${darkMode ? 'text-orange-300' : 'text-orange-600'}`} />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  position && position.requiredSkills.some(req => 
                    req.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(req.toLowerCase())
                  )
                    ? darkMode 
                      ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Experience */}
      {candidate.experience && candidate.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Experience</h2>
          <div className="space-y-4">
            {candidate.experience.map((exp, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700/40' : 'bg-gray-50'
                }`}
              >
                <p className="font-semibold">{formatExperience(exp)}</p>
                {exp.description && (
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education */}
      {candidate.education && candidate.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Education</h2>
          <div className="space-y-3">
            {candidate.education.map((edu, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700/40' : 'bg-gray-50'
                }`}
              >
                <p className="font-semibold">{formatEducation(edu)}</p>
                {edu.field_of_study && (
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {edu.field_of_study}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Certifications */}
      {candidate.certifications && candidate.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Certifications</h2>
          <div className="space-y-3">
            {candidate.certifications.map((cert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700/40' : 'bg-gray-50'
                }`}
              >
                <p className="font-semibold">
                  {typeof cert === 'string' ? cert : cert.name}
                </p>
                {typeof cert !== 'string' && cert.authority && (
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {cert.authority}
                    {cert.date_range && ` (${cert.date_range})`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
        {candidate.linkedin_url && (
          <a
            href={candidate.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              darkMode 
                ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Linkedin size={18} className="mr-2" />
            View LinkedIn Profile
          </a>
        )}
        {candidate.email && candidate.email.length > 0 && (
          <a
            href={`mailto:${candidate.email[0]}`}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              darkMode 
                ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            <Mail size={18} className="mr-2" />
            Contact Candidate
          </a>
        )}
        <button
          className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Edit size={18} className="mr-2" />
          Edit Profile
        </button>
      </div>
      
      {/* Last updated information */}
      {candidate._last_updated && (
        <div className={`mt-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Profile last updated: {formatDate(candidate._last_updated)}
        </div>
      )}
    </div>
  );
};

export default Jobs;