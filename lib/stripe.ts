// lib/stripe.ts
import Stripe from 'stripe';

// Clés de test Stripe pour développement
const DEVELOPMENT_KEYS = {
  secretKey: 'sk_test_51P8pOMEvH2n8NlBw4n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n',
  publishableKey: 'pk_test_51P8pOMEvH2n8NlBw4n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n8n'
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || DEVELOPMENT_KEYS.secretKey;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

export const getStripePublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY || DEVELOPMENT_KEYS.publishableKey;
};