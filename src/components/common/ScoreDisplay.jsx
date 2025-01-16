import React from 'react';
import './ScoreDisplay.css';

export const ScoreDisplay = ({ score, label, className = '' }) => {
  const getScoreColor = (score) => {
    if (score === null || score === undefined) return '#666';
    if (score >= 85) return 'var(--gradient-success)';
    if (score >= 70) return 'var(--gradient-warning)';
    return 'var(--gradient-danger)';
  };

  return (
    <div className={`score-display ${className}`}>
      <div 
        className="score-value"
        style={{ background: getScoreColor(score) }}
      >
        {score ?? '--'}
      </div>
      {label && <div className="score-label">{label}</div>}
    </div>
  );
};
