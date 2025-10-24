// app/cart/page.tsx
"use client";

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart(); // ✅ Utiliser state
  const cartItems = state.items; // ✅ Récupérer les items depuis state
  const total = state.total; // ✅ Récupérer le total depuis state
  const itemCount = state.itemCount; // ✅ Récupérer le count depuis state

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(id);
    updateQuantity(id, newQuantity);
    
    // Petit délai pour l'animation
    setTimeout(() => setIsUpdating(null), 300);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Cart empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your cart is empty. Discover our collections and choose something you like.
            </p>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 px-8 py-3">
              <Link href="/products">
                Discover collection.
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My cart</h1>
          <div className="text-lg text-gray-600">
            {itemCount} {itemCount > 1 ? 'articles' : 'article'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={`${item.id}-${item.size}`} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Image du produit */}
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center border border-amber-200 flex-shrink-0">
                      <div className="text-center text-amber-800">
                        <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center mx-auto">
                          <span className="text-sm font-bold">S</span>
                        </div>
                      </div>
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Size: {item.size} | Color: {item.color}</p>
                        <p className="font-semibold text-amber-600">${item.price}</p>
                      </div>
                    </div>

                    {/* Contrôles de quantité */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating === item.id}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity || isUpdating === item.id}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Prix total pour cet article */}
                      <div className="text-right min-w-20">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Bouton vider le panier */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Empty the cart
              </Button>
            </div>
          </div>

          {/* Résumé de commande */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} articles)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA (20%)</span>
                    <span>${(total * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-amber-600">
                        ${(total * 1.2).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-6 bg-amber-600 hover:bg-amber-700 py-3">
                  <Link href="/checkout" className="flex items-center justify-center">
                    Proceed to payment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <div className="mt-4 text-center">
                  <Link 
                    href="/products" 
                    className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    ← Continue shopping
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-800 mb-3">Secure purchase</h4>
                <div className="text-xs text-amber-700 space-y-1">
                  <p>✓ 100% secure payment</p>
                  <p>✓ Free returns within 30 days</p>
                  <p>✓ Satisfaction guaranteed or your money back</p>
                  <p>✓ Customer support 7 days a week</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}