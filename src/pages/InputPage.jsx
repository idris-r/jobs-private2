import React, { useContext } from 'react';
import { CvContext } from '../context/CvContext';
import PrimaryButton from '../components/PrimaryButton';
import TextAreaInput from '../components/TextAreaInput';
import SectionHeader from '../components/SectionHeader';
import './InputPage.css';

const InputPage = () => {
  const { 
    cvText, 
    setCvText, 
    jobDescription, 
    setJobDescription, 
    analyzeContent, 
    loadingState, 
    isInputEmpty 
  } = useContext(CvContext);

  return (
    <div className="input-section">
      <div className="input-group">
        <SectionHeader>Your CV</SectionHeader>
        <TextAreaInput
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your CV here..."
        />
      </div>
      
      <div className="input-group">
        <SectionHeader>Job Description</SectionHeader>
        <TextAreaInput
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>

      <PrimaryButton 
        onClick={analyzeContent} 
        disabled={loadingState.analyzing || isInputEmpty}
      >
        {loadingState.analyzing ? 'Analyzing...' : 'Analyze'}
      </PrimaryButton>
    </div>
  );
};

export default InputPage;
