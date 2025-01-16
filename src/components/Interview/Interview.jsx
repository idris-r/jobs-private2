import React from 'react';
import './Interview.css';
import { BaseComponent } from '../common/BaseComponent';
import { Button, SectionHeader } from '../common/CommonComponents';
import { PROMPTS } from '../../utils/constants';
import { ApiService } from '../../utils/apiService';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CommandLineIcon, 
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

class Interview extends BaseComponent {
  state = {
    categorizedQuestions: null,
    currentQuestionIndex: 0,
    userAnswers: {},
    feedback: {},
    isAnswering: true, // Changed to true by default
    currentAnswer: '',
    isSubmitting: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.questions !== this.props.questions && this.props.questions) {
      this.categorizeQuestions(this.props.questions);
      // Ensure answer box is expanded when new questions are generated
      this.setState({ isAnswering: true });
    }
  }

  categorizeQuestions = (questions) => {
    try {
      if (!questions) return;

      const categories = {
        technical: [],
        background: [],
        suitability: [],
        specific: []
      };

      if (questions.questions && Array.isArray(questions.questions)) {
        questions.questions.forEach(item => {
          if (item && item.type && item.question && categories[item.type]) {
            categories[item.type].push(item.question);
          }
        });
      }

      this.setState({ categorizedQuestions: categories });
    } catch (error) {
      console.error('Error categorizing questions:', error);
      this.setState({ categorizedQuestions: null });
    }
  };

  handleGenerateClick = async () => {
    const { onGenerate } = this.props;
    if (onGenerate) {
      const result = await onGenerate();
      if (result) {
        this.categorizeQuestions(result);
      }
    }
  };

  getAllQuestions = () => {
    const { categorizedQuestions } = this.state;
    if (!categorizedQuestions) return [];

    const allQuestions = [];
    Object.entries(categorizedQuestions).forEach(([category, questions]) => {
      questions.forEach((question, index) => {
        allQuestions.push({
          category,
          question,
          index: allQuestions.length
        });
      });
    });
    return allQuestions;
  };

  getCurrentQuestion = () => {
    const allQuestions = this.getAllQuestions();
    return allQuestions[this.state.currentQuestionIndex];
  };

  handleAnswerSubmit = async () => {
    const { currentAnswer, currentQuestionIndex } = this.state;
    if (!currentAnswer.trim()) return;

    this.setState({ isSubmitting: true });

    try {
      const currentQuestion = this.getCurrentQuestion();
      const prompt = `
        Evaluate this interview answer. The question was: "${currentQuestion.question}"
        
        Answer: "${currentAnswer}"
        
        Provide feedback in JSON format:
        {
          "score": "excellent|good|moderate|poor",
          "feedback": "detailed feedback explaining strengths and areas for improvement",
          "improvements": ["specific suggestion 1", "specific suggestion 2"]
        }

        Score criteria:
        - excellent: Comprehensive, well-structured answer that fully addresses the question with specific examples
        - good: Solid answer that addresses most aspects of the question
        - moderate: Basic answer that partially addresses the question but lacks depth
        - poor: Incomplete or off-topic answer that doesn't adequately address the question
      `;

      const response = await ApiService.makeRequest(prompt);
      const feedback = ApiService.parseJsonResponse(response);

      this.setState(prevState => ({
        feedback: {
          ...prevState.feedback,
          [currentQuestionIndex]: feedback
        },
        userAnswers: {
          ...prevState.userAnswers,
          [currentQuestionIndex]: currentAnswer
        },
        isAnswering: false,
        currentAnswer: '',
        isSubmitting: false
      }));
    } catch (error) {
      console.error('Error getting feedback:', error);
      this.setState({ 
        isSubmitting: false,
        error: 'Failed to analyze answer. Please try again.'
      });
    }
  };

  handleNext = () => {
    const allQuestions = this.getAllQuestions();
    if (this.state.currentQuestionIndex < allQuestions.length - 1) {
      this.setState(prevState => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        isAnswering: true // Changed to true to keep answer box expanded
      }));
    }
  };

  handlePrevious = () => {
    if (this.state.currentQuestionIndex > 0) {
      this.setState(prevState => ({
        currentQuestionIndex: prevState.currentQuestionIndex - 1,
        isAnswering: false // Keep this false to show previous answers
      }));
    }
  };

  getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return CommandLineIcon;
      case 'background': return BriefcaseIcon;
      case 'suitability': return UserGroupIcon;
      case 'specific': return AcademicCapIcon;
      default: return CommandLineIcon;
    }
  };

  renderFeedback = (feedback) => {
    if (!feedback) return null;

    const getScoreClass = (score) => {
      switch (score.toLowerCase()) {
        case 'excellent': return 'score-excellent';
        case 'good': return 'score-good';
        case 'moderate': return 'score-moderate';
        case 'poor': return 'score-poor';
        default: return 'score-moderate';
      }
    };

    return (
      <div className="feedback">
        <div className="feedback-header">
          <h4>Feedback</h4>
          <span className={`feedback-score ${getScoreClass(feedback.score)}`}>
            {feedback.score}
          </span>
        </div>
        <div className="feedback-content">
          <p>{feedback.feedback}</p>
          
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div className="improvements">
              <h5>Suggestions for Improvement:</h5>
              <ul>
                {feedback.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { isLoading, error } = this.props;
    const { 
      categorizedQuestions,
      currentQuestionIndex,
      isAnswering,
      currentAnswer,
      userAnswers,
      feedback,
      isSubmitting
    } = this.state;

    const currentQuestion = this.getCurrentQuestion();
    const allQuestions = this.getAllQuestions();

    return (
      <div className="interview-section">
        <SectionHeader>Interview Questions</SectionHeader>
        
        <div className="controls">
          <Button 
            onClick={this.handleGenerateClick} 
            disabled={isLoading}
          >
            {isLoading ? 'Generating Questions...' : 'Generate Interview Questions'}
          </Button>
        </div>

        {error && this.renderError(error)}

        {categorizedQuestions && currentQuestion && (
          <div className="questions-container">
            <div className="question-category">
              <div className="category-header">
                {React.createElement(this.getCategoryIcon(currentQuestion.category), {
                  className: "category-icon"
                })}
                <h3>{currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)} Question</h3>
              </div>

              <div className="question-item">
                <div 
                  className="question-header"
                  onClick={() => this.setState(prev => ({ isAnswering: !prev.isAnswering }))}
                >
                  <span className="question-number">Q{currentQuestionIndex + 1}</span>
                  <p className="question-text">{currentQuestion.question}</p>
                  {React.createElement(isAnswering ? XMarkIcon : CheckIcon, {
                    className: "category-icon"
                  })}
                </div>

                {isAnswering && (
                  <div className="question-content">
                    <textarea
                      className="answer-input"
                      value={currentAnswer}
                      onChange={(e) => this.setState({ currentAnswer: e.target.value })}
                      placeholder="Type your answer here..."
                    />
                    <div className="answer-actions">
                      <Button
                        onClick={this.handleAnswerSubmit}
                        disabled={isSubmitting || !currentAnswer.trim()}
                      >
                        {isSubmitting ? 'Analyzing...' : 'Submit Answer'}
                      </Button>
                    </div>
                  </div>
                )}

                {feedback[currentQuestionIndex] && !isAnswering && (
                  <div className="question-content">
                    <p><strong>Your Answer:</strong></p>
                    <p>{userAnswers[currentQuestionIndex]}</p>
                    {this.renderFeedback(feedback[currentQuestionIndex])}
                  </div>
                )}
              </div>

              <div className="navigation-buttons">
                <button
                  className="nav-button"
                  onClick={this.handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeftIcon />
                  Previous Question
                </button>
                <button
                  className="nav-button"
                  onClick={this.handleNext}
                  disabled={currentQuestionIndex === allQuestions.length - 1}
                >
                  Next Question
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Interview;
