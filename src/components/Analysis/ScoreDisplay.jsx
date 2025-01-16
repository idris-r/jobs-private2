import React from 'react';

const ScoreDisplay = ({ score, label }) => {
  const getScoreColor = (score) => {
    if (score === null) return '#666';
    if (score >= 80) return '#4CAF50';
    if (score >= 50) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="score-container">
      <div className="score" style={{ backgroundColor: getScoreColor(score) }}>
        {score ?? '--'}
      </div>
      {label && <div className="score-label">{label}</div>}
    </div>
  );
};

export default ScoreDisplay;
