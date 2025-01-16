export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'An account with this email already exists',
  REQUIRED_FIELDS: 'Please fill in all required fields',
  INSUFFICIENT_TOKENS: 'Insufficient tokens to perform this action',
  NOT_AUTHENTICATED: 'Please log in to access this feature',
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  INVALID_AMOUNT: 'Invalid token amount selected'
};

export const INITIAL_TOKEN_BALANCE = 7; // Single source of truth for initial token balance

export const TOKEN_MESSAGES = {
  INSUFFICIENT: 'You need more tokens to use this feature',
  DEDUCTED: (amount) => `${amount} tokens deducted from your balance`,
  BALANCE: (amount) => `${amount} tokens remaining`,
  PURCHASE_SUCCESS: (amount) => `Successfully purchased ${amount} tokens`,
  LOW_BALANCE: 'Your token balance is running low'
};
