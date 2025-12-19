"use client";

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Home, Gem, User, Phone, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const cartItemsCount = state.itemCount;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === '/';

  // Gestion du scroll pour changer l'apparence du header (uniquement sur la homepage)
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true); // Toujours en mode "scrolled" sur les autres pages
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

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

  // Déterminer la classe du header en fonction de la page et du scroll
  const getHeaderClass = () => {
    if (!isHomePage) {
      return 'bg-white shadow-sm border-b'; // Header basique pour les autres pages
    }
    return isScrolled 
      ? 'bg-white shadow-sm border-b' 
      : 'bg-transparent';
  };

  // Déterminer la classe des boutons
  const getButtonClass = (isScrolledState: boolean) => {
    if (!isHomePage) {
      return 'text-gray-700 hover:bg-gray-100'; // Style basique pour les autres pages
    }
    return isScrolledState 
      ? 'text-gray-700 hover:bg-gray-100' 
      : 'text-white hover:bg-white/20';
  };

  // Déterminer la classe du badge du panier
  const getCartBadgeClass = (isScrolledState: boolean) => {
    if (!isHomePage) {
      return 'bg-green-600 text-white'; // Style basique pour les autres pages
    }
    return isScrolledState 
      ? 'bg-green-600 text-white' 
      : 'bg-white text-green-600';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderClass()}`}>
      {/* Ajustement pour la top banner - uniquement sur la homepage */}
      {isHomePage && (
        <div 
          className={`transition-all duration-300 ${
            isScrolled ? 'pt-0' : 'pt-12'
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* GAUCHE : Recherche et Menu */}
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setShowSearch(!showSearch);
                    setMobileMenuOpen(false);
                    setUserMenuOpen(false);
                  }}
                  className={`h-9 w-9 ${getButtonClass(isScrolled)}`}
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`z-50 ${getButtonClass(isScrolled)}`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>

              {/* Logo au CENTRE */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" className="flex items-center">
                  {/* Logo pour la homepage avec transition */}
                  {isHomePage ? (
                    <>
                      {/* Logo blanc (transparent) */}
                      <div className={`transition-opacity duration-300 ${
                        isScrolled ? 'opacity-0 absolute' : 'opacity-100'
                      }`}>
                        <Image
                          src="/images/SHIVASHI LOGO.png"
                          alt="Shivashi Logo"
                          width={120}
                          height={40}
                          className="hover:opacity-80 transition-opacity"
                          priority
                        />
                      </div>
                      
                      {/* Logo coloré (sticky) */}
                      <div className={`transition-opacity duration-300 ${
                        isScrolled ? 'opacity-100' : 'opacity-0 absolute'
                      }`}>
                        <Image
                          src="/images/SHIVASHI LOGO1.png"
                          alt="Shivashi Logo"
                          width={120}
                          height={40}
                          className="hover:opacity-80 transition-opacity"
                          priority
                        />
                      </div>
                    </>
                  ) : (
                    /* Logo basique pour les autres pages */
                    <Image
                      src="/images/SHIVASHI LOGO1.png"
                      alt="Shivashi Logo"
                      width={120}
                      height={40}
                      className="hover:opacity-80 transition-opacity"
                      priority
                    />
                  )}
                </Link>
              </div>

              {/* DROITE : Utilisateur et Panier */}
              <div className="flex items-center space-x-2 z-40">
                <div className="relative">
                  {user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className={`h-9 w-9 ${getButtonClass(isScrolled)}`}
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
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm" 
                      className={`h-9 ${getButtonClass(isScrolled)}`}
                    >
                      <Link href="/auth/login" className="flex items-center space-x-1">
                        <LogIn className="h-4 w-4" />
                        <span className="hidden sm:inline">LogIn</span>
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Panier */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`relative h-9 w-9 ${getButtonClass(isScrolled)}`} 
                  asChild
                >
                  <Link href="/cart" onClick={closeAllMenus}>
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemsCount > 0 && (
                      <span className={`absolute -top-1 -right-1 rounded-full w-4 h-4 text-[10px] flex items-center justify-center ${
                        getCartBadgeClass(isScrolled)
                      }`}>
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
          </div>
        </div>
      )}

      {/* Structure pour les autres pages (sans ajustement top banner) */}
      {!isHomePage && (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* GAUCHE : Recherche et Menu */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setMobileMenuOpen(false);
                  setUserMenuOpen(false);
                }}
                className="h-9 w-9 text-gray-700 hover:bg-gray-100"
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="z-50 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Logo au CENTRE */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/SHIVASHI LOGO1.png"
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
              <div className="relative">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="h-9 w-9 text-gray-700 hover:bg-gray-100"
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
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 text-gray-700 hover:bg-gray-100"
                  >
                    <Link href="/auth/login" className="flex items-center space-x-1">
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline">LogIn</span>
                    </Link>
                  </Button>
                )}
              </div>

              {/* Panier */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 text-gray-700 hover:bg-gray-100" 
                asChild
              >
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

          {/* Barre de recherche pour les autres pages */}
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
        </div>
      )}

      {/* Menu Mobile/Desktop Unifié (commun à toutes les pages) */}
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
                href="/collections" 
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                onClick={handleMobileLinkClick}
              >
                <Gem className="h-5 w-5" />
                <span>Collection 2026</span>
              </Link>
              
              <Link 
                href="/products" 
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                onClick={handleMobileLinkClick}
              >
                <Gem className="h-5 w-5" />
                <span>New Arrivals</span>
              </Link>
              
              <Link 
                href="/products" 
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                onClick={handleMobileLinkClick}
              >
                <Gem className="h-5 w-5" />
                <span>Best Sellers</span>
              </Link>
              
              <Link 
                href="/products" 
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                onClick={handleMobileLinkClick}
              >
                <Gem className="h-5 w-5" />
                <span>Boys</span>
              </Link>

              <Link 
                href="/products" 
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                onClick={handleMobileLinkClick}
              >
                <Gem className="h-5 w-5" />
                <span>Girls</span>
              </Link>

              <Link 
                href="/about" 
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                onClick={handleMobileLinkClick}
              >
                <User className="h-5 w-5" />
                <span>About us</span>
              </Link>
              
              <Link 
                href="/contact" 
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all"
                onClick={handleMobileLinkClick}
              >
                <Phone className="h-5 w-5" />
                <span>Contact us</span>
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
    </header>
  );
}