"use client";

import { useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface CartToastProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
  productPrice: number;
  productImage: string;
  productSize?: number | null;
  productColor?: string;
  quantity?: number;
}

export function CartToast({ 
  isVisible, 
  onClose, 
  productName, 
  productPrice, 
  productImage,
  productSize,
  productColor,
  quantity = 1
}: CartToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm w-full">
        <div className="flex items-start gap-3">
          {/* Icône de succès */}
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
            <Check className="h-4 w-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* En-tête */}
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 text-sm">
                Ajouté au panier !
              </h4>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Informations du produit */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {productName}
              </p>
              
              {/* Détails supplémentaires */}
              <div className="space-y-1 text-xs text-gray-600">
                {productSize && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Taille:</span>
                    <span>{productSize}</span>
                  </div>
                )}
                
                {productColor && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Couleur:</span>
                    <span>{productColor}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">Quantité:</span>
                  <span>{quantity}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">Prix:</span>
                  <span className="text-green-600 font-semibold">
                    ${(productPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton d'action */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
              >
                Voir le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}