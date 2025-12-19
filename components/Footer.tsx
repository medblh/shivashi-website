import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-white" style={{ background: "rgb(52 58 64 / 95%)" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">JOIN SHIVASHI Kids</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              By entering your email, you agree to our Terms of Service and Privacy Policy.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
              />
              <button
                type="submit"
                className="bg-white text-black font-semibold px-6 py-3 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                SIGN UP
              </button>
            </form>
          </div>

          {/* ABOUT US Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">ABOUT US</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/our-story" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/our-impact" className="hover:text-white transition-colors">
                  Our Impact
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-white transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">HELP</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/find-a-store" className="hover:text-white transition-colors">
                  Find a Store
                </Link>
              </li>
              <li>
                <Link href="/shipping-delivery" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods and Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          {/* Payment Methods */}
          <div className="mb-4 md:mb-0">
            <h5 className="text-gray-300 mb-2">We accept</h5>
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-gray-300">4 Pay</span>
              <span className="text-xl font-bold text-gray-300">VISA</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © 2025 SHIVASHI Kids. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}