import React from "react";

interface CandidateListProps {
  candidates: any[];
  darkMode: boolean;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, darkMode }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-4 text-left text-sm font-medium">Name</th>
            {/* More columns */}
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td className="p-4">{candidate.name}</td>
              {/* More columns */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default CandidateList;