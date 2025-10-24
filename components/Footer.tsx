import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            {/* Logo dans le footer */}
            <div className="mb-4">
              <Image
                src="/images/SHIVASHI LOGO.png" // ← MÊME CHEMIN
                alt="Shivashi Logo"
                width={100}  // ← Taille réduite pour le footer
                height={35}
                className="filter brightness-0 invert" // ← Rend le logo blanc
              />
            </div>
            <p className="text-gray-400 max-w-md">
              Depuis notre création, nous nous engageons à offrir des produits 
              d'exception qui allient tradition et innovation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li><Link href="/products" className="hover:text-white">Collections</Link></li>
              <li><Link href="/about" className="hover:text-white">À Propos</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contact@shivashi.com</li>
              <li>+33 1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Shivashi. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}