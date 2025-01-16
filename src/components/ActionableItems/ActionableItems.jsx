import React from 'react';
import './ActionableItems.css';
import { SectionHeader } from '../common/CommonComponents';
import {
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const ActionableItems = ({ actionableItems }) => {
  if (!actionableItems) {
    return (
      <div className="actionable-items-section">
        <SectionHeader>Actionable Items</SectionHeader>
        <div className="empty-state">
          <ClipboardDocumentListIcon className="empty-state-icon" />
          <p>No actionable items yet. Run analysis first.</p>
        </div>
      </div>
    );
  }

  let items = [];
  try {
    // Clean the response by removing markdown code blocks
    const cleanJson = actionableItems.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = typeof cleanJson === 'string' 
      ? JSON.parse(cleanJson)
      : cleanJson;
    items = parsed.actions || [];
  } catch (error) {
    console.error('Error parsing actionable items:', error);
    return (
      <div className="actionable-items-section">
        <SectionHeader>Actionable Items</SectionHeader>
        <div className="error-state">
          Error processing actionable items. Please try again.
        </div>
      </div>
    );
  }

  const getActionIcon = (title) => {
    switch (title?.toLowerCase()) {
      case 'skill enhancement':
        return ArrowTrendingUpIcon;
      case 'experience highlight':
        return DocumentCheckIcon;
      case 'education focus':
      case 'certification need':
        return ExclamationCircleIcon;
      default:
        return ClipboardDocumentListIcon;
    }
  };

  return (
    <div className="actionable-items-section">
      <SectionHeader>Actionable Items</SectionHeader>
      <div className="actionable-content">
        {items.map((item, index) => {
          const Icon = getActionIcon(item.title);
          return (
            <div key={index} className="action-item">
              <div className="action-header">
                <Icon className="action-icon" />
                <span className="action-title">{item.title || 'Improvement Action'}</span>
                <span className={`priority-indicator priority-${item.priority}`}>
                  {item.priority === 'high' ? 'High Priority' : 
                   item.priority === 'medium' ? 'Medium Priority' : 
                   'Low Priority'}
                </span>
              </div>
              <div className="action-content">
                <div className="step-bullet">{index + 1}</div>
                <div className="action-details">
                  <div className="action-description">{item.action}</div>
                  <div className="action-reasoning">
                    <h4>Why This Matters:</h4>
                    <p>{item.reasoning}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionableItems;
