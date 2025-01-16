import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe('sk_test_51QhDldKtLa4Zr7dcrEBesYpq1yaRGAzGrt1cu6fGA0CuIJ4XaMNbHhO6Q8HdKh25mQPRNagTEwBm04NH94rNZZct00fua1PjWb');

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId } = req.body;
    
    console.log('Creating checkout session for price:', priceId);

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    console.log('Session created:', session);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
