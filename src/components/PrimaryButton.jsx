import React from 'react';
import './PrimaryButton.css';

const PrimaryButton = ({ onClick, disabled, children }) => {
  return (
    <button 
      className="primary"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
