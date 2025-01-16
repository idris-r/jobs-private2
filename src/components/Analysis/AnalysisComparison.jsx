import React from 'react';
import ScoreDisplay from './ScoreDisplay';

const AnalysisComparison = ({ cvText, jobDescription }) => {
  const calculateScore = (cvTerm, jdTerm) => {
    if (!cvText || !jobDescription) return null;
    const cvCount = (cvText.match(new RegExp(cvTerm, 'gi')) || []).length;
    const jdCount = (jobDescription.match(new RegExp(cvTerm, 'gi')) || []).length;
    return jdCount === 0 ? null : Math.min(100, Math.round((cvCount / jdCount) * 100));
  };

  return (
    <div className="comparison-section">
      <h3>Key Comparisons</h3>
      <div className="score-grid">
        <ScoreDisplay 
          score={calculateScore('education', 'education')} 
          label="Education" 
        />
        <ScoreDisplay 
          score={calculateScore('experience', 'experience')} 
          label="Experience" 
        />
        <ScoreDisplay 
          score={calculateScore('skill', 'skill')} 
          label="Skills" 
        />
      </div>
    </div>
  );
};

export default AnalysisComparison;
