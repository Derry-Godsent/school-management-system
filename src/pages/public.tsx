import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { school, news, events, galleryAlbums, departments, admissionApplications } from '../data';
import { Menu, X, MapPin, Phone, Mail, Clock, ChevronRight, ArrowRight, Calendar, Award, BookOpen, Users, GraduationCap, Sparkles, Star } from 'lucide-react';
import { TextReveal } from '../components/motion/TextReveal';
import { ParallaxImage } from '../components/motion/ParallaxImage';
import { CountUp } from '../components/motion/CountUp';
import { MagneticButton } from '../components/motion/MagneticButton';
import { ScrollReveal, ScrollRevealChild } from '../components/motion/ScrollReveal';
import { TiltCard } from '../components/motion/TiltCard';
import { HorizontalScroll } from '../components/motion/HorizontalScroll';
import { CharReveal, TextScramble } from '../components/motion/TextScramble';
import { Hero3DScene } from '../components/three/HeroScene';
import { useReducedMotion } from '../lib/motion';

// ============================================================================
// NAVIGATION
// ============================================================================
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/academics', label: 'Academics' },
    { path: '/admissions', label: 'Admissions' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav data-lenis-prevent className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHome ? 'bg-transparent' : 'glass-dark'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#E85D04] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">MG</span>
            </div>
            <div className="hidden sm:block text-white">
              <div className="font-semibold text-sm leading-tight">Maple Grove</div>
              <div className="text-xs opacity-50">International School</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all hover:text-[#E85D04] line-draw ${
                  location.pathname === link.path
                    ? 'text-[#E85D04] active'
                    : 'text-white/70 hover:text-white'
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
              className="lg:hidden p-2 rounded-lg text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
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
            className="fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E85D04] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MG</span>
                  </div>
                  <div className="text-white">
                    <div className="font-semibold text-sm">Maple Grove</div>
                    <div className="text-xs opacity-50">International School</div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-white">
                  <X size={20} />
                </button>
              </div>
              
              <nav className="space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                      location.pathname === link.path
                        ? 'bg-[#E85D04]/10 text-[#E85D04]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white active:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  to="/admissions"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 bg-[#E85D04] text-white text-sm font-medium rounded-xl text-center min-h-[44px] flex items-center justify-center"
                >
                  Apply Now
                </Link>
                <div className="mt-4 space-y-1">
                  <Link to="/parent" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-xs text-white/40 hover:text-white/60 transition-colors min-h-[44px] flex items-center">
                    Parent Portal
                  </Link>
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-xs text-white/40 hover:text-white/60 transition-colors min-h-[44px] flex items-center">
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

// ============================================================================
// FOOTER
// ============================================================================
function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
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
                <div className="text-xs text-white/40">International School</div>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              {school.motto}. Providing quality education from Early Years through JHS with a blended Ghanaian and Cambridge curriculum.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {['About', 'Academics', 'Admissions', 'Gallery', 'News'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-white/40 hover:text-[#E85D04] transition-colors line-draw">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6 uppercase tracking-widest">Programmes</h4>
            <ul className="space-y-3">
              {['Early Years (KG 1 - KG 2)', 'Primary (P1 - P6)', 'Junior High School', 'Cambridge Enrichment Stream'].map(item => (
                <li key={item}>
                  <span className="text-sm text-white/40">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-6 uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#E85D04] mt-0.5 shrink-0" />
                <span className="text-sm text-white/40">{school.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#E85D04] shrink-0" />
                <span className="text-sm text-white/40">{school.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#E85D04] shrink-0" />
                <span className="text-sm text-white/40">{school.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">&copy; 2026 {school.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/parent" className="text-xs text-white/30 hover:text-[#E85D04] transition-colors">Parent Portal</Link>
            <Link to="/admin" className="text-xs text-white/30 hover:text-[#E85D04] transition-colors">School Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// HERO SECTION - IMMERSIVE 3D
// ============================================================================
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* 3D Background Scene - disabled on mobile for performance */}
      {!prefersReducedMotion && !isMobile && (
        <div className="absolute inset-0 z-0">
          <Hero3DScene />
        </div>
      )}
      
      {/* Mobile fallback background */}
      {isMobile && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-500/20 via-black to-orange-900/20" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 glass rounded-full mb-6 sm:mb-8">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#E85D04] rounded-full animate-pulse" />
            <span className="text-[10px] sm:text-xs font-medium text-white/80 tracking-widest uppercase">Now Enrolling 2026/2027</span>
          </div>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl lg:text-9xl font-bold text-white leading-[0.9] mb-6 sm:mb-8 tracking-tight">
          <CharReveal text="WHERE" className="block" delay={200} />
          <CharReveal text="EVERY" className="block" delay={400} />
          <span className="block gradient-text">
            <CharReveal text="CHILD" className="block" delay={600} />
          </span>
          <CharReveal text="DISCOVERS" className="block text-stroke" delay={800} />
          <CharReveal text="THEIR BEST" className="block" delay={1000} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
        >
          A premium private school in Kumasi offering a blended Ghanaian and Cambridge curriculum from Early Years through Junior High School.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4"
        >
          <MagneticButton>
            <Link
              to="/admissions"
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#E85D04] text-white text-sm sm:text-base font-medium rounded-full overflow-hidden glow-orange w-full sm:w-auto"
            >
              <span className="relative z-10">Apply for Admission</span>
              <ArrowRight size={16} className="sm:hidden relative z-10" />
              <ArrowRight size={18} className="hidden sm:block relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 glass text-white text-sm sm:text-base font-medium rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto"
            >
              Explore Our School
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/40 tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// CTA SECTION - DRAMATIC FINALE
// ============================================================================
function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="relative py-24 sm:py-40 overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')] bg-cover bg-center"
        style={{
          scale: prefersReducedMotion ? 1 : scale,
          opacity: prefersReducedMotion ? 0.3 : opacity,
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#E85D04] rounded-full blur-[100px] sm:blur-[150px] opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#FF8C42] rounded-full blur-[100px] sm:blur-[150px] opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-5xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Ready to Give<br />
            <span className="gradient-text">Your Child</span><br />
            <span className="text-stroke">The Best Start?</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-base sm:text-xl text-white/60 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Join the Maple Grove family. Applications are now open for the 2026/2027 academic year.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 px-4">
            <MagneticButton>
              <Link
                to="/admissions"
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#E85D04] text-white text-base sm:text-lg font-medium rounded-full overflow-hidden glow-orange w-full sm:w-auto"
              >
                <span className="relative z-10">Start Application</span>
                <ArrowRight size={18} className="sm:hidden relative z-10" />
                <ArrowRight size={20} className="hidden sm:block relative z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 glass text-white text-base sm:text-lg font-medium rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                Book a School Visit
              </Link>
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
// ============================================================================
// HOME PAGE - IMMERSIVE EXPERIENCE
// ============================================================================
function HomePage() {
  return (
    <div className="bg-black noise">
      {/* Hero */}
      <HeroSection />

      {/* Marquee Stats */}
      <section className="py-8 sm:py-12 border-y border-white/10 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 sm:gap-16 px-4 sm:px-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-6xl font-bold gradient-text">320+</span>
                <span className="text-white/40 text-xs sm:text-sm uppercase tracking-widest">Students</span>
              </div>
              <div className="w-px h-8 sm:h-12 bg-white/10" />
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-6xl font-bold gradient-text">18</span>
                <span className="text-white/40 text-xs sm:text-sm uppercase tracking-widest">Years</span>
              </div>
              <div className="w-px h-8 sm:h-12 bg-white/10" />
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-6xl font-bold gradient-text">95%</span>
                <span className="text-white/40 text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap">BECE Pass Rate</span>
              </div>
              <div className="w-px h-8 sm:h-12 bg-white/10" />
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-6xl font-bold gradient-text">25:1</span>
                <span className="text-white/40 text-xs sm:text-sm uppercase tracking-widest">Class Size</span>
              </div>
              <div className="w-px h-8 sm:h-12 bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      {/* Why Maple Grove - 3D Tilt Cards */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E85D04] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF8C42] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12 sm:mb-20">
            <span className="text-[#E85D04] font-medium text-xs sm:text-sm uppercase tracking-widest">Why Parents Choose Us</span>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mt-4 leading-tight">
              Education That<br />
              <span className="gradient-text">Prepares For Life</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 perspective-1000">            {[
              {
                icon: <BookOpen size={32} />,
                title: 'Blended Curriculum',
                description: 'We combine the rigour of the Ghanaian national curriculum with Cambridge international standards, giving students the best of both worlds.',
              },
              {
                icon: <Users size={32} />,
                title: 'Small Class Sizes',
                description: 'With a maximum of 25 students per class, every child receives personal attention and support from dedicated teachers.',
              },
              {
                icon: <Award size={32} />,
                title: 'Proven Results',
                description: 'Our students consistently achieve outstanding BECE results, with 95% obtaining Grade 1-3 in core subjects over the past three years.',
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.2}>
                <TiltCard intensity={10}>
                  <div className="group relative p-10 glass rounded-3xl h-full preserve-3d hover:border-[#E85D04]/30 transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E85D04]/0 to-[#E85D04]/0 group-hover:from-[#E85D04]/5 group-hover:to-transparent transition-all duration-500 rounded-3xl" />
                    <div className="relative preserve-3d">
                      <div className="w-16 h-16 bg-[#E85D04]/10 rounded-2xl flex items-center justify-center text-[#E85D04] mb-6 group-hover:bg-[#E85D04]/20 transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                      <p className="text-white/60 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes - Horizontal Scroll (Desktop) / Vertical Cards (Mobile) */}
      <section className="py-20 sm:py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <ScrollReveal className="text-center">
            <span className="text-[#E85D04] font-medium text-xs sm:text-sm uppercase tracking-widest">Our Programmes</span>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mt-4">
              From First Steps<br />
              <span className="text-stroke-orange">To BECE Success</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Desktop: Horizontal Scroll */}
        <div className="hidden md:block">
          <HorizontalScroll>
            {departments.map((dept, i) => (
              <div key={dept.id} className="flex-shrink-0 w-[60vw] lg:w-[40vw]">
                <TiltCard intensity={5}>
                  <div className="group relative h-[70vh] glass rounded-3xl overflow-hidden preserve-3d">
                    <div className={`absolute top-0 left-0 right-0 h-1 ${i === 0 ? 'bg-[#E85D04]' : i === 1 ? 'bg-[#FF8C42]' : 'bg-[#FFB366]'}`} />
                    <div className="p-8 lg:p-12 h-full flex flex-col justify-between preserve-3d">
                      <div>
                        <div className="flex items-center gap-4 mb-8">
                          {i === 0 ? <Star size={40} className="text-[#E85D04]" /> : i === 1 ? <BookOpen size={40} className="text-[#E85D04]" /> : <GraduationCap size={40} className="text-[#E85D04]" />}
                          <span className="text-6xl lg:text-8xl font-bold text-white/10">0{i + 1}</span>
                        </div>
                        <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6">{dept.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {dept.levels.map(level => (
                            <span key={level} className="px-4 py-2 glass rounded-full text-sm text-white/80">
                              {level}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-base lg:text-lg text-white/60 leading-relaxed mb-8">
                          {i === 0 && 'A nurturing environment where young learners develop foundational skills through play-based and structured learning.'}
                          {i === 1 && 'Building strong academic foundations in literacy, numeracy, science and the arts with character development.'}
                          {i === 2 && 'Rigorous academic preparation for BECE with Cambridge enrichment opportunities for high-achieving students.'}
                        </p>
                        <Link to="/academics" className="inline-flex items-center gap-3 text-[#E85D04] font-medium group-hover:gap-4 transition-all">
                          <span>Learn more</span>
                          <ArrowRight size={20} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </HorizontalScroll>
        </div>

        {/* Mobile: Vertical Cards */}
        <div className="md:hidden space-y-6 px-4">
          {departments.map((dept, i) => (
            <ScrollReveal key={dept.id} delay={i * 0.1}>
              <div className="group relative glass rounded-2xl overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${i === 0 ? 'bg-[#E85D04]' : i === 1 ? 'bg-[#FF8C42]' : 'bg-[#FFB366]'}`} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {i === 0 ? <Star size={28} className="text-[#E85D04]" /> : i === 1 ? <BookOpen size={28} className="text-[#E85D04]" /> : <GraduationCap size={28} className="text-[#E85D04]" />}
                    <span className="text-4xl font-bold text-white/10">0{i + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{dept.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dept.levels.map(level => (
                      <span key={level} className="px-3 py-1 glass rounded-full text-xs text-white/80">
                        {level}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-6">
                    {i === 0 && 'A nurturing environment where young learners develop foundational skills through play-based and structured learning.'}
                    {i === 1 && 'Building strong academic foundations in literacy, numeracy, science and the arts with character development.'}
                    {i === 2 && 'Rigorous academic preparation for BECE with Cambridge enrichment opportunities for high-achieving students.'}
                  </p>
                  <Link to="/academics" className="inline-flex items-center gap-2 text-[#E85D04] text-sm font-medium">
                    <span>Learn more</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* School Life - Immersive Grid */}
      <section className="py-20 sm:py-32 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12 sm:mb-20">
            <span className="text-[#E85D04] font-medium text-xs sm:text-sm uppercase tracking-widest">School Life</span>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mt-4 leading-tight">
              More Than<br />
              <span className="gradient-text">Academics</span>
            </h2>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <p className="text-2xl text-white/80 leading-relaxed">
                  At Maple Grove, we believe education extends beyond the classroom. Our students participate in sports, cultural activities, community service, and creative arts that develop well-rounded individuals.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {['Inter-house Sports', 'Debate Club', 'Cultural Dance', 'Science Club', 'Music & Arts', 'Community Service'].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-4 glass rounded-xl hover:border-[#E85D04]/30 transition-colors"
                      whileHover={{ x: 10 }}
                    >
                      <div className="w-2 h-2 bg-[#E85D04] rounded-full" />
                      <span className="text-white/80">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <MagneticButton>
                  <Link to="/gallery" className="inline-flex items-center gap-3 px-8 py-4 bg-[#E85D04] text-white font-medium rounded-full glow-orange hover:bg-[#DC4A03] transition-colors">
                    View Gallery <ArrowRight size={18} />
                  </Link>
                </MagneticButton>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4">
              <ScrollReveal delay={0.2}>
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"
                  alt="Students learning"
                  className="rounded-3xl h-64"
                  speed={0.4}
                />
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80"
                  alt="Classroom"
                  className="rounded-3xl h-48 mt-12"
                  speed={0.3}
                />
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80"
                  alt="School activities"
                  className="rounded-3xl h-48"
                  speed={0.5}
                />
              </ScrollReveal>
              <ScrollReveal delay={0.5}>
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80"
                  alt="Students"
                  className="rounded-3xl h-64 mt-8"
                  speed={0.35}
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* News - Immersive Cards */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <ScrollReveal>
              <span className="text-[#E85D04] font-medium text-xs sm:text-sm uppercase tracking-widest">Latest Updates</span>
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mt-4">News &<br /><span className="gradient-text">Events</span></h2>
            </ScrollReveal>
            <MagneticButton className="hidden sm:inline-flex">
              <Link to="/news" className="inline-flex items-center gap-3 px-6 py-3 glass text-white rounded-full hover:bg-white/10 transition-colors">
                View all <ArrowRight size={16} />
              </Link>
            </MagneticButton>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.2}>
                <TiltCard intensity={8}>
                  <article className="group relative glass rounded-3xl overflow-hidden h-full preserve-3d">
                    <div className="h-56 bg-gradient-to-br from-[#E85D04]/20 to-[#FF8C42]/10 flex items-center justify-center relative overflow-hidden">
                      <Calendar size={48} className="text-white/20" />
                      <div className="absolute inset-0 bg-[#E85D04]/0 group-hover:bg-[#E85D04]/10 transition-colors duration-500" />
                    </div>
                    <div className="p-8 preserve-3d">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[#E85D04]/20 text-[#E85D04] text-xs font-medium rounded-full">{item.category}</span>
                        <span className="text-xs text-white/40">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#E85D04] transition-colors">{item.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{item.excerpt}</p>
                    </div>
                  </article>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events - Timeline Style */}
      <section className="py-20 sm:py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12 sm:mb-20">
            <span className="text-[#E85D04] font-medium text-xs sm:text-sm uppercase tracking-widest">What's Coming Up</span>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mt-4">Upcoming<br /><span className="text-stroke">Events</span></h2>
          </ScrollReveal>

          <div className="space-y-4 sm:space-y-6">
            {events.slice(0, 4).map((event, i) => (
              <ScrollReveal key={event.id} direction="left" delay={i * 0.15}>
                <motion.div
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 p-5 sm:p-8 glass rounded-2xl hover:border-[#E85D04]/30 transition-all duration-500 cursor-pointer"
                  whileHover={{ x: window.innerWidth >= 640 ? 20 : 0 }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E85D04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#E85D04]/10 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover:bg-[#E85D04]/20 transition-colors">
                    <span className="text-[10px] sm:text-xs font-medium text-[#E85D04] uppercase">
                      {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                    </span>
                    <span className="text-xl sm:text-3xl font-bold text-white">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-[#E85D04] transition-colors">{event.title}</h4>
                    <p className="text-sm sm:text-base text-white/60">{event.time}{event.location ? ` • ${event.location}` : ''}</p>
                  </div>
                  <ArrowRight size={20} className="hidden sm:block text-white/20 group-hover:text-[#E85D04] group-hover:translate-x-2 transition-all" />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}

// ============================================================================
// ABOUT PAGE
// ============================================================================
function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">About Us</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">
              Our Story
            </h1>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              Founded in 2008, Maple Grove International School has grown from a small kindergarten into one of Kumasi's most respected private educational institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide a holistic, quality education that develops the intellectual, moral, social and physical potential of every child, preparing them to become responsible citizens and future leaders.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading private school in the Ashanti Region, recognised for academic excellence, character development and innovative teaching that prepares children for a rapidly changing world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Excellence', desc: 'We pursue the highest standards in everything we do.' },
              { title: 'Integrity', desc: 'We act with honesty, fairness and transparency.' },
              { title: 'Respect', desc: 'We value every individual and celebrate diversity.' },
              { title: 'Innovation', desc: 'We embrace new ideas and creative approaches to learning.' },
            ].map((value, i) => (
              <div key={i} className="p-6 bg-white rounded-xl">
                <div className="w-10 h-10 bg-[#E85D04]/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#E85D04] font-bold text-sm">{value.title[0]}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Leadership</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Mr. Kwame Asante', title: 'School Director / Proprietor', bio: 'An educationist with over 20 years of experience in private school management.' },
              { name: 'Mrs. Esi Boateng', title: 'Headteacher', bio: 'A qualified teacher with an MEd from KNUST and 15 years of classroom and leadership experience.' },
              { name: 'Mrs. Abena Mensah', title: 'Head of Administration', bio: 'Manages the school\'s operations, finance and parent relations with precision and care.' },
            ].map((person, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">{person.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h4 className="font-semibold text-gray-900">{person.name}</h4>
                <p className="text-sm text-[#E85D04] mb-2">{person.title}</p>
                <p className="text-sm text-gray-600">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// ACADEMICS PAGE
// ============================================================================
function AcademicsPage() {
  return (
    <div>
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">Academics</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">
              Our Academic Programmes
            </h1>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              We offer a blended curriculum that combines the Ghanaian national curriculum with Cambridge international standards, giving students a strong local foundation with global perspective.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {departments.map((dept, i) => (
            <div key={dept.id} className="grid lg:grid-cols-2 gap-12 items-start">
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{dept.name}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {dept.id === 'early-years' && 'Our Early Years programme creates a safe, stimulating environment where children aged 3 to 5 develop social, emotional, physical and cognitive skills through a blend of play-based learning and structured activities. We follow the GES Early Years curriculum framework.'}
                  {dept.id === 'primary' && 'The Primary programme builds strong foundations in literacy, numeracy, science, creative arts and social studies. Students follow the Ghana Education Service curriculum enriched with Cambridge Primary elements in Mathematics, Science and English.'}
                  {dept.id === 'jhs' && 'Our JHS programme provides rigorous academic preparation for the BECE while offering Cambridge Enrichment for students who wish to pursue international benchmarks. Students choose between the Ghanaian Core and Cambridge Enrichment streams.'}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {dept.levels.map(level => (
                    <span key={level} className="px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-lg">{level}</span>
                  ))}
                </div>
              </div>
              <div className={`rounded-2xl overflow-hidden h-64 bg-gradient-to-br ${i === 0 ? 'from-orange-100 to-orange-200' : i === 1 ? 'from-blue-100 to-blue-200' : 'from-green-100 to-green-200'} flex items-center justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="text-5xl">{i === 0 ? '🧒' : i === 1 ? '📖' : '🎓'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cambridge Stream */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cambridge Enrichment Stream</h2>
            <p className="text-gray-600 leading-relaxed">
              For students who wish to benchmark their learning internationally, our Cambridge Enrichment stream offers Cambridge Progression Tests and additional support in English, Mathematics and Science.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Cambridge Primary', desc: 'International benchmarks for Primary 4 to 6 in core subjects.' },
              { title: 'Progression Tests', desc: 'Annual assessments that measure student performance against global standards.' },
              { title: 'Certificate Pathway', desc: 'Preparation for Cambridge Lower Secondary and IGCSE qualifications.' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// ADMISSIONS PAGE
// ============================================================================
function AdmissionsPage() {
  const [formData, setFormData] = useState({
    childName: '', dob: '', applyingFor: '', parentName: '', parentPhone: '', parentEmail: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Received</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in Maple Grove International School. Our admissions team will review your application and contact you within 5 working days.
          </p>
          <Link to="/" className="text-[#E85D04] font-medium text-sm hover:underline">Return to homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">Admissions</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">
              Join Our School Family
            </h1>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              We welcome applications from families who share our commitment to academic excellence and character development.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Admission Process</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Submit Application', desc: 'Complete the online form below or collect a form from our admissions office.' },
              { step: '02', title: 'Assessment', desc: 'Your child will take a simple assessment to determine the appropriate class placement.' },
              { step: '03', title: 'Interview', desc: 'A brief meeting with parents and the child to discuss expectations and fit.' },
              { step: '04', title: 'Enrolment', desc: 'Upon acceptance, complete enrolment documentation and fee payment.' },
            ].map((item, i) => (
              <div key={i} className="relative p-6 bg-gray-50 rounded-xl">
                <span className="text-3xl font-bold text-[#E85D04]/20">{item.step}</span>
                <h4 className="font-semibold text-gray-900 mt-2 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Entry Requirements</h3>
              <ul className="space-y-3">
                {[
                  'Completed application form',
                  'Birth certificate or passport of child',
                  'Previous school report (if applicable)',
                  'Passport photographs of child (2)',
                  'Parent/guardian identification',
                  'Immunisation records (for Early Years)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#E85D04]/10 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#E85D04] rounded-full" />
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Important Dates</h3>
              <div className="space-y-4">
                {[
                  { label: 'Applications Open', date: 'January 2026' },
                  { label: 'Assessment Period', date: 'February - March 2026' },
                  { label: 'Offers Released', date: 'April 2026' },
                  { label: 'Enrolment Deadline', date: 'June 2026' },
                  { label: 'School Opens', date: 'September 2026' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white" id="apply">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Online Application</h2>
          <p className="text-gray-600 mb-8">Fill in the form below to start the admission process.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Child's Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.childName}
                  onChange={e => setFormData({...formData, childName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  placeholder="e.g. Kwame Mensah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Applying For *</label>
              <select
                required
                value={formData.applyingFor}
                onChange={e => setFormData({...formData, applyingFor: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
              >
                <option value="">Select a class</option>
                {['KG 1', 'KG 2', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Parent/Guardian Information</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={e => setFormData({...formData, parentName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                    placeholder="Parent/Guardian name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={e => setFormData({...formData, parentPhone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={e => setFormData({...formData, parentEmail: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04] resize-none"
                placeholder="Any additional information you would like to share..."
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// GALLERY PAGE
// ============================================================================
function GalleryPage() {
  return (
    <div>
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">Gallery</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">School Life in Pictures</h1>
            <p className="text-lg text-gray-600 mt-4">Moments that capture the spirit of Maple Grove.</p>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryAlbums.map((album, i) => {
              const images = [
                'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80',
                'https://images.unsplash.com/photo-1567168544230-b15b2e8e8b64?w=600&q=80',
                'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
                'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfbb?w=600&q=80',
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
              ];
              return (
              <div key={album.id} className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden h-56 bg-cover bg-center group-hover:scale-[1.02] transition-transform" style={{ backgroundImage: `url('${images[i]}')` }} />
                <div className="mt-3">
                  <h3 className="font-medium text-gray-900">{album.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{album.imageCount} photos • {new Date(album.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// NEWS PAGE
// ============================================================================
function NewsPage() {
  return (
    <div>
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">News & Updates</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">Latest from Maple Grove</h1>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {news.map(item => (
              <article key={item.id} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100">
                <div className="w-full sm:w-48 h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-[#E85D04] bg-orange-50 px-2 py-1 rounded">{item.category}</span>
                    <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// CONTACT PAGE
// ============================================================================
function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">Contact</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3">Get in Touch</h1>
            <p className="text-lg text-gray-600 mt-4">We would love to hear from you. Reach out for enquiries, visits or any questions.</p>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {[
                  { icon: <MapPin size={18} />, label: 'Address', value: school.address },
                  { icon: <Phone size={18} />, label: 'Phone', value: `${school.phone} / ${school.phoneAlt}` },
                  { icon: <Mail size={18} />, label: 'Email', value: school.email },
                  { icon: <Clock size={18} />, label: 'Office Hours', value: 'Monday to Friday: 7:30 AM to 4:00 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#E85D04]/10 rounded-lg flex items-center justify-center text-[#E85D04] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">14 Asanteman Road, Ayigya, Kumasi</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
              {sent ? (
                <div className="p-8 bg-green-50 rounded-xl text-center">
                  <p className="text-green-800 font-medium">Message sent successfully!</p>
                  <p className="text-sm text-green-600 mt-2">We will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                      <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <input type="tel" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]" placeholder="+233 XX XXX XXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]">
                      <option>General Enquiry</option>
                      <option>Admissions</option>
                      <option>School Visit</option>
                      <option>Fees Information</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea rows={4} required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04] resize-none" placeholder="How can we help?" />
                  </div>
                  <button type="submit" className="px-8 py-3.5 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// DEMO BANNER
// ============================================================================
function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in-up">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-4 border border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#E85D04] uppercase tracking-wide mb-1">Explore the Ecosystem</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              This website is connected to a parent portal and school management platform. See the full experience.
            </p>
            <div className="flex gap-2 mt-3">
              <Link to="/parent" className="px-3 py-1.5 bg-[#E85D04] text-white text-xs font-medium rounded-lg hover:bg-[#DC4A03] transition-colors">
                Parent Portal
              </Link>
              <Link to="/admin" className="px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                School Admin
              </Link>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="text-gray-400 hover:text-white shrink-0">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PUBLIC LAYOUT
// ============================================================================
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>{children}</main>
      <Footer />
      <DemoBanner />
    </div>
  );
}

// ============================================================================
// EXPORT ALL PUBLIC PAGES
// ============================================================================
export { HomePage, AboutPage, AcademicsPage, AdmissionsPage, GalleryPage, NewsPage, ContactPage };
