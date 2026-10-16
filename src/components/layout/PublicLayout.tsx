import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { Menu, X, MapPin, Phone, Mail, Facebook, Youtube, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';
import { school } from '../../data';
import { Portal, useScrollLock } from '../fx';
import { InteractiveHoverButton, MagneticNavLink, ShimmerButton } from '../magic';
import { usePointerFx } from '../magic/usePointerFx';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/academics', label: 'Academics' },
  { path: '/admissions', label: 'Admissions' },
  { path: '/campus-life', label: 'Campus Life' },
  { path: '/news', label: 'News' },
  { path: '/contact', label: 'Contact' },
];

/**
 * PortalChip: the gateway to the Parent Portal or the School Admin.
 *
 * These two were previously small grey text links, which made the two halves of
 * the product almost impossible to find. They are now solid colour chips with an
 * icon, a label and an arrow, and they tilt and catch the light like every other
 * interactive surface on the site.
 *
 * The fills are the deep forms of the brand colours. White text on a bright
 * fill would only reach about 2.8:1; on these it is above 5:1.
 */
function PortalChip({
  to,
  label,
  shortLabel,
  icon: Icon,
  tone,
}: {
  to: string;
  label: string;
  shortLabel: string;
  icon: typeof GraduationCap;
  tone: 'purple' | 'orange';
}) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const { ref, active, style } = usePointerFx({ maxTilt: 10 });

  const fill =
    tone === 'purple'
      ? 'bg-purple hover:shadow-[0_10px_30px_-8px_rgba(124,58,237,0.85)]'
      : 'bg-gold-deep hover:shadow-[0_10px_30px_-8px_rgba(194,65,12,0.85)]';

  const spot =
    tone === 'purple'
      ? 'var(--spot-purple)'
      : 'var(--spot-orange)';

  return (
    <div className="tilt-stage inline-block">
      <motion.div ref={ref} style={active ? style : undefined} className="tilt-plane inline-block">
        <Link
          to={to}
          style={{ ['--spot' as string]: spot }}
          className={`group relative inline-flex items-center gap-2 overflow-hidden px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white transition-shadow duration-300 ${fill}`}
        >
          <Icon size={13} className="relative z-10 shrink-0" aria-hidden="true" />
          <span className="relative z-10 hidden sm:inline">{label}</span>
          <span className="relative z-10 sm:hidden">{shortLabel}</span>
          <ArrowRight
            size={12}
            className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
          {allowed ? (
            <span
              aria-hidden="true"
              className="spotlight-layer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-plus-lighter"
            />
          ) : null}
        </Link>
      </motion.div>
    </div>
  );
}

/**
 * ContactBar: the thin strip above the navigation.
 *
 * It carries the school's telephone and email on the left and the two portal
 * gateways on the right, over a near-black ground so it frames the header
 * instead of competing with it. A soft orange gradient runs along its lower
 * edge, which is what stops a black strip reading as a dead band.
 */
function ContactBar() {
  return (
    <div className="relative bg-ink text-xs text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_140%_at_15%_0%,rgba(249,115,22,0.22),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2 py-2.5 sm:flex-row">
          {/* Contact details */}
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
            <a
              href={`tel:${school.phone.replace(/\s/g, '')}`}
              className="group inline-flex items-center gap-2 px-2 py-1 transition-colors hover:text-gold"
            >
              <Phone size={13} className="shrink-0 text-gold" aria-hidden="true" />
              <span className="font-medium tracking-wide">{school.phone}</span>
            </a>
            <span aria-hidden="true" className="hidden h-3.5 w-px bg-white/25 sm:block" />
            <a
              href={`mailto:${school.email}`}
              className="group inline-flex items-center gap-2 px-2 py-1 transition-colors hover:text-gold"
            >
              <Mail size={13} className="shrink-0 text-gold" aria-hidden="true" />
              <span className="tracking-wide">{school.email}</span>
            </a>
          </div>

          {/* Portal gateways */}
          <div className="flex items-center gap-2">
            <PortalChip
              to="/parent"
              label="Parent Portal"
              shortLabel="Parents"
              icon={GraduationCap}
              tone="purple"
            />
            <PortalChip
              to="/admin"
              label="School Admin"
              shortLabel="Admin"
              icon={ShieldCheck}
              tone="orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredDrawer, setHoveredDrawer] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navigate = useNavigate();

  // Freeze the page behind the open drawer.
  useScrollLock(isOpen);

  // The bar compresses once the page has moved, which is what makes it read as
  // reacting to the reader rather than sitting there.
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const barHeight = useTransform(scrollY, [0, 120], [80, 64]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // Close on route change, and drop any hovered row with it.
  useEffect(() => {
    setIsOpen(false);
    setHoveredDrawer(null);
  }, [location.pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-[100]">
      <nav
        data-lenis-prevent
        className={`relative bg-paper border-b transition-colors ${
          isHome ? 'border-transparent' : 'border-rule'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{ height: barHeight }}
            className="flex items-center justify-between"
          >
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

            {/* Desktop nav. Each link chases the pointer and slides its label on
                hover, with a gold marker tracking the current page. */}
            <div
              className="hidden items-center gap-1 lg:flex"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {NAV_LINKS.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <MagneticNavLink
                    key={link.path}
                    to={link.path}
                    active={isActive}
                    lit={hoveredNav ? hoveredNav === link.path : isActive}
                    onEnter={() => setHoveredNav(link.path)}
                  >
                    {link.label}
                  </MagneticNavLink>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <InteractiveHoverButton
                  tone="gold"
                  size="sm"
                  onClick={() => navigate('/admissions')}
                >
                  Apply Now
                </InteractiveHoverButton>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="lg:hidden p-2.5 -mr-2 text-ink"
              >
                <Menu size={26} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reading progress, riding the bottom edge of the bar. */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gold"
        />
      </nav>

      {/* The drawer is rendered through a portal into <body>.
          A `backdrop-filter` on the nav above makes it the containing block for
          fixed descendants, which previously clipped this overlay to the nav's
          80px height and dropped it behind the page. The portal escapes that
          containing block entirely. */}
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[400] bg-ink/70 lg:hidden"
                aria-hidden="true"
              />

              <motion.aside
                key="drawer"
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                data-lenis-prevent
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-y-0 left-0 z-[410] w-[86%] max-w-sm bg-paper lg:hidden overflow-y-auto overscroll-contain flex flex-col"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
              >
                <div className="flex items-center justify-between h-20 px-5 shrink-0">
                  <span className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-ink flex items-center justify-center">
                      <span className="font-display text-paper font-bold text-sm">MG</span>
                    </span>
                    <span className="text-ink">
                      <span className="block font-display font-semibold text-sm leading-tight">
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
                    className="p-3 -mr-2 text-ink"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex-1 px-5 py-4" onMouseLeave={() => setHoveredDrawer(null)}>
                  {/* Each row slides in behind the one above it, and the gold rule
                      under the label grows from the left on hover or press. */}
                  {NAV_LINKS.map((link, i) => {
                    const active = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -22 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.06 + i * 0.045,
                          duration: 0.42,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          onMouseEnter={() => setHoveredDrawer(link.path)}
                          onFocus={() => setHoveredDrawer(link.path)}
                          className="group relative flex min-h-[56px] items-center justify-between px-3 font-display text-lg"
                        >
                          {/* The same gliding highlight as the desktop menu, on
                              its own layout id so the two never share one. */}
                          {(hoveredDrawer ? hoveredDrawer === link.path : active) ? (
                            <motion.span
                              layoutId="drawer-highlight"
                              aria-hidden="true"
                              className="absolute inset-0 bg-ink"
                              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
                            />
                          ) : null}
                          <span
                            className={`relative z-10 transition-transform duration-300 group-hover:translate-x-1 ${
                              (hoveredDrawer ? hoveredDrawer === link.path : active)
                                ? 'text-paper'
                                : 'text-ink'
                            }`}
                          >
                            {link.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`relative z-10 h-1.5 w-1.5 transition-all duration-300 ${
                              active
                                ? 'scale-100 bg-gold'
                                : 'scale-0 bg-gold group-hover:scale-100'
                            }`}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="px-5 pb-8 pt-2 shrink-0">
                  <div className="[&>div]:block [&_button]:w-full">
                    <ShimmerButton onClick={() => { setIsOpen(false); navigate('/admissions'); }}>
                      Apply Now
                    </ShimmerButton>
                  </div>

                  <div className="mt-8">
                    <Link
                      to="/parent"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center min-h-[48px] text-sm text-ink-mute"
                    >
                      Parent Portal
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center min-h-[48px] text-sm text-ink-mute"
                    >
                      School Admin
                    </Link>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-paper">
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
                <span className="block text-[0.625rem] tracking-[0.18em] uppercase text-gold-deep">
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
                'Pre-School (KG 1 to KG 2)',
                'Primary (P1 to P6)',
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
