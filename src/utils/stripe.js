import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = 'pk_test_51QhDldKtLa4Zr7dcAoxlbjD5B1oclDZoL2SakEHJfjpHIbHUDS4LAdrcbtd2R1mI53mnnwNuIaUjNRrjK7E7Zrpi00RZjwOnbC';

// Initialize Stripe Promise
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PRICE_IDS = {
  STARTER: 'price_1QhbhMKtLa4Zr7dcMaUc9D53',
  PROFESSIONAL: 'price_1QhfgkKtLa4Zr7dc9Pmq40kg',
  ENTERPRISE: 'price_1QhfhGKtLa4Zr7dczhY8KMx1'
};

export const getStripe = async () => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    return stripe;
  } catch (error) {
    console.error('Error getting Stripe instance:', error);
    throw error;
  }
};

export const initiateCheckout = async (tier) => {
  try {
    console.log('Starting checkout process...');
    
    const stripe = await getStripe();
    console.log('Stripe instance obtained');

    const response = await fetch('http://localhost:5000/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: PRICE_IDS[tier],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const session = await response.json();
    console.log('Session created:', session.id);

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

// Export for debugging
window.debugStripe = async () => {
  try {
    const stripe = await getStripe();
    console.log('Stripe debug - loaded:', !!stripe);
    return stripe;
  } catch (error) {
    console.error('Stripe debug error:', error);
    throw error;
  }
};
