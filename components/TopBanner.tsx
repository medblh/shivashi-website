// components/TopBanner.tsx
"use client";

import { useState, useEffect } from 'react';
import { X, Truck, Shield, RotateCcw, Gift } from 'lucide-react';

export function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      icon: Truck,
      text: "Free Shipping From 200AED",
      highlight: "LIVRAISON GRATUITE"
    },
    {
      icon: Gift,
      text: "FlashSales : Discover our new collection",
      highlight: "NOUVEAUTÉS"
    },
    {
      icon: Shield,
      text: "Secured payment • Refund Before 30 days",
      highlight: "PAIEMENT SÉCURISÉ"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000); // Change toutes les 4 secondes

    return () => clearInterval(interval);
  }, [messages.length]);

  if (!isVisible) return null;

  const current = messages[currentMessage];

  return (
    <div className="bg-gradient-to-r from-green-800 to-green-700 text-white py-2 px-4 relative overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 text-sm font-medium animate-in fade-in duration-500">
            <current.icon className="h-4 w-4" />
            <span>
              {current.text.split(current.highlight).map((part, index, array) => 
                index === array.length - 1 ? part : (
                  <span key={index}>
                    {part}
                    <strong className="font-black">{current.highlight}</strong>
                  </span>
                )
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Bouton fermer */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors z-20"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Indicateurs de message */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              index === currentMessage ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}