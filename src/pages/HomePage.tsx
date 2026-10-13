import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Quote } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MouseSpotlightCSS } from '../components/motion/MouseSpotlight';
import { ScrollReveal } from '../components/motion/ScrollReveal';
import { MagneticButton } from '../components/motion/MagneticButton';
import { CharReveal } from '../components/motion/TextScramble';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <MouseSpotlightCSS />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E85D04] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MG</span>
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">Maple Grove</div>
                <div className="text-xs opacity-70">International School</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-base font-medium text-white/90 hover:text-[#E85D04] transition-colors">About</Link>
              <Link to="/academics" className="text-base font-medium text-white/90 hover:text-[#E85D04] transition-colors">Academics</Link>
              <Link to="/admissions" className="text-base font-medium text-white/90 hover:text-[#E85D04] transition-colors">Admissions</Link>
              <Link to="/gallery" className="text-base font-medium text-white/90 hover:text-[#E85D04] transition-colors">Gallery</Link>
              <Link to="/news" className="text-base font-medium text-white/90 hover:text-[#E85D04] transition-colors">News</Link>
              <Link to="/contact" className="text-base font-medium text-white/90 hover:text-[#E85D04] transition-colors">Contact</Link>
              <Link to="/parent" className="px-6 py-3 bg-[#E85D04] text-white text-base font-semibold rounded-full hover:bg-[#DC4A03] transition-colors shadow-lg">Parent Portal</Link>
              <Link to="/admin" className="px-6 py-3 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-base font-semibold rounded-full hover:bg-white/20 transition-colors">Admin</Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a1a1a] border-t border-white/10">
            <div className="px-4 py-6 space-y-3">
              <Link to="/about" className="block px-4 py-3 text-base text-white/90 hover:bg-white/5 rounded-lg">About</Link>
              <Link to="/academics" className="block px-4 py-3 text-base text-white/90 hover:bg-white/5 rounded-lg">Academics</Link>
              <Link to="/admissions" className="block px-4 py-3 text-base text-white/90 hover:bg-white/5 rounded-lg">Admissions</Link>
              <Link to="/gallery" className="block px-4 py-3 text-base text-white/90 hover:bg-white/5 rounded-lg">Gallery</Link>
              <Link to="/news" className="block px-4 py-3 text-base text-white/90 hover:bg-white/5 rounded-lg">News</Link>
              <Link to="/contact" className="block px-4 py-3 text-base text-white/90 hover:bg-white/5 rounded-lg">Contact</Link>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link to="/parent" className="block px-4 py-3 bg-[#E85D04] text-white text-base font-semibold rounded-lg text-center">Parent Portal</Link>
                <Link to="/admin" className="block px-4 py-3 bg-white/10 border-2 border-white/30 text-white text-base font-semibold rounded-lg text-center">Admin</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with School Image */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* School Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <img 
            src="/generated-images/18a01946-dafb-44d2-932c-18e2a4ecec2e/_result.png"
            alt="Maple Grove International School Campus"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/40 to-[#1a1a1a]/80 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E85D04]/20 via-transparent to-[#E85D04]/20 z-[1]" />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ y: textY, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-[#E85D04] rounded-full mb-8 shadow-2xl">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-base font-bold text-white tracking-wider uppercase">Now Enrolling 2026/2027</span>
            </div>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-bold text-white leading-[0.9] mb-8 tracking-tight">
            <CharReveal text="WHERE" className="block" delay={200} />
            <CharReveal text="EVERY" className="block" delay={400} />
            <span className="block gradient-text">
              <CharReveal text="CHILD" className="block" delay={600} />
            </span>
            <span className="block" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.6)', color: 'transparent' }}>
              <CharReveal text="DISCOVERS" className="block" delay={800} />
            </span>
            <CharReveal text="THEIR BEST" className="block" delay={1000} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xl sm:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed px-4"
          >
            A premium private school in Kumasi offering a blended Ghanaian and Cambridge curriculum from Early Years through Junior High School.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 px-4"
          >
            <MagneticButton>
              <Link
                to="/admissions"
                className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-[#E85D04] text-white text-xl font-bold rounded-full overflow-hidden shadow-2xl hover:bg-[#DC4A03] transition-colors"
              >
                <span>Apply for Admission</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-[#1a1a1a] text-xl font-bold rounded-full shadow-2xl hover:bg-gray-100 transition-colors"
              >
                Explore Our School
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-base text-white/70 tracking-widest uppercase font-medium">Scroll</span>
            <motion.div
              className="w-1 h-20 bg-gradient-to-b from-white/70 to-transparent"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section - Full Width Dark */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center border-r border-white/10 last:border-r-0">
                <div className="text-7xl font-bold text-[#E85D04] mb-4">2008</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">Established</div>
              </div>
              <div className="text-center border-r border-white/10">
                <div className="text-7xl font-bold text-[#E85D04] mb-4">320+</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">Students</div>
              </div>
              <div className="text-center border-r border-white/10">
                <div className="text-7xl font-bold text-[#E85D04] mb-4">95%</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">BECE Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-7xl font-bold text-[#E85D04] mb-4">25:1</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">Student-Teacher Ratio</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Welcome Message - Full Width */}
      <section className="py-24 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#E85D04] rounded-full mb-6">
                <Quote size={20} className="text-white" />
                <span className="text-base font-bold text-white">Welcome Message</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#1a1a1a] mb-6">
                A Message from Our <span className="gradient-text">School Director</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" 
                    alt="School Director" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#E85D04]/20 rounded-full blur-3xl" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="space-y-8">
                <div className="text-2xl text-[#1a1a1a] leading-relaxed">
                  <p className="mb-8 text-3xl font-medium">
                    On behalf of the Maple Grove International School community, I welcome you to our digital home.
                  </p>
                  <p className="mb-8 text-xl">
                    In 2008, when a group of visionary educators decided to establish a school that would combine the rigour of the Ghanaian national curriculum with the global perspective of Cambridge international standards, little did they know that this school would grow to become one of Kumasi's most respected educational institutions.
                  </p>
                  <p className="text-xl">
                    Today, with over 320 students from Early Years through Junior High School, we continue to nurture excellence and build character in every child who walks through our doors.
                  </p>
                </div>
                <div className="pt-8 border-t-4 border-[#E85D04]">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#E85D04] to-[#DC4A03] rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                      KA
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-[#1a1a1a]">Mr. Kwame Asante</div>
                      <div className="text-xl text-[#E85D04] font-semibold">School Director / Proprietor</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Full Width Sections */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-20">
            <span className="text-[#E85D04] font-bold text-lg uppercase tracking-widest">Why Parents Choose Us</span>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mt-6 leading-tight">
              Education That<br />
              <span className="gradient-text">Prepares For Life</span>
            </h2>
          </ScrollReveal>

          <div className="space-y-24">
            {/* Feature 1 */}
            <ScrollReveal>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="text-8xl font-bold text-[#E85D04]/20 mb-4">01</div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6">Blended Curriculum</h3>
                  <p className="text-xl text-white/80 leading-relaxed mb-8">
                    We combine the rigour of the Ghanaian national curriculum with Cambridge international standards, giving students the best of both worlds. Our students are prepared for both local BECE and international examinations.
                  </p>
                  <div className="text-6xl font-bold text-[#E85D04]">2 Curricula</div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-[#E85D04]/20 to-[#DC4A03]/20 rounded-3xl overflow-hidden">
                  <img 
                    src="/generated-images/ffa9b3a9-22ad-4f05-aebf-c302436fd777/_result.png"
                    alt="Students learning"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="lg:order-2">
                  <div className="text-8xl font-bold text-[#E85D04]/20 mb-4">02</div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6">Small Class Sizes</h3>
                  <p className="text-xl text-white/80 leading-relaxed mb-8">
                    With a maximum of 25 students per class, every child receives personal attention and support from dedicated teachers. Our student-teacher ratio of 25:1 ensures no child is left behind.
                  </p>
                  <div className="text-6xl font-bold text-[#E85D04]">25:1 Ratio</div>
                </div>
                <div className="lg:order-1 aspect-video bg-gradient-to-br from-[#E85D04]/20 to-[#DC4A03]/20 rounded-3xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
                    alt="Small class"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="text-8xl font-bold text-[#E85D04]/20 mb-4">03</div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6">Proven Results</h3>
                  <p className="text-xl text-white/80 leading-relaxed mb-8">
                    Our students consistently achieve outstanding BECE results, with 95% obtaining Grade 1-3 in core subjects over the past three years. We have a track record of excellence.
                  </p>
                  <div className="text-6xl font-bold text-[#E85D04]">95% Success</div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-[#E85D04]/20 to-[#DC4A03]/20 rounded-3xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
                    alt="Success"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-[#E85D04] to-[#DC4A03] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 leading-tight">
              Ready to Give<br />
              <span className="text-white">Your Child</span><br />
              The Best Start?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-2xl text-white/90 mb-16 max-w-3xl mx-auto">
              Join the Maple Grove family. Applications are now open for the 2026/2027 academic year.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-8">
              <MagneticButton>
                <Link
                  to="/admissions"
                  className="group relative inline-flex items-center justify-center gap-4 px-16 py-8 bg-white text-[#E85D04] text-2xl font-bold rounded-full overflow-hidden shadow-2xl hover:bg-gray-100 transition-colors"
                >
                  <span>Start Application</span>
                  <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-4 px-16 py-8 bg-[#1a1a1a] text-white text-2xl font-bold rounded-full shadow-2xl hover:bg-[#2a2a2a] transition-colors"
                >
                  Book a School Visit
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#E85D04] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MG</span>
                </div>
                <div>
                  <div className="font-bold text-lg">Maple Grove</div>
                  <div className="text-sm text-white/60">International School</div>
                </div>
              </div>
              <p className="text-base text-white/60">
                Nurturing Excellence, Building Character
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-base text-white/60">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
                <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
                <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Programmes</h4>
              <ul className="space-y-3 text-base text-white/60">
                <li>Early Years (KG 1 - KG 2)</li>
                <li>Primary (P1 - P6)</li>
                <li>Junior High School</li>
                <li>Cambridge Enrichment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <ul className="space-y-3 text-base text-white/60">
                <li>14 Asanteman Road, Ayigya, Kumasi</li>
                <li>+233 24 123 4567</li>
                <li>info@maplegrove.edu.gh</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-base text-white/50">&copy; 2026 Maple Grove International School. All rights reserved.</p>
            <div className="flex gap-8">
              <Link to="/parent" className="text-base text-white/50 hover:text-white transition-colors">Parent Portal</Link>
              <Link to="/admin" className="text-base text-white/50 hover:text-white transition-colors">School Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
