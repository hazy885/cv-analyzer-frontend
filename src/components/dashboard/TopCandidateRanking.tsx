import React from "react";
import { ChevronDown, MapPin, Award, Star, Clock } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  role: string;
  experience: number;
  status: string;
  salary: number;
  location: string;
  matchScore: number;
}

interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
}

interface TopCandidateRankingProps {
  rankedCandidates: Candidate[];
  selectedPosition: Position;
  darkMode: boolean;
  setSelectedPosition: (position: Position) => void;
  positions?: Position[]; // Making this optional since it might be passed from the parent
}

const TopCandidateRanking: React.FC<TopCandidateRankingProps> = ({
  rankedCandidates,
  selectedPosition,
  darkMode,
  setSelectedPosition,
  positions = [] // Default to empty array if not provided
}) => {
  // Get medal emoji based on position
  const getMedalForPosition = (position: number) => {
    switch (position) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return null;
    }
  };

  // Get class for match score
  const getMatchScoreColorClass = (score: number) => {
    if (score > 80) return "bg-gradient-to-r from-emerald-500 to-green-500";
    if (score > 60) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    return "bg-gradient-to-r from-orange-500 to-amber-500";
  };

  return (
    <div 
      className={`mb-6 p-6 rounded-xl shadow-lg ${
        darkMode 
          ? 'bg-gray-800 text-gray-100 border border-gray-700' 
          : 'bg-white text-gray-800 border border-gray-100'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Top Candidates</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Ranked by match score for selected position
          </p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <div className={`flex items-center p-2 px-4 rounded-lg ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
          }`}>
            <select
              className={`appearance-none bg-transparent pr-8 focus:outline-none w-full`}
              value={selectedPosition.id}
              onChange={(e) => {
                const position = positions.find(p => p.id === parseInt(e.target.value));
                if (position) setSelectedPosition(position);
              }}
            >
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title} • {position.department}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {rankedCandidates.map((candidate, index) => {
          const medal = getMedalForPosition(index);
          const scoreColorClass = getMatchScoreColorClass(candidate.matchScore);
          
          return (
            <div
              key={candidate.id}
              className={`flex-1 p-5 rounded-xl transition-all duration-300 hover:shadow-md ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-650' 
                  : 'bg-gray-50 hover:bg-white'
              } ${
                index < 3
                  ? `ring-2 ${
                      index === 0
                        ? 'ring-yellow-400'
                        : index === 1
                        ? 'ring-gray-400'
                        : 'ring-amber-600'
                    }`
                  : ''
              }`}
            >
              <div className="flex items-center mb-4">
                {medal && (
                  <div className="text-2xl mr-2">{medal}</div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{candidate.name}</h3>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {candidate.role}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className="ml-2 text-sm">
                    {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'} experience
                  </span>
                </div>
                
                <div className="flex items-center">
                  <MapPin size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className="ml-2 text-sm">{candidate.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Award size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className="ml-2 text-sm">{candidate.status}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className={`font-bold text-lg ${
                    candidate.matchScore > 80
                      ? 'text-green-500'
                      : candidate.matchScore > 60
                      ? 'text-blue-500'
                      : 'text-orange-500'
                  }`}>
                    {candidate.matchScore}%
                  </span>
                </div>
                
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${scoreColorClass}`}
                    style={{ width: `${candidate.matchScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCandidateRanking;