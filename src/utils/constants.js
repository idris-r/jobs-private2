export const API_ENDPOINTS = {
  DEEPSEEK: 'https://api.deepseek.com/v1/chat/completions'
};

export const SECTIONS = {
  INPUT: 'input',
  ANALYSIS: 'analysis',
  ACTIONABLE: 'actionableItems',
  OPTIMIZE: 'optimizeCV',
  COVER: 'coverLetter',
  INTERVIEW: 'interview',
  ACCOUNT: 'account'
};

export const TOKEN_COSTS = {
  ANALYSIS: 3,
  COVER_LETTER: 2,
  OPTIMIZE: 2,
  INTERVIEW: 2
};

export const PRICING_TIERS = {
  STARTER: {
    tokens: 40,
    price: 1.99,
    label: 'Starter',
    description: 'Perfect for a single job application',
    popular: false,
    features: [
      '13 CV Analyses (3 tokens each)',
      '20 Cover Letters (2 tokens each)',
      '20 Interview Preparations (2 tokens each)',
      'Mix and match features as needed',
      'Valid for 12 months'
    ]
  },
  PROFESSIONAL: {
    tokens: 150,
    price: 4.99,
    label: 'Professional',
    description: 'Ideal for active job seekers',
    popular: true,
    features: [
      '50 CV Analyses (3 tokens each)',
      '75 Cover Letters (2 tokens each)',
      '75 Interview Preparations (2 tokens each)',
      'Mix and match features as needed',
      'Valid for 12 months',
      'Priority Support'
    ]
  },
  ENTERPRISE: {
    tokens: 400,
    price: 9.99,
    label: 'Enterprise',
    description: 'Best value for extensive job search',
    popular: false,
    features: [
      '133 CV Analyses (3 tokens each)',
      '200 Cover Letters (2 tokens each)',
      '200 Interview Preparations (2 tokens each)',
      'Mix and match features as needed',
      'Valid for 12 months',
      'Priority Support',
      'Bulk Processing Available'
    ]
  }
};

export const FEATURE_DESCRIPTIONS = {
  ANALYSIS: {
    name: 'CV Analysis',
    description: 'Complete analysis of your CV against job requirements',
    tokens: 3,
    details: 'Includes matching score, detailed breakdown, and improvement suggestions'
  },
  COVER_LETTER: {
    name: 'Cover Letter Generation',
    description: 'AI-powered custom cover letter creation',
    tokens: 2,
    details: 'Tailored to job requirements with your experience highlights'
  },
  INTERVIEW: {
    name: 'Interview Preparation',
    description: 'Customized interview questions and preparation',
    tokens: 2,
    details: 'Generate role-specific questions with answer guidelines'
  }
};

export const SCORE_WEIGHTS = {
  REQUIRED_SKILLS: 0.35,
  EXPERIENCE_MATCH: 0.25,
  EDUCATION_MATCH: 0.15,
  KEYWORD_MATCH: 0.15,
  SOFT_SKILLS: 0.10
};

export const PROMPTS = {
  ANALYZE: (cv, job) => `
    Analyze this CV against the job description and provide a detailed compatibility analysis.
    
    CV: ${cv}
    Job Description: ${job}

    Instructions for Analysis:
    1. Required Skills & Qualifications:
       - Extract mandatory skills/requirements from the job description
       - Check for presence and depth in CV
       - Calculate match percentage for must-have requirements
    
    2. Experience Match:
       - Compare required years of experience with CV
       - Evaluate relevance of past roles
       - Assess industry alignment
    
    3. Education Requirements:
       - Compare required vs. actual education level
       - Check for specific certifications or qualifications
    
    4. Keyword Analysis:
       - Identify industry-specific terms in job description
       - Calculate percentage of matching technical terms
    
    5. Soft Skills:
       - Identify required soft skills
       - Evaluate evidence of these in CV
    
    Calculate final score using these weights:
    - Required Skills: 35%
    - Experience Match: 25%
    - Education Match: 15%
    - Keyword Match: 15%
    - Soft Skills: 10%

    Format response as JSON:
    {
      "score": number (0-100),
      "breakdown": {
        "requiredSkills": {
          "score": number,
          "found": [string],
          "missing": [string],
          "summary": string (max 150 words explaining the score)
        },
        "experience": {
          "score": number,
          "yearsMatch": boolean,
          "relevance": "high|medium|low",
          "summary": string (max 150 words explaining the score)
        },
        "education": {
          "score": number,
          "matches": boolean,
          "notes": string,
          "summary": string (max 150 words explaining the score)
        },
        "keywords": {
          "score": number,
          "matched": [string],
          "missing": [string],
          "summary": string (max 150 words explaining the score)
        },
        "softSkills": {
          "score": number,
          "identified": [string],
          "summary": string (max 150 words explaining the score)
        }
      },
      "justification": string (detailed explanation in second person),
      "improvementAreas": [string]
    }`,

  ACTIONS: (cv, job) => `
    Based on this CV and Job Description:
    CV: ${cv}
    Job Description: ${job}

    Analyze the gaps between the CV and job requirements, then provide specific, actionable improvements.
    For each improvement, carefully evaluate its priority based on:
    1. Alignment with core job requirements (must-have vs nice-to-have)
    2. Potential impact on application success
    3. Competitive advantage gained

    Format the response as a JSON array:
    {
      "actions": [
        {
          "title": "string (category of improvement)",
          "action": "string (specific action to take)",
          "priority": "high|medium|low",
          "reasoning": "string (brief explanation of why this matters)"
        }
      ]
    }

    Priority Guidelines:
    - High: Critical for meeting core job requirements or significant competitive advantage
    - Medium: Important but not critical, or longer-term improvements
    - Low: Nice-to-have improvements or minimal impact on application success

    Keep the total number of actions between 5-7 items.
    Order actions by priority (high to low).
    Make each action specific, measurable, and directly tied to job requirements.
    `,

  OPTIMIZE: (cv, job) => `
    Analyze this CV against the job description and identify specific improvements that would increase match rate.
    
    CV: ${cv}
    Job Description: ${job}

    Instructions:
    1. First, extract key requirements and skills from the job description
    2. For each identified point in the CV:
       - Find specific text that could better match the job requirements
       - Provide an improved version that:
         * Incorporates relevant keywords from the job description
         * Emphasizes experiences that directly match job requirements
         * Quantifies achievements where possible
         * Uses terminology aligned with the job posting
         * Maintains similar length to original
       - Explain specifically how this improvement matches job requirements
       - Rate the impact based on relevance to key job requirements
    3. Focus on:
       * Skills mentioned in job description but understated in CV
       * Experiences that match job requirements but need better phrasing
       * Achievements that could be reworded to match job criteria
       * Technical terms or industry language from the job posting

    Return ONLY a JSON object in this exact format (no other text):
    {
      "improvements": [
        {
          "original": "exact original text",
          "improved": "enhanced version aligned with job requirements",
          "location": "section location in CV",
          "impact": "high|medium|low",
          "matchedRequirements": ["list", "of", "matched", "job", "requirements"]
        }
      ]
    }`,
  
  COVER_LETTER: (cv, job, limit) => `
    Create a compelling cover letter that effectively bridges your CV with the job requirements.
    
    CV: ${cv}
    Job Description: ${job}
    Word Limit: ${limit}

    Instructions:
    1. Opening Paragraph:
       - Start with a strong hook
       - Show enthusiasm for the role and company
       - Briefly mention how you learned about the position

    2. Body Paragraphs:
       - Focus on 2-3 most relevant experiences/skills from your CV
       - Directly connect your achievements to job requirements
       - Use specific examples and metrics
       - Mirror the company's language and values

    3. Closing:
       - Reiterate your interest and fit
       - Include a clear call to action
       - Maintain professional tone

    Requirements:
    - Keep under ${limit} words
    - Use natural, confident language
    - Address the hiring manager professionally
    - Focus on value you'll bring to the role
    - Include relevant keywords from job description

    Write in first person and maintain a professional yet engaging tone.`,

  INTERVIEW_QUESTIONS: (cv, job) => `
    Generate interview questions based on this CV and job description.
    
    CV: ${cv}
    Job Description: ${job}

    Create a mix of questions covering:
    1. Technical skills and knowledge
    2. Background and experience
    3. Role suitability and cultural fit
    4. Specific points from the CV

    Return ONLY a JSON array in this exact format (no other text):
    {
      "questions": [
        {
          "type": "technical",
          "question": "string"
        },
        {
          "type": "background",
          "question": "string"
        },
        {
          "type": "suitability",
          "question": "string"
        },
        {
          "type": "specific",
          "question": "string"
        }
      ]
    }

    Generate 5 questions for each category (20 total).
    Ensure questions are:
    - Specific to the role and candidate
    - Mix of behavioral and situational
    - Clear and concise
    - Relevant to job requirements
    - Technical questions should focus on required skills
    - Background questions should explore past experiences
    - Suitability questions should assess cultural fit
    - Specific questions should address unique points in the CV
  `
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'An account with this email already exists',
  REQUIRED_FIELDS: 'Please fill in all required fields',
  INSUFFICIENT_TOKENS: 'Insufficient tokens to perform this action',
  NOT_AUTHENTICATED: 'Please log in to access this feature',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  INVALID_AMOUNT: 'Invalid token amount selected'
};

export const INITIAL_TOKEN_BALANCE = 5;

export const TOKEN_MESSAGES = {
  INSUFFICIENT: 'You need more tokens to use this feature',
  DEDUCTED: (amount) => `${amount} tokens deducted from your balance`,
  BALANCE: (amount) => `${amount} tokens remaining`,
  PURCHASE_SUCCESS: (amount) => `Successfully purchased ${amount} tokens`,
  LOW_BALANCE: 'Your token balance is running low'
};

export const API_COSTS = {
  INPUT_CACHE_HIT: 0.07 / 1000000,  // per token
  INPUT_CACHE_MISS: 0.27 / 1000000, // per token
  OUTPUT: 1.1 / 1000000             // per token
};

export const ERROR_MESSAGES = {
  API_ERROR: 'An error occurred while processing your request',
  RATE_LIMIT: 'Too many requests. Please try again later',
  INVALID_INPUT: 'Please check your input and try again',
  SERVER_ERROR: 'Server error. Please try again later',
  TIMEOUT: 'Request timed out. Please try again'
};
