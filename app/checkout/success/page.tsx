// app/checkout/success/page.tsx
"use client";

import { useEffect } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    // Vous pouvez récupérer les détails de la commande ici
    if (paymentIntentId) {
      console.log('Payment successful:', paymentIntentId);
    }
  }, [paymentIntentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Paiement Réussi !</h1>
          <p className="text-xl text-gray-600 mb-8">
            Merci pour votre achat. Votre commande a été confirmée.
          </p>
          
          <div className="bg-white rounded-xl border py-6 shadow-sm mb-8">
            <div className="px-6">
              <h3 className="font-semibold text-lg mb-4">Détails de la commande</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Référence:</span>
                  <span className="font-semibold">SH{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction:</span>
                  <span className="font-semibold">{paymentIntentId?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email de confirmation:</span>
                  <span className="font-semibold">Envoyé</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="px-8 py-3">
              <Link href="/orders">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Suivre ma commande
              </Link>
            </Button>
            <Button asChild className="bg-amber-600 hover:bg-amber-700 px-8 py-3">
              <Link href="/products">
                Continuer mes achats
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}