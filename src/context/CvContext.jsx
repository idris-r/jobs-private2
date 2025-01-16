import React, { createContext, useState } from 'react';
import { saveAsPDF, saveAsDOC } from '../utils/fileSaver';

const CvContext = createContext();

export const CvProvider = ({ children }) => {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState(null);
  const [justification, setJustification] = useState('');
  const [actionableItems, setActionableItems] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [optimizedCV, setOptimizedCV] = useState('');
  const [wordLimit, setWordLimit] = useState(200);
  const [loadingState, setLoadingState] = useState({ 
    analyzing: false, 
    generating: false, 
    optimizing: false 
  });
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const isInputEmpty = !cvText.trim() || !jobDescription.trim();

  const handleApiCall = async (prompt, stateKey, successHandler) => {
    if (!cvText.trim() || !jobDescription.trim()) {
      setError('Please provide both CV and Job Description');
      return;
    }

    setLoadingState(prev => ({ ...prev, [stateKey]: true }));
    setError('');

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: stateKey === 'optimizing' ? 2000 : 1000
        })
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      if (!responseData.choices?.[0]?.message?.content) throw new Error('Invalid API response format');

      successHandler(responseData.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setError(`${stateKey === 'analyzing' ? 'Analysis' : 
                stateKey === 'generating' ? 'Cover letter generation' : 
                'CV optimization'} failed: ${error.message}`);
    } finally {
      setLoadingState(prev => ({ ...prev, [stateKey]: false }));
    }
  };

  const analyzeContent = async () => {
    const prompt = `Analyze this CV and Job Description:
      CV: ${cvText}
      Job Description: ${jobDescription}
      Provide: 1. A suitability score (0-100) 2. A concise analysis (max 150 words, second person)
      Format response as JSON: { "score": number, "justification": string }`;

    await handleApiCall(prompt, 'analyzing', (content) => {
      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanedContent);
      setScore(result.score);
      setJustification(result.justification);
      
      const actionPrompt = `Based on this CV and Job Description:
        CV: ${cvText}
        Job Description: ${jobDescription}
        Provide: 1. Specific areas to improve 2. Actionable steps (max 150 words)
        Format as a list without bullet points`;
      
      handleApiCall(actionPrompt, 'analyzing', (actionContent) => {
        setActionableItems(actionContent);
      });
    });
  };

  const generateCoverLetter = async () => {
    const prompt = `Write a professional cover letter based on:
      CV: ${cvText}
      Job Description: ${jobDescription}
      Requirements: 1. Professional tone 2. Highlight relevant skills
      3. Under ${wordLimit} words 4. Address hiring manager
      5. Strong opening/closing`;

    await handleApiCall(prompt, 'generating', (content) => {
      setCoverLetter(content);
    });
  };

  const optimizeCV = async () => {
    const prompt = `Optimize this CV for the job description:
      Original CV: ${cvText}
      Job Description: ${jobDescription}
      Requirements: 1. Keep factual info 2. No new info
      3. Maintain format 4. Reorganize for job requirements
      5. Highlight relevant skills 6. Keep original length`;

    await handleApiCall(prompt, 'optimizing', (content) => {
      setOptimizedCV(content);
    });
  };

  const saveDocument = (type) => {
    if (!optimizedCV) {
      setError('No optimized CV to save');
      return;
    }
    type === 'pdf' ? saveAsPDF(optimizedCV) : saveAsDOC(optimizedCV);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <CvContext.Provider value={{
      cvText,
      setCvText,
      jobDescription,
      setJobDescription,
      score,
      justification,
      actionableItems,
      coverLetter,
      optimizedCV,
      wordLimit,
      setWordLimit,
      loadingState,
      error,
      isDarkMode,
      toggleTheme,
      analyzeContent,
      generateCoverLetter,
      optimizeCV,
      saveDocument,
      isInputEmpty
    }}>
      {children}
    </CvContext.Provider>
  );
};

export default CvContext;
