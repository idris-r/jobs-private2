import React from 'react';
import './Input.css';
import { BaseComponent } from '../common/BaseComponent';
import { SectionHeader, Button, TextArea } from '../common/CommonComponents';
import { DocumentHandler } from '../../utils/documentHandler';
import { DocumentTextIcon, ArrowUpTrayIcon, CheckIcon } from '@heroicons/react/24/outline';

class Input extends BaseComponent {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      fileName: '',
      isProcessing: false,
      isComplete: false
    };
  }

  handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    this.setState({ isProcessing: true });
    try {
      const result = await DocumentHandler.extractText(file);
      this.setState({ fileName: file.name });
      this.props.onCvChange(result.text, result.originalFile);
    } catch (error) {
      this.props.onError?.(error.message);
    } finally {
      this.setState({ isProcessing: false });
    }
  };

  handleAnalyze = async () => {
    this.setState({ isComplete: false });
    try {
      await this.props.onAnalyze();
      this.setState({ isComplete: true });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  render() {
    const { 
      cvText, 
      jobDescription,
      onCvChange,
      onJobChange,
      isLoading,
      error 
    } = this.props;

    const { isProcessing, fileName, isComplete } = this.state;

    return (
      <div className="input-section">
        <div className="input-group">
          <SectionHeader>Your CV</SectionHeader>
          <div className="file-upload-container">
            <input
              type="file"
              ref={this.fileInputRef}
              accept=".docx,.txt,.pdf"
              onChange={this.handleFileUpload}
              className="file-input"
            />
            <Button 
              onClick={() => this.fileInputRef.current?.click()}
              className="upload-button"
              disabled={isProcessing}
            >
              <ArrowUpTrayIcon className="upload-icon" />
              <span className="upload-text">
                {isProcessing ? 'Processing...' : 'Upload CV (.docx, .txt, .pdf)'}
              </span>
            </Button>
            {fileName && (
              <div className="file-name">
                <DocumentTextIcon />
                <span>{fileName}</span>
              </div>
            )}
          </div>
          <TextArea
            value={cvText}
            onChange={onCvChange}
            placeholder="Paste your CV here or upload a file..."
          />
        </div>
        
        <div className="input-group">
          <SectionHeader>Job Description</SectionHeader>
          <TextArea
            value={jobDescription}
            onChange={onJobChange}
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="analyse-button">
          <Button 
            onClick={this.handleAnalyze} 
            disabled={isLoading || isProcessing}
            className={`primary ${isComplete ? 'complete' : ''}`}
          >
            {isComplete ? (
              <>
                <CheckIcon className="w-5 h-5" />
                <span>Complete</span>
              </>
            ) : (
              <span>{isLoading ? 'Senpai Thinking...' : 'Send to Senpai'}</span>
            )}
          </Button>
          {isLoading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-bar-fill"></div>
              </div>
            </div>
          )}
        </div>

        {this.renderError(error)}
      </div>
    );
  }
}

export default Input;
