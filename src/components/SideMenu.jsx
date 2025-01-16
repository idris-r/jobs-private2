import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryButton from './PrimaryButton';

const SideMenu = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className="side-menu">
      <div className="menu-header">
        <h1>CV Matcher</h1>
      </div>
      <ul>
        <li><Link to="/">Input</Link></li>
        <li><Link to="/analysis">Analysis</Link></li>
        <li><Link to="/actionable-items">Actionable Items</Link></li>
        <li><Link to="/optimize-cv">Optimize CV</Link></li>
        <li><Link to="/cover-letter">Cover Letter</Link></li>
      </ul>
      <div className="theme-toggle">
        <PrimaryButton onClick={toggleTheme}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </PrimaryButton>
      </div>
    </nav>
  );
};

export default SideMenu;
