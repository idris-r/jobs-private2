import React, { useContext } from 'react';
import { CvContext } from '../context/CvContext';
import PrimaryButton from '../components/PrimaryButton';
import TextAreaInput from '../components/TextAreaInput';
import SectionHeader from '../components/SectionHeader';
import './CoverLetterPage.css';

const CoverLetterPage = () => {
  const { 
    coverLetter, 
    generateCoverLetter, 
    loadingState, 
    wordLimit, 
    setWordLimit 
  } = useContext(CvContext);

  return (
    <div className="cover-letter-section">
      <div className="controls">
        <label>
          <span>Word Limit:</span>
          <input
            type="number"
            value={wordLimit}
            onChange={(e) => setWordLimit(e.target.value)}
            min="100"
            max="1000"
          />
        </label>
        <PrimaryButton 
          onClick={generateCoverLetter} 
          disabled={loadingState.generating}
        >
          {loadingState.generating ? 'Generating...' : 'Generate Cover Letter'}
        </PrimaryButton>
      </div>
      {coverLetter && (
        <TextAreaInput value={coverLetter} readOnly rows={12} />
      )}
    </div>
  );
};

export default CoverLetterPage;
