"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  size: number;
  quantity: number;
  color: string;
  maxQuantity: number;
}

export interface CartItem extends CartProduct {
  // Vous pouvez ajouter d'autres propriétés spécifiques au panier si nécessaire
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartProduct }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Fonctions utilitaires
  getCartItemsCount: () => number;
  getCartTotal: () => number;
  getCartItems: () => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité si l'article existe déjà avec la même taille
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { 
                ...item, 
                quantity: Math.min(item.quantity + action.payload.quantity, item.maxQuantity)
              }
            : item
        );

        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount,
        };
      } else {
        // Ajouter un nouvel article
        const newItem: CartItem = {
          ...action.payload,
        };

        const updatedItems = [...state.items, newItem];
        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount,
        };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(action.payload.quantity, item.maxQuantity) }
          : item
      );

      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product: CartProduct) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // ✅ Fonctions utilitaires
  const getCartItemsCount = () => state.itemCount;
  const getCartTotal = () => state.total;
  const getCartItems = () => state.items;

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal,
    getCartItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}