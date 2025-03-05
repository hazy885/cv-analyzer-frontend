import React from "react";
import { 
  Mail, Phone, DollarSign, Briefcase, Calendar,
  MoreHorizontal, ChevronRight, Award, MapPin, Clock,
  BookmarkPlus, ExternalLink
} from "lucide-react";

interface Candidate {
  id: string | number;
  name: string;
  experience: number;
  status: string;
  role?: string;
  email?: string;
  phone?: string;
  salary?: number;
  skills?: string[];
  avatar?: string;
  lastActive?: string;
  location?: string;
  matchScore?: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  darkMode: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, darkMode }) => {
  // Determine status color
  const getStatusColor = () => {
    switch (candidate.status.toLowerCase()) {
      case "active":
        return darkMode ? "bg-green-900/40 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200";
      case "interviewing":
        return darkMode ? "bg-blue-900/40 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200";
      case "hired":
        return darkMode ? "bg-purple-900/40 text-purple-300 border-purple-700" : "bg-purple-50 text-purple-700 border-purple-200";
      case "rejected":
        return darkMode ? "bg-red-900/40 text-red-300 border-red-700" : "bg-red-50 text-red-700 border-red-200";
      default:
        return darkMode ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Status gradient
  const getStatusGradient = () => {
    switch (candidate.status.toLowerCase()) {
      case "active":
        return "from-green-500 to-emerald-600";
      case "interviewing":
        return "from-blue-500 to-indigo-600";
      case "hired":
        return "from-purple-500 to-violet-600";
      case "rejected":
        return "from-red-500 to-rose-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div 
      className={`${
        darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-200"
      } rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group`}
    >
      {/* Card Header with avatar and name */}
      <div className="relative">
        {/* Status gradient bar at the top */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${getStatusGradient()}`}></div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            {/* Status badge */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              {candidate.status}
            </span>
            
            <div className="flex items-center gap-2">
              <button className={`p-1.5 rounded-full ${
                darkMode ? "hover:bg-gray-700/70 text-gray-400 hover:text-blue-300" : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
              } transition-colors`} title="Save candidate">
                <BookmarkPlus className="h-4 w-4" />
              </button>
              <button className={`p-1.5 rounded-full ${
                darkMode ? "hover:bg-gray-700/70 text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              } transition-colors`} title="More options">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Avatar */}
            <div className="mr-4 relative">
              {candidate.avatar ? (
                <div className="rounded-full p-0.5 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <img 
                    src={candidate.avatar} 
                    alt={candidate.name} 
                    className="h-16 w-16 rounded-full object-cover border-2 border-transparent"
                  />
                </div>
              ) : (
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold
                  bg-gradient-to-r ${
                    candidate.status === "active" ? "from-green-400 to-emerald-500" :
                    candidate.status === "interviewing" ? "from-blue-400 to-indigo-500" :
                    candidate.status === "hired" ? "from-purple-400 to-violet-500" : 
                    candidate.status === "rejected" ? "from-red-400 to-rose-500" : "from-gray-400 to-gray-500"
                  } text-white`}>
                  {candidate.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div>
              <h2 className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                {candidate.name}
              </h2>
              <p className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                {candidate.role || "Software Developer"}
              </p>
              
              <div className="flex items-center mt-1">
                <MapPin className={`h-3.5 w-3.5 mr-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {candidate.location || "Cape Town, South Africa"}
                </span>
              </div>

              {/* Match score - only show if provided */}
              {candidate.matchScore && (
                <div className="mt-2 flex items-center">
                  <div className={`text-xs px-2 py-0.5 rounded-md font-medium 
                    ${darkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-50 text-indigo-700"}`}
                  >
                    <span>{candidate.matchScore}% Match</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <div className={`px-5 py-4 ${darkMode ? "border-t border-gray-700/50" : "border-t border-gray-100"}`}>
        <div className="grid grid-cols-2 gap-3">
          {/* Experience */}
          <div className={`flex flex-col p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
            <div className="flex items-center mb-1">
              <Briefcase className={`h-4 w-4 mr-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Experience
              </span>
            </div>
            <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              {candidate.experience} years
            </span>
          </div>
          
          {/* Salary */}
          <div className={`flex flex-col p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
            <div className="flex items-center mb-1">
              <DollarSign className={`h-4 w-4 mr-1.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-xs uppercase font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Salary
              </span>
            </div>
            <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
              R{candidate.salary?.toLocaleString() || "70,000"}
            </span>
          </div>
        </div>
        
        {/* Contact and activity info */}
        <div className={`mt-4 p-3 rounded-lg ${darkMode ? "bg-gray-700/30" : "bg-gray-50"}`}>
          {/* Email */}
          <div className="flex items-center mb-2">
            <Mail className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {candidate.email || `${candidate.name.toLowerCase().replace(/\s+/g, ".")}@example.com`}
            </span>
          </div>
          
          {/* Last active */}
          <div className="flex items-center">
            <Clock className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Active {candidate.lastActive || "2 days ago"}
            </span>
          </div>
        </div>

        {/* Skills */}
        {(candidate.skills || ["React", "TypeScript", "Node.js"]).length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {(candidate.skills || ["React", "TypeScript", "Node.js"]).slice(0, 3).map((skill, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    darkMode 
                      ? "bg-blue-900/30 text-blue-300 border border-blue-800/30" 
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {skill}
                </span>
              ))}
              {(candidate.skills || []).length > 3 && (
                <span 
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    darkMode 
                      ? "bg-gray-700 text-gray-300 border border-gray-600" 
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  +{(candidate.skills || []).length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-5 flex items-center justify-between">
          <button
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <span>Contact</span>
            </div>
          </button>
          
          <button 
            className={`py-2 px-4 rounded-lg text-sm font-medium flex items-center gap-1.5
              transition-all duration-200 ${
              darkMode 
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md shadow-blue-900/20" 
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
            } group-hover:shadow-lg`}
          >
            View Profile
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;