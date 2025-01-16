import React, { useContext } from 'react';
import { CvContext } from '../context/CvContext';
import SectionHeader from '../components/SectionHeader';
import './ActionableItemsPage.css';

const ActionableItemsPage = () => {
  const { actionableItems } = useContext(CvContext);

  return (
    <div className="actionable-items-section">
      <SectionHeader>Actionable Items</SectionHeader>
      <div className="actionable-content">
        {actionableItems || 'No actionable items yet. Run analysis first.'}
      </div>
    </div>
  );
};

export default ActionableItemsPage;
