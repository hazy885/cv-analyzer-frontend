import React from "react";
import { CandidateCard } from "./CandidateCard";

interface CandidateGridProps {
  candidates: any[];
  darkMode: boolean;
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({ candidates, darkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} darkMode={darkMode} />
      ))}
    </div>
  );
};

export default CandidateGrid;