import React, { useContext } from 'react';
import { CvContext } from '../context/CvContext';
import PrimaryButton from '../components/PrimaryButton';
import TextAreaInput from '../components/TextAreaInput';
import SectionHeader from '../components/SectionHeader';
import './OptimizeCvPage.css';

const OptimizeCvPage = () => {
  const { 
    optimizedCV, 
    optimizeCV, 
    loadingState, 
    saveDocument 
  } = useContext(CvContext);

  return (
    <div className="optimize-section">
      <PrimaryButton 
        onClick={optimizeCV} 
        disabled={loadingState.optimizing}
      >
        {loadingState.optimizing ? 'Optimizing...' : 'Optimize CV'}
      </PrimaryButton>
      {optimizedCV && (
        <>
          <TextAreaInput value={optimizedCV} readOnly rows={12} />
          <div className="save-buttons">
            <PrimaryButton onClick={() => saveDocument('pdf')}>
              Save as PDF
            </PrimaryButton>
            <PrimaryButton onClick={() => saveDocument('doc')}>
              Save as DOC
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
};

export default OptimizeCvPage;
