// app/checkout/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StripePayment } from '@/components/StripePayment';
import { StripeProvider } from '@/providers/StripeProvider';
import { Shield, Truck, CreditCard, Lock, ArrowLeft, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Composant interne pour gérer le checkout
function CheckoutForm() {
  const { state, clearCart } = useCart(); // ✅ Correction: utiliser state au lieu de cartItems directement
  const { user } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // États du formulaire
  const [shippingInfo, setShippingInfo] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ✅ Correction: Calculer les totaux depuis state
  const subtotal = state.total;
  const shippingCost = shippingMethod === 'express' ? 9.99 : shippingMethod === 'standard' ? 4.99 : 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shippingCost + tax;

  // Créer le Payment Intent quand on arrive à l'étape de paiement
  useEffect(() => {
    if (step === 3 && state.items.length > 0) {
      createPaymentIntent();
    }
  }, [step, state.items.length]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // ✅ Convertir en cents
          currency: 'eur',
          items: state.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          }))
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur serveur');
      }

      if (!data.clientSecret) {
        throw new Error('Client secret manquant dans la réponse');
      }

      setClientSecret(data.clientSecret);
      console.log('Payment intent created successfully');
      
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      alert('Erreur lors de la configuration du paiement: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    
    if (!shippingInfo.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!shippingInfo.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!shippingInfo.email.trim()) errors.email = 'L\'email est requis';
    if (!shippingInfo.address.trim()) errors.address = 'L\'adresse est requise';
    if (!shippingInfo.city.trim()) errors.city = 'La ville est requise';
    if (!shippingInfo.postalCode.trim()) errors.postalCode = 'Le code postal est requis';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsProcessingPayment(true);
    try {
      // Sauvegarder la commande dans la base de données
      await saveOrder(paymentIntentId);
      clearCart();
      setStep(4);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Erreur lors de la sauvegarde de la commande');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Erreur de paiement: ' + error);
    setIsProcessingPayment(false);
  };

  const saveOrder = async (paymentIntentId: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          shippingInfo,
          shippingMethod,
          items: state.items,
          total,
          subtotal,
          shippingCost,
          tax
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de la commande');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  // ✅ Correction: Utiliser state.items au lieu de cartItems
  if (state.items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Cart Empty</h1>
            <p className="text-xl text-gray-600 mb-8">Your cart is empty, Add products before passing orders.</p>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 px-8 py-3">
              <Link href="/products">
                Discover collections
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Order Comfirmed !</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for ordering. An email was sent to: {shippingInfo.email}.
            </p>
            
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Order History</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Num of order:</span>
                    <span className="font-semibold">SH{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-semibold text-amber-600">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Option:</span>
                    <span className="font-semibold">
                      {shippingMethod === 'express' ? 'Express' : 'Standard'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adress of delivery:</span>
                    <span className="font-semibold text-right">
                      {shippingInfo.address}, {shippingInfo.postalCode} {shippingInfo.city}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="px-8 py-3">
                <Link href="/orders">
                  Continue my order
                </Link>
              </Button>
              <Button asChild className="bg-amber-600 hover:bg-amber-700 px-8 py-3">
                <Link href="/products">
                  Continue shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" className="p-0 hover:bg-transparent">
            <Link href="/cart" className="flex items-center text-amber-600 hover:text-amber-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to cart
            </Link>
          </Button>
          <div className="text-sm text-gray-600 hidden sm:block">
            {step === 1 && '🟢 Livraison • ⚪ Paiement • ⚪ Confirmation'}
            {step === 2 && '✅ Livraison • 🟢 Paiement • ⚪ Confirmation'}
            {step === 3 && '✅ Livraison • ✅ Paiement • 🟢 Confirmation'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Étape 1: Adresse de livraison */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-amber-600" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStep1Submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                          className={formErrors.firstName ? 'border-red-500' : ''}
                        />
                        {formErrors.firstName && (
                          <p className="text-sm text-red-600">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                          className={formErrors.lastName ? 'border-red-500' : ''}
                        />
                        {formErrors.lastName && (
                          <p className="text-sm text-red-600">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                      {formErrors.email && (
                        <p className="text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adress *</Label>
                      <Input
                        id="address"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className={formErrors.address ? 'border-red-500' : ''}
                      />
                      {formErrors.address && (
                        <p className="text-sm text-red-600">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                          className={formErrors.city ? 'border-red-500' : ''}
                        />
                        {formErrors.city && (
                          <p className="text-sm text-red-600">{formErrors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input
                          id="postalCode"
                          required
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                          className={formErrors.postalCode ? 'border-red-500' : ''}
                        />
                        {formErrors.postalCode && (
                          <p className="text-sm text-red-600">{formErrors.postalCode}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          required
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 py-3">
                      Continue to shipping
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Étape 2: Méthode de livraison */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-amber-600" />
                    Shipping option
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Standard Shipping</p>
                            <p className="text-sm text-gray-600">3-5 Days</p>
                          </div>
                          <span className="font-semibold">AED4.99</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Express Shipping</p>
                            <p className="text-sm text-gray-600">1-2 Days</p>
                          </div>
                          <span className="font-semibold">AED9.99</span>
                        </div>
                      </Label>
                    </div>

                    {subtotal > 100 && (
                      <div className="flex items-center space-x-4 p-4 border-2 border-amber-200 rounded-lg bg-amber-50 cursor-pointer">
                        <RadioGroupItem value="free" id="free" />
                        <Label htmlFor="free" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Free Shipping</p>
                              <p className="text-sm text-gray-600">3-5 jours ouvrés</p>
                            </div>
                            <span className="font-semibold text-amber-600">Free</span>
                          </div>
                        </Label>
                      </div>
                    )}
                  </RadioGroup>

                  <div className="flex gap-4 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Retour
                    </Button>
                    <Button 
                      type="button" 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 py-3"
                      onClick={() => setStep(3)}
                      disabled={!shippingMethod}
                    >
                      {shippingMethod ? 'Procéder au Paiement' : 'Choisissez une livraison'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 3: Paiement */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                    Secured payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-600 mr-2" />
                      <span>Payment in process...</span>
                    </div>
                  ) : clientSecret ? (
                    <StripePayment
                    amount={Math.round(total * 100)}
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isProcessing={isProcessingPayment}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Error while payment</p>
                      <Button onClick={createPaymentIntent}>
                        Retry
                      </Button>
                    </div>
                  )}
                  
                  {/* Informations de sécurité */}
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-amber-800">Payment 100% secured</span>
                    </div>
                    <div className="text-xs text-amber-700 space-y-1">
                      <p>✓ Cryptage SSL 256 bits</p>
                      <p>✓ Certifié PCI DSS</p>
                      <p>✓ Protected Payment details</p>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setStep(2)}
                  >
                    Retour
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Résumé de la commande */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Articles */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {state.items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center border border-amber-200 flex-shrink-0">
                          <div className="text-center text-amber-800">
                            <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center mx-auto">
                              <span className="text-xs font-bold">S</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Size: {item.size} • Color: {item.color}
                          </p>
                          <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Livraison</span>
                      <span>
                        {shippingMethod === 'free' ? 'Gratuit' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>VAT (20%)</span>
                      <span>AED{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-amber-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Achat sécurisé</span>
                </div>
                <div className="text-xs text-amber-700 space-y-1">
                  <p>✓ Paiement 100% sécurisé</p>
                  <p>✓ Retours gratuits sous 30 jours</p>
                  <p>✓ Garantie satisfait ou remboursé</p>
                  <p>✓ Support client 7j/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page principale wrapper avec Stripe Provider
export default function CheckoutPage() {
  return (
    <StripeProvider>
      <CheckoutForm />
    </StripeProvider>
  );
}