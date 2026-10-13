import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, BookOpen, Users, Award, Star, GraduationCap, Quote } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero3DScene } from '../components/three/HeroScene';
import { MouseSpotlightCSS } from '../components/motion/MouseSpotlight';
import { TiltCard } from '../components/motion/TiltCard';
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
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <MouseSpotlightCSS />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E85D04] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MG</span>
              </div>
              <div className="text-gray-900">
                <div className="font-semibold text-sm">Maple Grove</div>
                <div className="text-xs opacity-50">International School</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-[#E85D04] transition-colors">About</Link>
              <Link to="/academics" className="text-sm font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Academics</Link>
              <Link to="/admissions" className="text-sm font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Admissions</Link>
              <Link to="/gallery" className="text-sm font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Gallery</Link>
              <Link to="/news" className="text-sm font-medium text-gray-700 hover:text-[#E85D04] transition-colors">News</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Contact</Link>
              <Link to="/parent" className="px-4 py-2 bg-[#E85D04] text-white text-sm font-medium rounded-lg hover:bg-[#DC4A03] transition-colors">Parent Portal</Link>
              <Link to="/admin" className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Admin</Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-2">
              <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">About</Link>
              <Link to="/academics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Academics</Link>
              <Link to="/admissions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Admissions</Link>
              <Link to="/gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Gallery</Link>
              <Link to="/news" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">News</Link>
              <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Contact</Link>
              <div className="pt-2 border-t space-y-2">
                <Link to="/parent" className="block px-4 py-2 bg-[#E85D04] text-white text-sm font-medium rounded-lg text-center">Parent Portal</Link>
                <Link to="/admin" className="block px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg text-center">Admin</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with 3D */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Hero3DScene />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/30 to-[#1a1a1a]/70 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E85D04]/10 via-transparent to-[#E85D04]/10 z-[1]" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
              <div className="w-2 h-2 bg-[#E85D04] rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/90 tracking-widest uppercase">Now Enrolling 2026/2027</span>
            </div>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-bold text-white leading-[0.9] mb-8 tracking-tight">
            <CharReveal text="WHERE" className="block" delay={200} />
            <CharReveal text="EVERY" className="block" delay={400} />
            <span className="block gradient-text">
              <CharReveal text="CHILD" className="block" delay={600} />
            </span>
            <span className="block" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}>
              <CharReveal text="DISCOVERS" className="block" delay={800} />
            </span>
            <CharReveal text="THEIR BEST" className="block" delay={1000} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed px-4"
          >
            A premium private school in Kumasi offering a blended Ghanaian and Cambridge curriculum from Early Years through Junior High School.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 px-4"
          >
            <MagneticButton>
              <Link
                to="/admissions"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#E85D04] text-white font-medium rounded-full overflow-hidden glow-orange"
              >
                <span className="relative z-10">Apply for Admission</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-colors"
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
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/50 tracking-widest uppercase">Scroll</span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text mb-2">2008</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Established</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text mb-2">320+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Students</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text mb-2">95%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">BECE Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold gradient-text mb-2">25:1</div>
                <div className="text-sm text-gray-600 uppercase tracking-wider">Student-Teacher Ratio</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Welcome Message from Director */}
      <section className="py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E85D04]/10 rounded-full mb-6">
                  <Quote size={16} className="text-[#E85D04]" />
                  <span className="text-xs font-medium text-[#E85D04]">Welcome Message</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  A Message from Our <span className="gradient-text">School Director</span>
                </h2>
                <div className="prose prose-lg text-gray-600 space-y-4">
                  <p>
                    On behalf of the Maple Grove International School community, I welcome you to our digital home. It is my hope that by the time you are done navigating through our various pages, you will not only be satisfied with what you will read and see, but you will equally develop a unique affinity to our brand and services.
                  </p>
                  <p>
                    In 2008, when a group of visionary educators decided to establish a school that would combine the rigour of the Ghanaian national curriculum with the global perspective of Cambridge international standards, little did they know that this school would grow to become one of Kumasi's most respected educational institutions.
                  </p>
                  <p>
                    Today, with over 320 students from Early Years through Junior High School, we continue to nurture excellence and build character in every child who walks through our doors. Our commitment to small class sizes, personalized attention, and holistic development remains unwavering.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E85D04] to-[#DC4A03] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    KA
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Mr. Kwame Asante</div>
                    <div className="text-sm text-gray-600">School Director / Proprietor</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative">
                <div className="aspect-[4/5] bg-gradient-to-br from-[#E85D04]/20 to-[#DC4A03]/20 rounded-3xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" 
                    alt="School Director" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#E85D04]/10 rounded-full blur-3xl" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Futuristic Cards */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E85D04] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF8C42] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-widest">Why Parents Choose Us</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 leading-tight">
              Education That<br />
              <span className="gradient-text">Prepares For Life</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {[
              {
                icon: <BookOpen size={32} />,
                title: 'Blended Curriculum',
                description: 'We combine the rigour of the Ghanaian national curriculum with Cambridge international standards, giving students the best of both worlds. Our students are prepared for both local BECE and international examinations.',
                stat: '2 Curricula',
              },
              {
                icon: <Users size={32} />,
                title: 'Small Class Sizes',
                description: 'With a maximum of 25 students per class, every child receives personal attention and support from dedicated teachers. Our student-teacher ratio of 25:1 ensures no child is left behind.',
                stat: '25:1 Ratio',
              },
              {
                icon: <Award size={32} />,
                title: 'Proven Results',
                description: 'Our students consistently achieve outstanding BECE results, with 95% obtaining Grade 1-3 in core subjects over the past three years. We have a track record of excellence.',
                stat: '95% Success',
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.2}>
                <TiltCard intensity={10}>
                  <div className="group relative p-8 sm:p-10 bg-[#FAFAF7] border border-gray-100 rounded-3xl h-full hover:border-[#E85D04]/30 hover:shadow-xl transition-all duration-500">
                    <div className="absolute top-6 right-6 text-4xl font-bold text-gray-100 group-hover:text-[#E85D04]/10 transition-colors">
                      {item.stat}
                    </div>
                    <div className="relative">
                      <div className="w-16 h-16 bg-[#E85D04]/10 rounded-2xl flex items-center justify-center text-[#E85D04] mb-6 group-hover:bg-[#E85D04]/20 transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">320+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">18</div>
              <div className="text-sm text-gray-600">Years</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-sm text-gray-600">BECE Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">25:1</div>
              <div className="text-sm text-gray-600">Class Size</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Education That <span className="gradient-text">Prepares For Life</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine academic excellence with character development to nurture well-rounded individuals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#E85D04]/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Blended Curriculum</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Combining Ghanaian national curriculum with Cambridge international standards for global excellence.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#E85D04]/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Small Class Sizes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Maximum 25 students per class ensures personalized attention and support for every child.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#E85D04]/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                95% of students achieve Grade 1-3 in core subjects with outstanding BECE results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2a1810] via-[#1a1a1a] to-[#2a1810] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Give <span className="gradient-text">Your Child</span> The Best Start?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Join the Maple Grove family. Applications are now open for the 2026/2027 academic year.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions" className="px-8 py-3 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors shadow-lg shadow-orange-500/20">
              Start Application
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-colors">
              Book a Visit
            </Link>
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section className="py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-widest">Our Programmes</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4">
              From First Steps to <span className="gradient-text">BECE Success</span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                level: 'Early Years',
                ages: 'KG 1 - KG 2',
                description: 'A nurturing environment where young learners develop foundational skills through play-based and structured learning. We follow the GES Early Years curriculum framework.',
                icon: <Star size={32} />,
                color: 'from-orange-400 to-orange-600',
              },
              {
                level: 'Primary School',
                ages: 'Primary 1 - 6',
                description: 'Building strong academic foundations in literacy, numeracy, science and the arts with character development. Cambridge Primary elements enrich our Ghanaian curriculum.',
                icon: <BookOpen size={32} />,
                color: 'from-orange-500 to-orange-700',
              },
              {
                level: 'Junior High School',
                ages: 'JHS 1 - 3',
                description: 'Rigorous academic preparation for BECE with Cambridge enrichment opportunities for high-achieving students. Students choose between Ghanaian Core and Cambridge Enrichment streams.',
                icon: <GraduationCap size={32} />,
                color: 'from-orange-600 to-orange-800',
              },
            ].map((programme, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <TiltCard intensity={8}>
                  <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
                    <div className={`h-2 bg-gradient-to-r ${programme.color}`} />
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#E85D04]/10 rounded-2xl flex items-center justify-center text-[#E85D04] group-hover:bg-[#E85D04]/20 transition-colors">
                          {programme.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{programme.level}</h3>
                          <p className="text-sm text-gray-500">{programme.ages}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-6">{programme.description}</p>
                      <Link to="/academics" className="inline-flex items-center gap-2 text-[#E85D04] font-medium group-hover:gap-3 transition-all">
                        Learn more <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* School Life Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <span className="text-[#E85D04] font-medium text-sm uppercase tracking-widest">School Life</span>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-6">
                  More Than <span className="gradient-text">Academics</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  At Maple Grove, we believe education extends beyond the classroom. Our students participate in sports, cultural activities, community service, and creative arts that develop well-rounded individuals.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {['Inter-house Sports', 'Debate Club', 'Cultural Dance', 'Science Club', 'Music & Arts', 'Community Service'].map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#FAFAF7] rounded-xl">
                      <div className="w-2 h-2 bg-[#E85D04] rounded-full" />
                      <span className="text-sm text-gray-700">{activity}</span>
                    </div>
                  ))}
                </div>
                <MagneticButton>
                  <Link to="/gallery" className="inline-flex items-center gap-3 px-8 py-4 bg-[#E85D04] text-white font-medium rounded-full glow-orange hover:bg-[#DC4A03] transition-colors">
                    View Gallery <ArrowRight size={18} />
                  </Link>
                </MagneticButton>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" alt="Students" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" alt="Classroom" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-200 rounded-3xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80" alt="Activities" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80" alt="School" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-widest">Our Leadership</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Our dedicated leadership team brings together decades of experience in education, committed to nurturing the next generation of leaders.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Mr. Kwame Asante',
                role: 'School Director / Proprietor',
                bio: 'An educationist with over 20 years of experience in private school management.',
                initials: 'KA',
              },
              {
                name: 'Mrs. Esi Boateng',
                role: 'Headteacher',
                bio: 'A qualified teacher with an MEd from KNUST and 15 years of classroom and leadership experience.',
                initials: 'EB',
              },
              {
                name: 'Mrs. Abena Mensah',
                role: 'Head of Administration',
                bio: "Manages the school's operations, finance and parent relations with precision and care.",
                initials: 'AM',
              },
              {
                name: 'Mr. Daniel Asare',
                role: 'Head of Academics',
                bio: 'Oversees curriculum development and ensures academic excellence across all levels.',
                initials: 'DA',
              },
            ].map((leader, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <TiltCard intensity={5}>
                  <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#E85D04]/30 hover:shadow-xl transition-all duration-500 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#E85D04] to-[#DC4A03] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                      {leader.initials}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                    <p className="text-sm text-[#E85D04] font-medium mb-4">{leader.role}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{leader.bio}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Student Leadership */}
          <ScrollReveal className="mt-16">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Student Leadership</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our student prefect body plays a vital role in school governance, representing their peers and developing leadership skills.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { role: 'Head Prefect', name: 'Student Name', house: 'Eagles House' },
                  { role: 'Deputy Head Prefect', name: 'Student Name', house: 'Doves House' },
                  { role: 'Senior Prefect', name: 'Student Name', house: 'Lions House' },
                  { role: 'Senior Prefect', name: 'Student Name', house: 'Panthers House' },
                ].map((prefect, i) => (
                  <div key={i} className="text-center p-6 bg-[#FAFAF7] rounded-2xl">
                    <div className="w-16 h-16 bg-[#E85D04]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap size={24} className="text-[#E85D04]" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{prefect.role}</h4>
                    <p className="text-sm text-gray-600">{prefect.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{prefect.house}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#E85D04] font-medium text-sm uppercase tracking-widest">Latest Updates</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4">News & Events</h2>
            </div>
            <MagneticButton className="hidden sm:inline-flex">
              <Link to="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-full hover:border-[#E85D04]/30 transition-colors">
                View all <ArrowRight size={16} />
              </Link>
            </MagneticButton>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Second Term Opens with Record Enrolment',
                date: '2026-01-12',
                category: 'School News',
                excerpt: 'Maple Grove begins the second term with over 320 students, marking a 15% increase.',
              },
              {
                title: 'Inter-School Quiz Competition Victory',
                date: '2026-01-28',
                category: 'Achievement',
                excerpt: 'Our JHS quiz team wins the Ashanti Regional competition for the second consecutive year.',
              },
              {
                title: 'PTA Meeting Scheduled for February',
                date: '2026-02-01',
                category: 'Announcement',
                excerpt: 'All parents are invited to the Second Term PTA meeting on Saturday, February 15th.',
              },
            ].map((news, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <TiltCard intensity={5}>
                  <article className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500">
                    <div className="h-48 bg-gradient-to-br from-[#E85D04]/10 to-[#FF8C42]/5 flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#E85D04]/20 rounded-full flex items-center justify-center">
                        <BookOpen size={32} className="text-[#E85D04]" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#E85D04]/10 text-[#E85D04] text-xs font-medium rounded-full">
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(news.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#E85D04] transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{news.excerpt}</p>
                    </div>
                  </article>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-[#2a1810] via-[#1a1a1a] to-[#2a1810] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1810]/85 via-[#1a1a1a]/80 to-[#2a1810]/85" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E85D04] rounded-full blur-[150px] opacity-20" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF8C42] rounded-full blur-[150px] opacity-20" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Ready to Give<br />
              <span className="gradient-text">Your Child</span><br />
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}>The Best Start?</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Join the Maple Grove family. Applications are now open for the 2026/2027 academic year.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6">
              <MagneticButton>
                <Link
                  to="/admissions"
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#E85D04] text-white text-lg font-medium rounded-full overflow-hidden glow-orange"
                >
                  <span className="relative z-10">Start Application</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-medium rounded-full hover:bg-white/20 transition-colors"
                >
                  Book a School Visit
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E85D04] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MG</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Maple Grove</div>
                  <div className="text-xs text-gray-400">International School</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Nurturing Excellence, Building Character
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
                <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
                <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Programmes</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Early Years (KG 1 - KG 2)</li>
                <li>Primary (P1 - P6)</li>
                <li>Junior High School</li>
                <li>Cambridge Enrichment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>14 Asanteman Road, Ayigya, Kumasi</li>
                <li>+233 24 123 4567</li>
                <li>info@maplegrove.edu.gh</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">&copy; 2026 Maple Grove International School. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/parent" className="text-xs text-gray-500 hover:text-white transition-colors">Parent Portal</Link>
              <Link to="/admin" className="text-xs text-gray-500 hover:text-white transition-colors">School Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
