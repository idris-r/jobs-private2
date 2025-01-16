import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import { SECTIONS, PROMPTS, TOKEN_COSTS, TOKEN_MESSAGES } from './utils/constants';
import { useApi } from './hooks/useApi';
import { Button, MenuItem } from './components/common/CommonComponents';
import Landing from './components/Landing/Landing';
import Input from './components/Input/Input';
import Analysis from './components/Analysis/Analysis';
import ActionableItems from './components/ActionableItems/ActionableItems';
import OptimizeCV from './components/OptimizeCV/OptimizeCV';
import CoverLetter from './components/CoverLetter/CoverLetter';
import Interview from './components/Interview/Interview';
import Billing from './components/Billing/Billing';
import Account from './components/Account/Account';
import { AuthProvider, useAuth } from './context/AuthContext';
import { extractNameFromCV } from './utils/nameExtractor';
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  DocumentDuplicateIcon, 
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ExclamationCircleIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

const MENU_ITEMS = [
  { id: SECTIONS.INPUT, icon: DocumentTextIcon, label: 'Input' },
  { id: SECTIONS.ANALYSIS, icon: ChartBarIcon, label: 'Analysis' },
  { id: SECTIONS.ACTIONABLE, icon: ClipboardDocumentListIcon, label: 'Actions' },
  { id: SECTIONS.OPTIMIZE, icon: DocumentDuplicateIcon, label: 'Optimise CV' },
  { id: SECTIONS.COVER, icon: EnvelopeIcon, label: 'Cover Letter' },
  { id: SECTIONS.INTERVIEW, icon: ChatBubbleBottomCenterTextIcon, label: 'Interview Questions' },
  { id: SECTIONS.BILLING, icon: CircleStackIcon, label: 'Billing' },
  { id: SECTIONS.ACCOUNT, icon: UserCircleIcon, label: 'Account' }
];

const AppContent = () => {
  const [state, setState] = useState({
    cvText: '',
    jobDescription: '',
    wordLimit: 200,
    activeSection: null,
    isDarkMode: true,
    originalFile: null,
    error: '',
    showError: false
  });

  const { user, updateTokenBalance } = useAuth();
  const analysisApi = useApi();
  const actionsApi = useApi();
  const coverLetterApi = useApi();
  const optimizeApi = useApi();
  const interviewApi = useApi();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setState(prev => ({ ...prev, isDarkMode: savedTheme === 'dark' }));
      document.body.classList.toggle('light-mode', savedTheme === 'light');
    }
  }, []);

  const showError = (message) => {
    setState(prev => ({ 
      ...prev, 
      error: message, 
      showError: true 
    }));
    setTimeout(() => {
      setState(prev => ({ ...prev, showError: false }));
    }, 3000);
  };

  const checkTokenBalance = (requiredTokens) => {
    if (!user) {
      handleSectionChange(SECTIONS.ACCOUNT);
      showError('Please log in to use this feature');
      return false;
    }
    
    if (user.tokenBalance < requiredTokens) {
      showError(`Insufficient tokens. You need ${requiredTokens} tokens for this action. Current balance: ${user.tokenBalance}`);
      return false;
    }
    
    return true;
  };

  const deductTokens = (amount) => {
    const newBalance = user.tokenBalance - amount;
    updateTokenBalance(newBalance);
  };

  const isInputEmpty = !state.cvText.trim() || !state.jobDescription.trim();

  const handleCvChange = useCallback((value, originalFile = null) => {
    setState(prev => ({
      ...prev,
      cvText: typeof value === 'string' ? value : value.target.value,
      originalFile: originalFile
    }));
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    setState(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSectionChange = useCallback((section) => {
    setState(prev => ({ ...prev, activeSection: section }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => {
      const newIsDarkMode = !prev.isDarkMode;
      localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
      document.body.classList.toggle('light-mode', !newIsDarkMode);
      return { ...prev, isDarkMode: newIsDarkMode };
    });
  }, []);

  const handleGetStarted = () => {
    if (state.activeSection === SECTIONS.BILLING || state.activeSection === SECTIONS.ACCOUNT) {
      return;
    }
    handleSectionChange(SECTIONS.INPUT);
  };

  // Only show landing page if no active section and not on billing or account
  if (!state.activeSection && 
      state.activeSection !== SECTIONS.BILLING && 
      state.activeSection !== SECTIONS.ACCOUNT) {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  const handleAnalyze = async () => {
    if (isInputEmpty) return false;
    if (!checkTokenBalance(TOKEN_COSTS.ANALYSIS)) return false;

    try {
      const [analysisResult, actionsResult, optimizeResult] = await Promise.all([
        analysisApi.execute(
          PROMPTS.ANALYZE(state.cvText, state.jobDescription),
          true
        ),
        actionsApi.execute(
          PROMPTS.ACTIONS(state.cvText, state.jobDescription)
        ),
        optimizeApi.execute(
          PROMPTS.OPTIMIZE(state.cvText, state.jobDescription)
        )
      ]);

      if (analysisResult) {
        deductTokens(TOKEN_COSTS.ANALYSIS);
        handleSectionChange(SECTIONS.ANALYSIS);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Analysis failed:', error);
      return false;
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (isInputEmpty) return;
    if (!checkTokenBalance(TOKEN_COSTS.COVER_LETTER)) return;
    
    const result = await coverLetterApi.execute(
      PROMPTS.COVER_LETTER(state.cvText, state.jobDescription, state.wordLimit)
    );

    if (result) {
      deductTokens(TOKEN_COSTS.COVER_LETTER);
      return formatCoverLetter(result);
    }
  };

  const handleGenerateQuestions = async () => {
    if (isInputEmpty) return;
    if (!checkTokenBalance(TOKEN_COSTS.INTERVIEW)) return;
    
    try {
      const result = await interviewApi.execute(
        PROMPTS.INTERVIEW_QUESTIONS(state.cvText, state.jobDescription),
        true
      );
      if (result) {
        deductTokens(TOKEN_COSTS.INTERVIEW);
      }
      return result;
    } catch (error) {
      console.error('Failed to generate interview questions:', error);
      return null;
    }
  };

  const formatCoverLetter = (text) => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const userName = extractNameFromCV(state.cvText);

    return text
      .replace('[Your Name]', userName)
      .replace('[Date]', today);
  };

  const renderSection = () => {
    const sections = {
      [SECTIONS.INPUT]: (
        <Input
          cvText={state.cvText}
          jobDescription={state.jobDescription}
          onCvChange={handleCvChange}
          onJobChange={handleInputChange('jobDescription')}
          onAnalyze={handleAnalyze}
          isLoading={analysisApi.loading || actionsApi.loading || optimizeApi.loading}
          error={analysisApi.error || actionsApi.error || optimizeApi.error}
        />
      ),
      [SECTIONS.ANALYSIS]: (
        <Analysis
          score={analysisApi.data?.score}
          justification={analysisApi.data?.justification}
          breakdown={analysisApi.data?.breakdown}
          cvText={state.cvText}
          jobDescription={state.jobDescription}
          error={analysisApi.error}
        />
      ),
      [SECTIONS.ACTIONABLE]: (
        <ActionableItems 
          actionableItems={actionsApi.data}
          error={actionsApi.error}
        />
      ),
      [SECTIONS.OPTIMIZE]: (
        <OptimizeCV
          optimizedCV={optimizeApi.data}
          originalCV={state.cvText}
          originalFile={state.originalFile}
          isLoading={optimizeApi.loading}
          error={optimizeApi.error}
        />
      ),
      [SECTIONS.COVER]: (
        <CoverLetter
          wordLimit={state.wordLimit}
          onWordLimitChange={handleInputChange('wordLimit')}
          onGenerate={handleGenerateCoverLetter}
          coverLetter={coverLetterApi.data}
          isLoading={coverLetterApi.loading}
          error={coverLetterApi.error}
        />
      ),
      [SECTIONS.INTERVIEW]: (
        <Interview
          cvText={state.cvText}
          jobDescription={state.jobDescription}
          error={interviewApi.error}
          isLoading={interviewApi.loading}
          onGenerate={handleGenerateQuestions}
          questions={interviewApi.data}
        />
      ),
      [SECTIONS.BILLING]: (
        <Billing />
      ),
      [SECTIONS.ACCOUNT]: (
        <Account />
      )
    };

    return sections[state.activeSection] || null;
  };

  return (
    <div className={`app-container ${state.isDarkMode ? 'dark' : 'light'}`}>
      <nav className="side-menu">
        <div className="menu-header">
          <h1>CV Senpai</h1>
        </div>
        
        <ul>
          {MENU_ITEMS.map(({ id, icon: Icon, label }) => {
            const shouldBeDisabled = isInputEmpty && 
              id !== SECTIONS.INPUT && 
              id !== SECTIONS.ACCOUNT && 
              id !== SECTIONS.BILLING;

            return (
              <MenuItem
                key={id}
                isActive={state.activeSection === id}
                disabled={shouldBeDisabled}
                onClick={() => handleSectionChange(id)}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </MenuItem>
            );
          })}
        </ul>

        {user && (
          <div className="token-balance-display">
            <CircleStackIcon className="token-icon" />
            <span className="token-amount">{user.tokenBalance}</span>
          </div>
        )}

        <div className="theme-toggle">
          <button 
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {state.isDarkMode ? (
              <>
                <SunIcon className="theme-icon" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="theme-icon" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </nav>
      
      <main className="content-area">
        {renderSection()}
        {state.showError && (
          <div className="error-notification">
            <ExclamationCircleIcon className="error-icon" />
            {state.error}
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
