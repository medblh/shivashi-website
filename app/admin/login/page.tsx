"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const success = await login(formData.email, formData.password);
    
    if (success) {
      // Rediriger vers le dashboard admin
      router.push('/admin/dashboard');
    } else {
      setError('Identifiants administrateur incorrects');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Accès Administrateur</h1>
            <p className="text-gray-300">Panel d'administration Shivashi</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Administrateur
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@shivashi.com"
                className="w-full bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Votre mot de passe administrateur"
                  className="w-full bg-white/5 border-white/20 text-white placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 border-0"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Accéder au Dashboard</span>
                </div>
              )}
            </Button>
          </form>

          {/* Informations de connexion */}
          <div className="mt-8 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <h3 className="font-semibold text-amber-400 mb-2 text-sm">Identifiants de test :</h3>
            <div className="text-amber-300 text-sm space-y-1">
              <p><strong>Email:</strong> admin@shivashi.com</p>
              <p><strong>Mot de passe:</strong> admin123</p>
            </div>
          </div>

          {/* Lien vers le site public */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <Link 
              href="/" 
              className="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              ← Retour au site public
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}