import React, { useContext } from 'react';
import { CvContext } from '../context/CvContext';
import ScoreDisplay from '../components/ScoreDisplay';
import SectionHeader from '../components/SectionHeader';
import AnalysisComparison from '../components/AnalysisComparison';
import './AnalysisPage.css';

const AnalysisPage = () => {
  const { score, justification, cvText, jobDescription } = useContext(CvContext);

  return (
    <div className="analysis-section">
      <div className="main-score-container">
        <ScoreDisplay score={score} label="Overall Match" />
      </div>
      <div className="analysis-content">
        <SectionHeader>Analysis</SectionHeader>
        <div className="justification">
          {justification || 'Run analysis to see results'}
        </div>
        <AnalysisComparison cvText={cvText} jobDescription={jobDescription} />
      </div>
    </div>
  );
};

export default AnalysisPage;
