// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'eur' } = await request.json();

    console.log('Creating payment intent for amount:', amount);

    // Créer un Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        test: 'true'
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Erreur lors de la création du paiement',
        details: error.type
      },
      { status: 500 }
    );
  }
}