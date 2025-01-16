import React from 'react';
import './CoverLetter.css';
import { BaseComponent } from '../common/BaseComponent';
import { Button, TextArea } from '../common/CommonComponents';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

class CoverLetter extends BaseComponent {
  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef();
    this.state = {
      copied: false
    };
  }

  copyTimeout = null;

  componentWillUnmount() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }

  handleCopy = () => {
    const { coverLetter } = this.props;
    if (!coverLetter) return;

    try {
      // Create a temporary textarea element
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = coverLetter;
      document.body.appendChild(tempTextArea);
      
      // Select and copy the text
      tempTextArea.select();
      document.execCommand('copy');
      
      // Remove the temporary element
      document.body.removeChild(tempTextArea);
      
      // Update state to show copied confirmation
      this.setState({ copied: true });
      
      // Reset copied state after 2 seconds
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      this.copyTimeout = setTimeout(() => {
        this.setState({ copied: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  render() {
    const { 
      wordLimit, 
      onWordLimitChange, 
      onGenerate, 
      coverLetter,
      isLoading,
      error 
    } = this.props;

    const { copied } = this.state;

    return (
      <div className="cover-letter-section">
        <div className="controls">
          <label>
            <span>Word Limit:</span>
            <input
              type="number"
              value={wordLimit}
              onChange={onWordLimitChange}
              min="100"
              max="1000"
            />
          </label>
          <Button 
            onClick={onGenerate} 
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Cover Letter'}
          </Button>
        </div>
        
        {coverLetter && (
          <div className="cover-letter-output">
            <button
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={this.handleCopy}
              title="Copy to clipboard"
            >
              {copied ? (
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
            <TextArea 
              ref={this.textAreaRef}
              value={coverLetter} 
              readOnly 
              rows={20} 
            />
          </div>
        )}
        {this.renderError(error)}
      </div>
    );
  }
}

export default CoverLetter;
