import React from 'react';
import './Analysis.css';
import { SectionHeader } from '../common/CommonComponents';

const getScoreClass = (score) => {
  if (!score) return 'low';
  if (score >= 85) return 'high';
  if (score >= 70) return 'medium';
  return 'low';
};

const getScoreHeadline = (score) => {
  if (!score) return "Please run the analysis to see your match score";
  if (score >= 85) {
    return "Excellent Match! You're a strong candidate for this role";
  }
  if (score >= 70) {
    return "Good Match - Some improvements could strengthen your application";
  }
  if (score >= 50) {
    return "Fair Match - Consider enhancing key areas to better align with the role";
  }
  return "Needs Improvement - Significant gaps identified between requirements and qualifications";
};

const StarChart = ({ breakdown }) => {
  if (!breakdown) return null;

  const metrics = [
    { key: 'requiredSkills', label: 'Required Skills', angle: 0 },
    { key: 'experience', label: 'Experience', angle: 72 },
    { key: 'education', label: 'Education', angle: 144 },
    { key: 'keywords', label: 'Keywords', angle: 216 },
    { key: 'softSkills', label: 'Soft Skills', angle: 288 }
  ];

  const center = 50;
  const radius = 40;

  const getPoint = (angle, value) => {
    const adjustedRadius = (radius * value) / 100;
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: center + adjustedRadius * Math.cos(radians),
      y: center + adjustedRadius * Math.sin(radians)
    };
  };

  return (
    <div className="star-chart-container">
      <svg className="star-chart" viewBox="0 0 100 100">
        {[20, 40, 60, 80, 100].map(level => (
          <polygon
            key={level}
            points={metrics.map(m => getPoint(m.angle, level)).map(p => `${p.x},${p.y}`).join(' ')}
            className="star-chart-background"
          />
        ))}
        
        {metrics.map(m => (
          <line
            key={m.key}
            x1={center}
            y1={center}
            x2={getPoint(m.angle, 100).x}
            y2={getPoint(m.angle, 100).y}
            className="star-chart-background"
          />
        ))}
        
        <polygon 
          points={metrics.map(m => {
            const score = breakdown[m.key]?.score || 0;
            const point = getPoint(m.angle, score);
            return `${point.x},${point.y}`;
          }).join(' ')} 
          className="star-chart-data" 
        />
      </svg>
      
      <div className="star-chart-labels">
        {metrics.map(m => {
          const point = getPoint(m.angle, 115);
          const score = breakdown[m.key]?.score || 0;
          const valuePoint = getPoint(m.angle, score + 10);
          
          return (
            <React.Fragment key={m.key}>
              <div
                className="star-label"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`
                }}
              >
                {m.label}
              </div>
              <div
                className="star-value"
                style={{
                  left: `${valuePoint.x}%`,
                  top: `${valuePoint.y}%`
                }}
              >
                {score}%
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const ScoreBreakdown = ({ breakdown }) => {
  if (!breakdown) return null;

  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--gradient-success)';
    if (score >= 70) return 'var(--gradient-warning)';
    return 'var(--gradient-danger)';
  };

  return (
    <div className="score-breakdown">
      <h3>Detailed Breakdown</h3>
      <div className="breakdown-grid">
        {Object.entries(breakdown).map(([key, data]) => (
          <div key={key} className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="breakdown-score">
                {data.score}%
              </span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-bar-fill" 
                style={{ 
                  width: `${data.score}%`,
                  background: getScoreColor(data.score)
                }}
              />
            </div>
            {data.summary && (
              <div className="summary-text">
                {data.summary}
              </div>
            )}
            {data.missing && data.missing.length > 0 && (
              <div className="missing-items">
                <span className="missing-label">Missing:</span>
                {data.missing.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Analysis = ({ score, justification, breakdown, cvText, jobDescription }) => {
  const scoreClass = getScoreClass(score);
  const headline = getScoreHeadline(score);

  return (
    <div className="analysis-section">
      <div className="score-header">
        <div className="score-container">
          <div className={`score ${scoreClass}`}>
            {score || '--'}
          </div>
        </div>
        <h2 className="score-headline">{headline}</h2>
      </div>

      <div className="analysis-content">
        <SectionHeader>Summary</SectionHeader>
        <div className="summary-text">
          {justification || 'Run analysis to see your results'}
        </div>
        
        <div className="key-metrics">
          <h3>Key Metrics</h3>
          <StarChart breakdown={breakdown} />
        </div>
        
        {breakdown && <ScoreBreakdown breakdown={breakdown} />}
      </div>
    </div>
  );
};

export default Analysis;
