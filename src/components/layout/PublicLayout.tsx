import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react';
import { school } from '../../data';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/academics', label: 'Academics' },
  { path: '/admissions', label: 'Admissions' },
  { path: '/campus-life', label: 'Campus Life' },
  { path: '/news', label: 'News' },
  { path: '/contact', label: 'Contact' },
];

/** Dark utility bar: contact details and portal shortcuts. */
function ContactBar() {
  return (
    <div className="bg-ink text-paper/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-2.5">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${school.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Phone size={12} aria-hidden="true" />
              <span>{school.phone}</span>
            </a>
            <span className="hidden sm:inline text-paper/25">|</span>
            <a
              href={`mailto:${school.email}`}
              className="inline-flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Mail size={12} aria-hidden="true" />
              <span>{school.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/parent" className="hover:text-gold transition-colors">
              Parent Portal
            </Link>
            <span className="text-paper/25">|</span>
            <Link to="/admin" className="hover:text-gold transition-colors">
              School Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-[100]">
      <nav
        data-lenis-prevent
        className={`bg-paper/95 backdrop-blur-md border-b transition-colors ${
          isHome ? 'border-transparent' : 'border-rule'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Crest */}
            <Link to="/" className="flex items-center gap-3 group">
              <span className="w-11 h-11 bg-ink flex items-center justify-center group-hover:bg-gold-deep transition-colors">
                <span className="font-display text-paper font-bold text-sm tracking-wide">MG</span>
              </span>
              <span className="text-ink">
                <span className="block font-display font-semibold text-base leading-tight">
                  Maple Grove
                </span>
                <span className="block text-[0.625rem] tracking-[0.2em] uppercase text-gold-deep">
                  International School
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map(link => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={`line-draw text-sm transition-colors ${
                      active
                        ? 'text-gold-deep font-medium active'
                        : 'text-ink-mute hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admissions"
                className="hidden sm:inline-flex items-center px-6 py-3 bg-gold text-ink text-xs font-semibold tracking-[0.14em] uppercase hover:bg-gold-deep hover:text-paper transition-colors"
              >
                Apply Now
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                className="lg:hidden p-2 text-ink"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-ink/50 z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.28 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-paper lg:hidden overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-ink flex items-center justify-center">
                        <span className="font-display text-paper font-bold text-sm">MG</span>
                      </span>
                      <span className="text-ink">
                        <span className="block font-display font-semibold text-sm">
                          Maple Grove
                        </span>
                        <span className="block text-[0.625rem] tracking-[0.18em] uppercase text-gold-deep">
                          International School
                        </span>
                      </span>
                    </span>
                    <button
                      onClick={() => setIsOpen(false)}
                      aria-label="Close menu"
                      className="p-2 text-ink"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <nav className="divide-y divide-rule border-y border-rule">
                    {NAV_LINKS.map(link => {
                      const active = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center min-h-[52px] px-1 text-sm transition-colors ${
                            active ? 'text-gold-deep font-medium' : 'text-ink-mute'
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>

                  <Link
                    to="/admissions"
                    onClick={() => setIsOpen(false)}
                    className="mt-6 flex items-center justify-center min-h-[52px] bg-gold text-ink text-xs font-semibold tracking-[0.14em] uppercase"
                  >
                    Apply Now
                  </Link>

                  <div className="mt-8 pt-6 border-t border-rule space-y-1">
                    <Link
                      to="/parent"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center min-h-[44px] text-xs text-ink-mute"
                    >
                      Parent Portal
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center min-h-[44px] text-xs text-ink-mute"
                    >
                      School Admin
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-paper/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Crest + motto */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 bg-gold flex items-center justify-center">
                <span className="font-display text-ink font-bold">MG</span>
              </span>
              <span>
                <span className="block font-display text-paper">Maple Grove</span>
                <span className="block text-[0.625rem] tracking-[0.18em] uppercase text-gold">
                  International School
                </span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {school.motto}. Quality education from Early Years through JHS, blending the
              Ghanaian curriculum with Cambridge enrichment.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="w-9 h-9 border border-paper/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Facebook size={15} />
              </span>
              <span className="w-9 h-9 border border-paper/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Youtube size={15} />
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-paper text-xs tracking-[0.2em] uppercase mb-6 font-body font-medium">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Academics', to: '/academics' },
                { label: 'Admissions', to: '/admissions' },
                { label: 'Campus Life', to: '/campus-life' },
                { label: 'News', to: '/news' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="text-paper text-xs tracking-[0.2em] uppercase mb-6 font-body font-medium">
              Programmes
            </h4>
            <ul className="space-y-3">
              {[
                'Pre-School (KG 1 – KG 2)',
                'Primary (P1 – P6)',
                'Junior High School',
                'Cambridge Enrichment',
              ].map(item => (
                <li key={item}>
                  <Link to="/academics" className="text-sm hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-paper text-xs tracking-[0.2em] uppercase mb-6 font-body font-medium">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-sm">{school.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-sm">
                  <a
                    href={`tel:${school.phone.replace(/\s/g, '')}`}
                    className="hover:text-gold transition-colors"
                  >
                    {school.phone}
                  </a>
                  <br />
                  <a
                    href={`tel:${school.phoneAlt.replace(/\s/g, '')}`}
                    className="hover:text-gold transition-colors"
                  >
                    {school.phoneAlt}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${school.email}`}
                  className="text-sm hover:text-gold transition-colors"
                >
                  {school.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-paper/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; 2026 {school.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/parent" className="text-xs hover:text-gold transition-colors">
              Parent Portal
            </Link>
            <Link to="/admin" className="text-xs hover:text-gold transition-colors">
              School Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Shared shell for the public marketing site: contact bar, sticky navigation,
 * footer and the portal call-out. Every public route renders inside this.
 */
export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ContactBar />
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
