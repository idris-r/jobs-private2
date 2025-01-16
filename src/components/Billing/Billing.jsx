import React, { useState, useEffect } from 'react';
import './Billing.css';
import { SectionHeader } from '../common/CommonComponents';
import { PRICING_TIERS, FEATURE_DESCRIPTIONS } from '../../constants/pricing';
import { useAuth } from '../../context/AuthContext';
import { initiateCheckout, getStripe } from '../../utils/stripe';
import { 
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChatBubbleBottomCenterTextIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const Billing = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stripeReady, setStripeReady] = useState(false);

  // Initialize Stripe when component mounts
  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripe = await getStripe();
        if (stripe) {
          console.log('Stripe initialized successfully');
          setStripeReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        setError('Failed to initialize payment system');
      }
    };

    initStripe();
  }, []);

  const handlePurchase = async (tier) => {
    if (!stripeReady) {
      setError('Payment system is not ready yet. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      console.log('Starting purchase process for tier:', tier.label);

      const result = await initiateCheckout(tier.label.toUpperCase());
      
      if (!result) {
        throw new Error('Failed to initiate checkout');
      }

      // If we get here without being redirected, something went wrong
      console.error('Checkout completed without redirect');
      setError('Failed to redirect to payment page. Please try again.');
    } catch (error) {
      console.error('Purchase failed:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div className="billing-section">
      <SectionHeader>Billing & Tokens</SectionHeader>

      {user && (
        <div className="token-balance-display">
          <CurrencyDollarIcon className="token-icon" />
          <span className="token-amount">{user.tokenBalance} tokens available</span>
        </div>
      )}

      <div className="pricing-container">
        <div className="pricing-header">
          <h3>Purchase Tokens</h3>
          <p>Choose the plan that best fits your needs</p>
        </div>
        <div className="pricing-grid">
          {Object.values(PRICING_TIERS).map((tier) => (
            <div key={tier.label} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
              {tier.popular && <span className="popular-badge">Most Popular</span>}
              <div className="card-header">
                <div className="plan-name">{tier.label}</div>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{tier.price}</span>
                </div>
                <div className="plan-tokens">{tier.tokens} tokens</div>
              </div>
              <ul className="plan-features">
                {tier.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <CheckCircleIcon className="feature-check" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className="purchase-button"
                onClick={() => handlePurchase(tier)}
                disabled={!user || isLoading || !stripeReady}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Processing...
                  </>
                ) : !stripeReady ? (
                  <>
                    <div className="loading-spinner"></div>
                    Initializing...
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="purchase-button-icon" />
                    {!user ? 'Login to Purchase' : 'Purchase Now'}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="token-costs">
        <div className="costs-header">
          <h3>Token Costs</h3>
        </div>
        <div className="costs-grid">
          {Object.entries(FEATURE_DESCRIPTIONS).map(([key, feature]) => {
            const Icon = key === 'ANALYSIS' ? DocumentTextIcon :
                       key === 'COVER_LETTER' ? DocumentDuplicateIcon :
                       ChatBubbleBottomCenterTextIcon;
            
            return (
              <div key={key} className="cost-card">
                <div className="cost-header">
                  <Icon className="cost-icon" />
                  <div className="cost-title">
                    <div className="cost-name">{feature.name}</div>
                    <div className="cost-tokens">
                      <CurrencyDollarIcon className="token-icon" />
                      {feature.tokens} tokens
                    </div>
                  </div>
                </div>
                <div className="cost-description">
                  {feature.description}
                </div>
                <div className="cost-details">
                  {feature.details}
                </div>
              </div>
            )}
          )}
        </div>
      </div>

      {error && (
        <div className="error-notification" onClick={clearError}>
          <ExclamationCircleIcon className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      <style jsx>{`
        .loading-spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-notification {
          animation: slideIn 0.3s ease-out;
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background-color: #ef4444;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          max-width: 400px;
          cursor: pointer;
        }

        .error-notification .error-icon {
          width: 1.5rem;
          height: 1.5rem;
          flex-shrink: 0;
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .error-notification {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Billing;
