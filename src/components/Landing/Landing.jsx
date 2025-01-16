import React from 'react';
import './Landing.css';
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const Landing = ({ onGetStarted }) => {
  const features = [
    {
      icon: DocumentTextIcon,
      title: 'CV Analysis',
      description: 'Get detailed insights on how well your CV matches job requirements with our AI-powered analysis.'
    },
    {
      icon: DocumentDuplicateIcon,
      title: 'CV Optimization',
      description: 'Automatically optimize your CV for each job application with tailored suggestions and improvements.'
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: 'Interview Preparation',
      description: 'Generate custom interview questions based on your CV and practice with AI-guided feedback.'
    },
    {
      icon: LightBulbIcon,
      title: 'Smart Suggestions',
      description: 'Receive intelligent recommendations to highlight your most relevant skills and experiences.'
    },
    {
      icon: ChartBarIcon,
      title: 'Match Scoring',
      description: 'See how well you match job requirements with our detailed scoring system and analytics.'
    }
  ];

  const benefits = [
    {
      title: 'Save Time and Effort',
      description: 'Automate the CV optimization process and focus on what matters most - preparing for interviews.'
    },
    {
      title: 'Increase Success Rate',
      description: 'Improve your chances of getting interviews with perfectly tailored applications.'
    },
    {
      title: 'Stay Organized',
      description: 'Manage multiple job applications efficiently with our structured approach.'
    },
    {
      title: 'Professional Guidance',
      description: 'Get expert-level advice powered by advanced AI technology.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free Trial',
      price: '0',
      tokens: '40',
      features: [
        '13 CV Analyses',
        '20 Cover Letters',
        '20 Interview Preparations',
        'Mix and match features',
        'Valid for 30 days'
      ],
      isPopular: false,
      icon: GiftIcon
    },
    {
      name: 'Starter',
      price: '1.99',
      tokens: '40',
      features: [
        '13 CV Analyses',
        '20 Cover Letters',
        '20 Interview Preparations',
        'Mix and match features',
        'Valid for 12 months'
      ],
      isPopular: false,
      icon: CurrencyDollarIcon
    },
    {
      name: 'Professional',
      price: '4.99',
      tokens: '150',
      features: [
        '50 CV Analyses',
        '75 Cover Letters',
        '75 Interview Preparations',
        'Priority Support',
        'Valid for 12 months'
      ],
      isPopular: true,
      icon: CurrencyDollarIcon
    },
    {
      name: 'Enterprise',
      price: '9.99',
      tokens: '400',
      features: [
        '133 CV Analyses',
        '200 Cover Letters',
        '200 Interview Preparations',
        'Priority Support',
        'Bulk Processing'
      ],
      isPopular: false,
      icon: CurrencyDollarIcon
    }
  ];

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>CV Senpai</h1>
          <p>
            Optimize your job applications with CV Senpai's intelligent AI analysis. Use our latest AI to help you land your dream job.
          </p>
          <button className="cta-button" onClick={onGetStarted}>
            Meet Senpai
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="hero-image">
          <img src="/snepai2.svg" alt="CV Senpai" />
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to create perfect job applications</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-section">
        <div className="section-header">
          <h2>Simple Pricing</h2>
          <p>Get 40 free tokens when you register</p>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
              {plan.isPopular && <span className="popular-badge">Most Popular</span>}
              <div className="pricing-header">
                <plan.icon className="pricing-icon" />
                <h3>{plan.name}</h3>
                <div className="pricing-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                </div>
                <div className="pricing-tokens">{plan.tokens} tokens</div>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <CheckCircleIcon className="feature-check" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="pricing-button" onClick={onGetStarted}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-header">
          <h2>Why Choose CV Senpai?</h2>
          <p>Experience the advantages of having an AI career mentor</p>
        </div>
        <div className="benefits-grid">
          <div className="benefit-content">
            <ul className="benefit-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <CheckCircleIcon className="benefit-icon" />
                  <div className="benefit-text">
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="benefit-image">
            <img src="/snepai3.svg" alt="CV Senpai Benefits" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
