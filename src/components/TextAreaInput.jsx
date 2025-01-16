import React from 'react';
import './TextAreaInput.css';

const TextAreaInput = ({ value, onChange, placeholder, rows = 8 }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

export default TextAreaInput;
