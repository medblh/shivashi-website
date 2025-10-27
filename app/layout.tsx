// app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TopBanner } from '@/components/TopBanner';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { StripeProvider } from '@/providers/StripeProvider'; // ← AJOUT

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shivashi Kids Wear',
  description: 'Discover our exclusive collections only for kids',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <StripeProvider> {/* ← AJOUT */}
          <AuthProvider>
            <CartProvider>
              <TopBanner />
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </StripeProvider> {/* ← AJOUT */}
      </body>
    </html>
  );
}