export const TOKEN_COSTS = {
  ANALYSIS: 3,
  COVER_LETTER: 2,
  OPTIMIZE: 2,
  INTERVIEW: 2
};

export const PRICING_TIERS = {
  STARTER: {
    tokens: 42,
    price: 1.99,
    label: 'Starter',
    description: 'Perfect for your first job applications',
    popular: false,
    features: []
  },
  PROFESSIONAL: {
    tokens: 155,
    price: 4.99,
    label: 'Professional',
    description: 'Ideal for active job seekers',
    popular: true,
    features: []
  },
  ENTERPRISE: {
    tokens: 400,
    price: 9.99,
    label: 'Enterprise',
    description: 'Best value for extensive job search',
    popular: false,
    features: []
  }
};

export const FEATURE_DESCRIPTIONS = {
  ANALYSIS: {
    name: 'CV Analysis',
    description: 'Required first step: Analysis and match score for your CV',
    tokens: 3,
    details: 'Must be completed before other features'
  },
  COVER_LETTER: {
    name: 'Cover Letter',
    description: 'Generate a tailored cover letter based on CV analysis',
    tokens: 2,
    details: 'Requires CV analysis first'
  },
  INTERVIEW: {
    name: 'Interview Preparation',
    description: 'Get customized interview questions based on CV analysis',
    tokens: 2,
    details: 'Requires CV analysis first'
  }
};
