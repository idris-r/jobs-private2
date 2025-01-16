import React from 'react';
import './CommonComponents.css';

export function SectionHeader({ children }) {
  return <h2 className="section-header">{children}</h2>;
}

export function Button({ onClick, disabled, children, className = 'primary' }) {
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export const TextArea = React.forwardRef(function TextArea(props, ref) {
  const { value, onChange, placeholder, rows = 8, readOnly = false } = props;
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      style={{ minHeight: rows * 24 + 'px' }}
    />
  );
});

export function MenuItem({ isActive, disabled, onClick, children }) {
  return (
    <li 
      className={isActive ? 'active' : ''}
      onClick={onClick}
      style={{ 
        opacity: disabled ? 0.5 : 1, 
        pointerEvents: disabled ? 'none' : 'auto' 
      }}
    >
      {children}
    </li>
  );
}
