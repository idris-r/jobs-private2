export const API_ENDPOINTS = {
  DEEPSEEK: 'https://api.deepseek.com/v1/chat/completions'
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
