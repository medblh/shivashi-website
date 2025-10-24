"use client";

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Home, Gem, User, Phone, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header() {
  const { state } = useCart(); // ✅ Correction: utiliser state au lieu de getCartItemsCount
  const { user, logout } = useAuth();
  const cartItemsCount = state.itemCount; // ✅ Accéder au count via state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setShowSearch(false);
    }
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setShowSearch(false);
    setUserMenuOpen(false);
  };

  const handleMobileLinkClick = () => {
    closeAllMenus();
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    closeAllMenus();
  };

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* GAUCHE : Recherche et Menu */}
          <div className="flex items-center space-x-4">
            {/* Bouton Recherche */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setShowSearch(!showSearch);
                setMobileMenuOpen(false);
                setUserMenuOpen(false);
              }}
              className="h-9 w-9"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Bouton Menu - Visible sur tous les écrans */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Logo au CENTRE */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/SHIVASHI LOGO.png"
                alt="Shivashi Logo"
                width={120}
                height={40}
                className="hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
          </div>

          {/* DROITE : Utilisateur et Panier */}
          <div className="flex items-center space-x-2 z-40">
            {/* Menu Utilisateur */}
            <div className="relative">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="h-9 w-9"
                  >
                    <UserIcon className="h-4 w-4" />
                  </Button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border py-2 z-50 animate-in fade-in duration-200">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Mon Profil
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Mes Commandes
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        LogOut
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Button asChild variant="ghost" size="sm" className="h-9">
                  <Link href="/auth/login" className="flex items-center space-x-1">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">LogIn</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Panier */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
              <Link href="/cart" onClick={closeAllMenus}>
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        {showSearch && (
          <div className="pb-4 animate-in fade-in duration-200 z-30 relative">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Menu Mobile/Desktop Unifié */}
        {mobileMenuOpen && (
          <>
            {/* Overlay sombre */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 top-0 left-0"
              onClick={closeAllMenus}
            />
            
            {/* Menu */}
            <div className="fixed top-0 left-0 right-0 bg-white shadow-2xl z-50 animate-in slide-in-from-top-5 duration-200 h-screen overflow-y-auto md:w-80">
              {/* En-tête du menu */}
              <div className="flex justify-between items-center p-4 border-b">
                <div className="text-lg font-semibold">Menu</div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeAllMenus}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Section Utilisateur */}
              {user ? (
                <div className="p-4 bg-green-50 border-b">
                  <p className="font-medium text-gray-900">Welcome, {user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex space-x-2 mt-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href="/profile" onClick={handleMobileLinkClick}>
                        Profil
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={handleLogout}>
                      LogOut
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-b">
                  <Button asChild className="w-full" onClick={handleMobileLinkClick}>
                    <Link href="/auth/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex flex-col p-4 space-y-1">
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                  onClick={handleMobileLinkClick}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  href="/products" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                  onClick={handleMobileLinkClick}
                >
                  <Gem className="h-5 w-5" />
                  <span>Collections</span>
                </Link>
                
                <Link 
                  href="/about" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                  onClick={handleMobileLinkClick}
                >
                  <User className="h-5 w-5" />
                  <span>About</span>
                </Link>
                
                <Link 
                  href="/contact" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all"
                  onClick={handleMobileLinkClick}
                >
                  <Phone className="h-5 w-5" />
                  <span>Contact</span>
                </Link>

                {/* Liens utilisateur connecté */}
                {user && (
                  <>
                    <Link 
                      href="/orders" 
                      className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                      onClick={handleMobileLinkClick}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Orders</span>
                    </Link>
                  </>
                )}
              </nav>

              {/* Informations de contact */}
              <div className="p-4 mt-8 bg-gray-50 rounded-lg mx-4">
                <h3 className="font-semibold mb-3 text-gray-900">Contact</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>+971 523 45 6789</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span>✉️</span>
                    <span>contact@shivashi.com</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span>🕒</span>
                    <span>Mon-Sat: 9h-18h</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}