import React from "react";
import { 
  Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, 
  ChevronRight, Star, Clock, Award, ExternalLink
} from "lucide-react";

interface Candidate {
  id: number | string;
  name: string;
  role: string;
  experience: number;
  status: string;
  salary: number;
  location: string;
  matchScore?: number;
  skills?: string[];
  applied?: string;
  email?: string;
  avatar?: string;
  lastActive?: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  darkMode: boolean;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, darkMode }) => {
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className={`rounded-xl overflow-hidden border ${
      darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white border-gray-200"
    } shadow-lg`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Candidate
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Status
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Experience
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Location
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Salary
              </th>
              <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Match
              </th>
              <th className={`px-6 py-4 text-right text-xs font-medium uppercase tracking-wider ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
            {candidates.map((candidate) => (
              <tr 
                key={candidate.id} 
                className={`hover:${darkMode ? "bg-gray-700/30" : "bg-gray-50"} transition-colors`}
              >
                {/* Candidate */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {candidate.avatar ? (
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={candidate.avatar} 
                          alt={candidate.name} 
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold
                          bg-gradient-to-r ${
                            candidate.status === "active" ? "from-green-400 to-emerald-500" :
                            candidate.status === "interviewing" ? "from-blue-400 to-indigo-500" :
                            candidate.status === "hired" ? "from-purple-400 to-violet-500" : 
                            "from-gray-400 to-gray-500"
                          } text-white`}>
                          {candidate.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{candidate.name}</div>
                      <div className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                        {candidate.role}
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </td>
                
                {/* Experience */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Briefcase className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <span>{candidate.experience} years</span>
                  </div>
                </td>
                
                {/* Location */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <span>{candidate.location}</span>
                  </div>
                </td>
                
                {/* Salary */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <DollarSign className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <span>R{candidate.salary.toLocaleString()}</span>
                  </div>
                </td>
                
                {/* Match Score */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.matchScore !== undefined && (
                    <div className="flex items-center">
                      <div className={`w-16 h-2 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                        <div 
                          className={`h-full rounded-full ${
                            candidate.matchScore > 80 ? "bg-green-500" :
                            candidate.matchScore > 60 ? "bg-blue-500" :
                            "bg-amber-500"
                          }`}
                          style={{ width: `${candidate.matchScore}%` }}
                        ></div>
                      </div>
                      <span className={`ml-2 font-medium ${
                        candidate.matchScore > 80 ? (darkMode ? "text-green-400" : "text-green-600") :
                        candidate.matchScore > 60 ? (darkMode ? "text-blue-400" : "text-blue-600") :
                        (darkMode ? "text-amber-400" : "text-amber-600")
                      }`}>
                        {candidate.matchScore}%
                      </span>
                    </div>
                  )}
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                      darkMode 
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-700" 
                        : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    }`}
                  >
                    <span>View</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {candidates.length === 0 && (
        <div className={`p-8 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <div className="mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Award className={darkMode ? "text-gray-500" : "text-gray-400"} size={24} />
          </div>
          <h3 className="text-lg font-medium mb-1">No candidates found</h3>
          <p className="text-sm">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
};

export default CandidateList;