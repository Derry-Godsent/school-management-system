import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Phone, Mail } from 'lucide-react';
import { school } from '../../data';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/academics', label: 'Academics' },
  { path: '/admissions', label: 'Admissions' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/news', label: 'News' },
  { path: '/contact', label: 'Contact' },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const showSolid = !isHome || scrolled;

  return (
    <nav
      data-lenis-prevent
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        showSolid ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#E85D04] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">MG</span>
            </div>
            <div className={`hidden sm:block ${showSolid ? 'text-gray-900' : 'text-white'}`}>
              <div className="font-semibold text-sm leading-tight">Maple Grove</div>
              <div className={`text-xs ${showSolid ? 'opacity-50' : 'opacity-70'}`}>
                International School
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={location.pathname === link.path ? 'page' : undefined}
                className={`text-sm font-medium transition-all hover:text-[#E85D04] line-draw ${
                  location.pathname === link.path
                    ? 'text-[#E85D04] active'
                    : showSolid
                      ? 'text-gray-700'
                      : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/admissions"
              className="hidden sm:inline-flex items-center px-6 py-2.5 bg-[#E85D04] text-white text-sm font-medium rounded-full hover:bg-[#DC4A03] transition-colors glow-orange"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className={`lg:hidden p-2 rounded-lg ${showSolid ? 'text-gray-900' : 'text-white'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 lg:hidden overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E85D04] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MG</span>
                  </div>
                  <div className="text-gray-900">
                    <div className="font-semibold text-sm">Maple Grove</div>
                    <div className="text-xs text-gray-500">International School</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                      location.pathname === link.path
                        ? 'bg-[#E85D04]/10 text-[#E85D04]'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  to="/admissions"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 bg-[#E85D04] text-white text-sm font-medium rounded-xl text-center min-h-[44px] flex items-center justify-center"
                >
                  Apply Now
                </Link>
                <div className="mt-4 space-y-1">
                  <Link
                    to="/parent"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Parent Portal
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] flex items-center"
                  >
                    School Admin
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#E85D04] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">MG</span>
              </div>
              <div>
                <div className="font-semibold text-white">Maple Grove</div>
                <div className="text-xs text-gray-400">International School</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {school.motto}. Providing quality education from Early Years through JHS with a
              blended Ghanaian and Cambridge curriculum.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['About', 'Academics', 'Admissions', 'Gallery', 'News'].map(item => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-[#E85D04] transition-colors line-draw"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6 uppercase tracking-widest">
              Programmes
            </h4>
            <ul className="space-y-3">
              {[
                'Early Years (KG 1 - KG 2)',
                'Primary (P1 - P6)',
                'Junior High School',
                'Cambridge Enrichment Stream',
              ].map(item => (
                <li key={item}>
                  <Link
                    to="/academics"
                    className="text-sm text-gray-400 hover:text-[#E85D04] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6 uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#E85D04] mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">{school.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#E85D04] shrink-0" />
                <a
                  href={`tel:${school.phone.replace(/\s/g, '')}`}
                  className="text-sm text-gray-400 hover:text-[#E85D04] transition-colors"
                >
                  {school.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#E85D04] shrink-0" />
                <a
                  href={`mailto:${school.email}`}
                  className="text-sm text-gray-400 hover:text-[#E85D04] transition-colors"
                >
                  {school.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 {school.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/parent"
              className="text-xs text-gray-500 hover:text-[#E85D04] transition-colors"
            >
              Parent Portal
            </Link>
            <Link
              to="/admin"
              className="text-xs text-gray-500 hover:text-[#E85D04] transition-colors"
            >
              School Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in-up">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl p-4 border border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#E85D04] uppercase tracking-wide mb-1">
              Explore the Ecosystem
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This website is connected to a parent portal and school management platform. See the
              full experience.
            </p>
            <div className="flex gap-2 mt-3">
              <Link
                to="/parent"
                className="px-3 py-1.5 bg-[#E85D04] text-white text-xs font-medium rounded-lg hover:bg-[#DC4A03] transition-colors"
              >
                Parent Portal
              </Link>
              <Link
                to="/admin"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                School Admin
              </Link>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared shell for the public marketing site: fixed navigation, footer and
 * the portal call-out. Every public route renders inside this.
 */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>{children}</main>
      <Footer />
      <DemoBanner />
    </div>
  );
}
