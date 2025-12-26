"use client";

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Home, Gem, User, Phone, LogIn, User as UserIcon, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
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
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeSubMenu, setActiveSubMenu] = useState<'boys' | 'girls' | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/';

  // Mesurer la hauteur du header
  useEffect(() => {
    if (headerRef.current && !isHomePage) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [isHomePage]);

  // Gestion du scroll pour toutes les pages
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      
      if (isHomePage) {
        // Pour la homepage: devient gris au scroll > 50px
        setIsScrolled(scrollTop > 50);
      } else {
        // Pour les autres pages: devient sticky au scroll > 100px
        setIsScrolled(scrollTop > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initialiser l'état au montage
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen || activeSubMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, activeSubMenu]);

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
    setActiveSubMenu(null);
  };

  const handleMobileLinkClick = () => {
    closeAllMenus();
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    closeAllMenus();
  };

  const openSubMenu = (type: 'boys' | 'girls') => {
    setActiveSubMenu(type);
  };

  const closeSubMenu = () => {
    setActiveSubMenu(null);
  };

  // Déterminer la classe du header en fonction de la page et du scroll
  const getHeaderClass = () => {
    if (isHomePage) {
      return isScrolled 
        ? 'bg-[rgb(52_58_64_/_95%)] shadow-sm border-b border-gray-700 fixed top-0 left-0 right-0 z-50' 
        : 'bg-transparent fixed top-0 left-0 right-0 z-50';
    } else {
      return isScrolled 
        ? 'bg-[rgb(52_58_64_/_90%)] shadow-lg fixed top-0 left-0 right-0 z-50 animate-in slide-in-down duration-300' 
        : 'relative z-10';
    }
  };

  // Déterminer la classe des boutons
  const getButtonClass = () => {
    return 'text-white hover:bg-white/20';
  };

  // Déterminer la classe du badge du panier
  const getCartBadgeClass = () => {
    return 'bg-green-600 text-white';
  };

  return (
    <>
      {/* Header normal (pas sticky) pour les autres pages */}
      {!isHomePage && !isScrolled && (
        <div ref={headerRef} className="relative z-10">
          <div className={`transition-all duration-300 ${getHeaderClass()}`}>
            <div className="bg-[rgb(52_58_64)]">
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
                      className={`h-9 w-9 ${getButtonClass()}`}
                    >
                      <Search className="h-4 w-4" />
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`z-50 ${getButtonClass()}`}
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
                    <div className="relative">
                      {user ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className={`h-9 w-9 ${getButtonClass()}`}
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
                          className={`h-9 ${getButtonClass()}`}
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
                      className={`relative h-9 w-9 ${getButtonClass()}`} 
                      asChild
                    >
                      <Link href="/cart" onClick={closeAllMenus}>
                        <ShoppingCart className="h-4 w-4" />
                        {cartItemsCount > 0 && (
                          <span className={`absolute -top-1 -right-1 rounded-full w-4 h-4 text-[10px] flex items-center justify-center ${
                            getCartBadgeClass()
                          }`}>
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
                        placeholder="Search..."
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
          </div>
        </div>
      )}

      {/* Header sticky pour les autres pages (apparaît au scroll) */}
      {!isHomePage && isScrolled && (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderClass()}`}>
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
                  className={`h-9 w-9 ${getButtonClass()}`}
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`z-50 ${getButtonClass()}`}
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
                <div className="relative">
                  {user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className={`h-9 w-9 ${getButtonClass()}`}
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
                      className={`h-9 ${getButtonClass()}`}
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
                  className={`relative h-9 w-9 ${getButtonClass()}`} 
                  asChild
                >
                  <Link href="/cart" onClick={closeAllMenus}>
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemsCount > 0 && (
                      <span className={`absolute -top-1 -right-1 rounded-full w-4 h-4 text-[10px] flex items-center justify-center ${
                        getCartBadgeClass()
                      }`}>
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
                    placeholder="Search..."
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

      {/* Header pour la homepage (toujours sticky) */}
      {isHomePage && (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderClass()}`}>
          {/* Ajustement pour la top banner - uniquement sur la homepage */}
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
                    className={`h-9 w-9 ${getButtonClass()}`}
                  >
                    <Search className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`z-50 ${getButtonClass()}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Logo au CENTRE */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <Link href="/" className="flex items-center">
                    {/* Logo pour la homepage avec transition */}
                    <div className={`transition-opacity duration-300 ${
                      isScrolled ? 'opacity-100' : 'opacity-100'
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
                          className={`h-9 w-9 ${getButtonClass()}`}
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
                        className={`h-9 ${getButtonClass()}`}
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
                    className={`relative h-9 w-9 ${getButtonClass()}`} 
                    asChild
                  >
                    <Link href="/cart" onClick={closeAllMenus}>
                      <ShoppingCart className="h-4 w-4" />
                      {cartItemsCount > 0 && (
                        <span className={`absolute -top-1 -right-1 rounded-full w-4 h-4 text-[10px] flex items-center justify-center ${
                          getCartBadgeClass()
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
                      placeholder="Search..."
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
        </div>
      )}

      {/* Menu Mobile et Sous-menus */}
      {(mobileMenuOpen || activeSubMenu) && (
        <>
          {/* Overlay sombre */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeAllMenus}
          />
          
          {/* Conteneur principal pour les menus */}
          <div className="fixed top-0 left-0 h-full flex z-50">
            {/* Menu Principal - toujours visible quand mobileMenuOpen est true */}
            {mobileMenuOpen && (
              <div 
                className={`
                  h-full bg-white shadow-2xl overflow-y-auto
                  transform transition-all duration-300 ease-in-out
                  ${activeSubMenu ? 'translate-x-0 w-64' : 'translate-x-0 w-80'}
                `}
              >
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
                    href="/products?category=new-arrivals" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                    onClick={handleMobileLinkClick}
                  >
                    <Gem className="h-5 w-5" />
                    <span>New Arrivals</span>
                  </Link>
                  
                  <Link 
                    href="/products?sort=best-selling" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100"
                    onClick={handleMobileLinkClick}
                  >
                    <Gem className="h-5 w-5" />
                    <span>Best Sellers</span>
                  </Link>
                  
                  {/* Bouton Boys */}
                  <button 
                    onClick={() => openSubMenu('boys')}
                    className={`flex items-center justify-between text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100 w-full text-left group ${
                      activeSubMenu === 'boys' ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Gem className="h-5 w-5" />
                      <span>Boys</span>
                    </div>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Bouton Girls */}
                  <button 
                    onClick={() => openSubMenu('girls')}
                    className={`flex items-center justify-between text-gray-700 hover:text-green-600 font-medium py-4 px-4 rounded-lg hover:bg-green-50 transition-all border-b border-gray-100 w-full text-left group ${
                      activeSubMenu === 'girls' ? 'bg-pink-50 text-pink-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Gem className="h-5 w-5" />
                      <span>Girls</span>
                    </div>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>

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
            )}

            {/* Sidebar Boys */}
            {activeSubMenu === 'boys' && (
              <div 
                className={`
                  h-full bg-white shadow-2xl overflow-y-auto
                  transform transition-all duration-300 ease-in-out
                  translate-x-0
                  w-80
                  border-l
                `}
              >
                {/* En-tête du menu Boys */}
                <div className="flex items-center p-4 border-b bg-gradient-to-r from-blue-50 to-white">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={closeSubMenu}
                    className="mr-2 hover:bg-blue-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="text-lg font-semibold text-gray-900">Boys Collection</div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={closeAllMenus}
                    className="ml-auto"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Boys */}
                <nav className="flex flex-col p-4 space-y-1">
                  <h3 className="font-semibold text-gray-800 mb-3 px-4">Categories</h3>
                  
                  <Link 
                    href="/products?category=boys&subcategory=tshirts-tops" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium py-4 px-4 rounded-lg hover:bg-blue-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <span className="text-blue-600 text-sm font-bold">T</span>
                    </div>
                    <div className="flex-1">
                      <span>T-Shirts & Tops</span>
                      <p className="text-xs text-gray-500 mt-1">Casual & formal tops for boys</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=boys&subcategory=bottoms" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium py-4 px-4 rounded-lg hover:bg-blue-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <span className="text-green-600 text-sm font-bold">B</span>
                    </div>
                    <div className="flex-1">
                      <span>Shorts</span>
                      <p className="text-xs text-gray-500 mt-1">Pants, shorts & jeans</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=boys&subcategory=jackets" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium py-4 px-4 rounded-lg hover:bg-blue-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <span className="text-purple-600 text-sm font-bold">J</span>
                    </div>
                    <div className="flex-1">
                      <span>Hoodies</span>
                      <p className="text-xs text-gray-500 mt-1">Hoodies, jackets & coats</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=boys&subcategory=sets" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium py-4 px-4 rounded-lg hover:bg-blue-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <span className="text-yellow-600 text-sm font-bold">S</span>
                    </div>
                    <div className="flex-1">
                      <span>Sweatshirts</span>
                      <p className="text-xs text-gray-500 mt-1">Complete matching sets</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=boys&subcategory=accessories" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium py-4 px-4 rounded-lg hover:bg-blue-50 transition-all group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <span className="text-red-600 text-sm font-bold">A</span>
                    </div>
                    <div className="flex-1">
                      <span>Pants</span>
                      <p className="text-xs text-gray-500 mt-1">Hats, socks & more</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </Link>

                  {/* View All Boys */}
                  <div className="mt-6 pt-4 border-t">
                    <Link 
                      href="/products?category=boys"
                      className="block text-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      onClick={handleMobileLinkClick}
                    >
                      View All Boys Collection
                    </Link>
                  </div>
                </nav>
              </div>
            )}

            {/* Sidebar Girls */}
            {activeSubMenu === 'girls' && (
              <div 
                className={`
                  h-full bg-white shadow-2xl overflow-y-auto
                  transform transition-all duration-300 ease-in-out
                  translate-x-0
                  w-80
                  border-l
                `}
              >
                {/* En-tête du menu Girls */}
                <div className="flex items-center p-4 border-b bg-gradient-to-r from-pink-50 to-white">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={closeSubMenu}
                    className="mr-2 hover:bg-pink-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="text-lg font-semibold text-gray-900">Girls Collection</div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={closeAllMenus}
                    className="ml-auto"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Girls */}
                <nav className="flex flex-col p-4 space-y-1">
                  <h3 className="font-semibold text-gray-800 mb-3 px-4">Categories</h3>
                  
                  <Link 
                    href="/products?category=girls&subcategory=dresses" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 font-medium py-4 px-4 rounded-lg hover:bg-pink-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                      <span className="text-pink-600 text-sm font-bold">D</span>
                    </div>
                    <div className="flex-1">
                      <span>Tshirts & Tops</span>
                      <p className="text-xs text-gray-500 mt-1">Party & casual dresses</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=girls&subcategory=tshirts-tops" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 font-medium py-4 px-4 rounded-lg hover:bg-pink-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <span className="text-purple-600 text-sm font-bold">T</span>
                    </div>
                    <div className="flex-1">
                      <span>Shorts & Bikeshorts</span>
                      <p className="text-xs text-gray-500 mt-1">Colorful tops for girls</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=girls&subcategory=bottoms" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 font-medium py-4 px-4 rounded-lg hover:bg-pink-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <span className="text-blue-600 text-sm font-bold">B</span>
                    </div>
                    <div className="flex-1">
                      <span>Hoodies</span>
                      <p className="text-xs text-gray-500 mt-1">Leggings, skirts & shorts</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=girls&subcategory=sets" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 font-medium py-4 px-4 rounded-lg hover:bg-pink-50 transition-all border-b border-gray-100 group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <span className="text-yellow-600 text-sm font-bold">S</span>
                    </div>
                    <div className="flex-1">
                      <span>Sweatshirts</span>
                      <p className="text-xs text-gray-500 mt-1">Coordinated sets</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
                  </Link>
                  
                  <Link 
                    href="/products?category=girls&subcategory=accessories" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 font-medium py-4 px-4 rounded-lg hover:bg-pink-50 transition-all group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <span className="text-green-600 text-sm font-bold">A</span>
                    </div>
                    <div className="flex-1">
                      <span>Pants</span>
                      <p className="text-xs text-gray-500 mt-1">Hair accessories & more</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
                  </Link>

                  <Link 
                    href="/products?category=girls&subcategory=accessories" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 font-medium py-4 px-4 rounded-lg hover:bg-pink-50 transition-all group"
                    onClick={handleMobileLinkClick}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <span className="text-green-600 text-sm font-bold">A</span>
                    </div>
                    <div className="flex-1">
                      <span>Leggings</span>
                      <p className="text-xs text-gray-500 mt-1">Hair accessories & more</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
                  </Link>

                  {/* View All Girls */}
                  <div className="mt-6 pt-4 border-t">
                    <Link 
                      href="/products?category=girls"
                      className="block text-center bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                      onClick={handleMobileLinkClick}
                    >
                      View All Girls Collection
                    </Link>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}