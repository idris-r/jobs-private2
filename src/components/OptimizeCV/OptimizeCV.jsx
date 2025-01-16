import React from 'react';
import './OptimizeCV.css';
import { BaseComponent } from '../common/BaseComponent';
import { SectionHeader } from '../common/CommonComponents';
import { 
  LightBulbIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

class OptimizeCV extends BaseComponent {
  state = {
    improvements: [],
    error: null,
    copiedStates: {}
  };

  copyTimeouts = {};

  componentDidMount() {
    if (this.props.optimizedCV) {
      this.processImprovements();
    }
  }

  componentWillUnmount() {
    // Clear all timeouts
    Object.values(this.copyTimeouts).forEach(timeout => {
      clearTimeout(timeout);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.optimizedCV !== this.props.optimizedCV && this.props.optimizedCV) {
      this.processImprovements();
    }
  }

  processImprovements = () => {
    try {
      let parsedResponse;
      if (typeof this.props.optimizedCV === 'string') {
        const jsonMatch = this.props.optimizedCV.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not find JSON in response');
        }
      } else if (typeof this.props.optimizedCV === 'object') {
        parsedResponse = this.props.optimizedCV;
      } else {
        throw new Error('Invalid response format');
      }

      if (!parsedResponse || !Array.isArray(parsedResponse.improvements)) {
        throw new Error('Invalid response structure');
      }

      this.setState({
        improvements: parsedResponse.improvements,
        error: null
      });
    } catch (error) {
      console.error('Error processing improvements:', error);
      this.setState({ 
        error: 'Failed to process improvements. Please try again.',
        improvements: []
      });
    }
  };

  handleCopy = (text, index) => {
    try {
      // Create a temporary textarea element
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = text;
      document.body.appendChild(tempTextArea);
      
      // Select and copy the text
      tempTextArea.select();
      document.execCommand('copy');
      
      // Remove the temporary element
      document.body.removeChild(tempTextArea);
      
      // Update copied state for this specific improvement
      this.setState(prevState => ({
        copiedStates: {
          ...prevState.copiedStates,
          [index]: true
        }
      }));
      
      // Clear existing timeout if any
      if (this.copyTimeouts[index]) {
        clearTimeout(this.copyTimeouts[index]);
      }
      
      // Set new timeout
      this.copyTimeouts[index] = setTimeout(() => {
        this.setState(prevState => ({
          copiedStates: {
            ...prevState.copiedStates,
            [index]: false
          }
        }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  getImpactClass = (impact) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'impact-high';
      case 'medium': return 'impact-medium';
      case 'low': return 'impact-low';
      default: return 'impact-medium';
    }
  };

  renderCopyButton = (text, index) => {
    const isCopied = this.state.copiedStates[index];
    return (
      <button
        className={`copy-button ${isCopied ? 'copied' : ''}`}
        onClick={() => this.handleCopy(text, index)}
        title="Copy to clipboard"
      >
        {isCopied ? (
          <>
            <ClipboardDocumentCheckIcon />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <ClipboardDocumentIcon />
            <span>Copy</span>
          </>
        )}
      </button>
    );
  };

  renderImprovement = (improvement, index) => {
    return (
      <div key={index} className="improvement-card">
        <div className="improvement-header">
          <LightBulbIcon className="improvement-icon" />
          <span className="improvement-title">{improvement.location}</span>
          <span className={`impact-badge ${this.getImpactClass(improvement.impact)}`}>
            {improvement.impact} Impact
          </span>
        </div>

        <div className="comparison-container">
          <div className="text-block original">
            {improvement.original}
          </div>
          <div className="text-block improved">
            {this.renderCopyButton(improvement.improved, index)}
            {improvement.improved}
          </div>
        </div>

        {improvement.matchedRequirements && (
          <div className="matched-requirements">
            <h4>Matches Job Requirements</h4>
            <div className="requirements-list">
              {improvement.matchedRequirements.map((req, i) => (
                <span key={i} className="requirement-tag">{req}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { isLoading } = this.props;
    const { improvements, error } = this.state;

    if (isLoading) {
      return this.renderLoading(true, "Analyzing CV for improvements...");
    }

    if (!improvements.length) {
      return (
        <div className="optimize-section">
          <SectionHeader>CV Improvements</SectionHeader>
          <div className="empty-state">
            No improvements available yet. Please ensure you've analyzed your CV first.
          </div>
        </div>
      );
    }

    return (
      <div className="optimize-section">
        <SectionHeader>CV Improvements</SectionHeader>
        {error && this.renderError(error)}

        <div className="improvements-container">
          {improvements.map((improvement, index) =>
            this.renderImprovement(improvement, index)
          )}
        </div>
      </div>
    );
  }
}

export default OptimizeCV;
