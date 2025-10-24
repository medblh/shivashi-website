"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pour l'instant, juste un alert
    alert('Message envoyé! (Fonctionnalité à implémenter)');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contactez-Nous</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Envoyez un Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nom Complet
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Votre message..."
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full">
                Envoyer le Message
              </Button>
            </form>
          </div>

          {/* Informations de contact */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Nos Coordonnées</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Adresse</h3>
                <p className="text-gray-600">
                  123 Avenue du Luxe<br />
                  75008 Paris, France
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Téléphone</h3>
                <p className="text-gray-600">+33 1 23 45 67 89</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">contact@shivashi.com</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Horaires</h3>
                <p className="text-gray-600">
                  Lundi - Vendredi: 9h - 18h<br />
                  Samedi: 10h - 17h<br />
                  Dimanche: Fermé
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}