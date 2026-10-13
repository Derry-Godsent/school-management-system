import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Facebook, Youtube, Instagram } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MouseSpotlightCSS } from '../components/motion/MouseSpotlight';
import { ScrollReveal } from '../components/motion/ScrollReveal';
import { MagneticButton } from '../components/motion/MagneticButton';
import { CharReveal } from '../components/motion/TextScramble';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const heroSlides = [
    {
      title: 'Maple Grove International School',
      subtitle: 'Nurturing Excellence | Building Character | Transforming Futures',
      image: '/generated-images/18a01946-dafb-44d2-932c-18e2a4ecec2e/_result.png',
    },
    {
      title: 'Our Vision',
      subtitle: "To be Kumasi's premier institution for quality and holistic education, blending Ghanaian values with global standards.",
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80',
    },
    {
      title: 'Excellence in Education',
      subtitle: 'Where every child discovers their best through personalized learning and character development.',
      image: '/generated-images/ffa9b3a9-22ad-4f05-aebf-c302436fd777/_result.png',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <MouseSpotlightCSS />
      
      {/* Top Contact Bar */}
      <div className="bg-[#1a1a1a] text-white py-3 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span>+233 24 123 4567 | +233 20 987 6543</span>
            <a href="mailto:info@maplegrove.edu.gh" className="hover:text-[#E85D04] transition-colors">
              info@maplegrove.edu.gh
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/parent" className="hover:text-[#E85D04] transition-colors">Parent Portal</Link>
            <span>|</span>
            <Link to="/admin" className="hover:text-[#E85D04] transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#E85D04] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MG</span>
              </div>
              <div className="text-gray-900">
                <div className="font-bold text-xl">Maple Grove</div>
                <div className="text-xs text-gray-600">International School</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-base font-medium text-gray-900 hover:text-[#E85D04] transition-colors">Home</Link>
              <Link to="/about" className="text-base font-medium text-gray-700 hover:text-[#E85D04] transition-colors">About</Link>
              <Link to="/academics" className="text-base font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Academics</Link>
              <Link to="/admissions" className="text-base font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Admissions</Link>
              <Link to="/gallery" className="text-base font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Gallery</Link>
              <Link to="/news" className="text-base font-medium text-gray-700 hover:text-[#E85D04] transition-colors">News</Link>
              <Link to="/contact" className="text-base font-medium text-gray-700 hover:text-[#E85D04] transition-colors">Contact</Link>
              <Link to="/admissions" className="px-8 py-3 bg-[#E85D04] text-white text-base font-semibold rounded-full hover:bg-[#DC4A03] transition-colors shadow-lg">
                Apply Now
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-900"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-6 space-y-3">
              <Link to="/" className="block px-4 py-3 text-base text-gray-900 hover:bg-gray-50 rounded-lg">Home</Link>
              <Link to="/about" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg">About</Link>
              <Link to="/academics" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg">Academics</Link>
              <Link to="/admissions" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg">Admissions</Link>
              <Link to="/gallery" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg">Gallery</Link>
              <Link to="/news" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg">News</Link>
              <Link to="/contact" className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg">Contact</Link>
              <div className="pt-4 border-t">
                <Link to="/admissions" className="block px-4 py-3 bg-[#E85D04] text-white text-base font-semibold rounded-lg text-center">
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Slider Section */}
      <section ref={heroRef} className="relative h-[90vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0"
              style={{ y: backgroundY }}
            >
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover scale-110"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/30 to-[#1a1a1a]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E85D04]/20 via-transparent to-[#E85D04]/20" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
                  <CharReveal text={heroSlides[currentSlide].title} className="block" delay={0} />
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <MagneticButton>
                    <Link
                      to="/admissions"
                      className="inline-flex items-center gap-3 px-12 py-6 bg-[#E85D04] text-white text-xl font-bold rounded-full shadow-2xl hover:bg-[#DC4A03] transition-colors"
                    >
                      Apply Now <ArrowRight size={24} />
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#1a1a1a] text-xl font-bold rounded-full shadow-2xl hover:bg-gray-100 transition-colors"
                    >
                      Learn More
                    </Link>
                  </MagneticButton>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-[#E85D04] w-12' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ScrollReveal>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-bold text-[#E85D04] mb-3">2008</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">Established</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-bold text-[#E85D04] mb-3">320+</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">Students</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-bold text-[#E85D04] mb-3">18</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">Years of Excellence</div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="text-center">
                <div className="text-6xl sm:text-7xl font-bold text-[#E85D04] mb-3">95%</div>
                <div className="text-base text-white/70 uppercase tracking-wider font-medium">BECE Pass Rate</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-24 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-8">
                  Welcome to <span className="gradient-text">Maple Grove</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl mb-12">
                  <blockquote className="text-xl text-gray-700 leading-relaxed mb-8">
                    <p className="mb-6">
                      On behalf of the Maple Grove International School community, I welcome you to our digital home. It is my hope that by the time you are done navigating through our various pages, you will not only be satisfied with what you will read and see, but you will equally develop a unique affinity to our brand and services.
                    </p>
                    <p className="mb-6">
                      In 2008, when a group of visionary educators decided to establish a school that would combine the rigour of the Ghanaian national curriculum with the global perspective of Cambridge international standards, little did they know that this school would grow to become one of Kumasi's most respected educational institutions.
                    </p>
                    <p>
                      Today, with over 320 students from Early Years through Junior High School, we continue to nurture excellence and build character in every child who walks through our doors.
                    </p>
                  </blockquote>
                  <div className="pt-6 border-t-4 border-[#E85D04]">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#E85D04] to-[#DC4A03] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        KA
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#1a1a1a]">Mr. Kwame Asante</div>
                        <div className="text-lg text-[#E85D04] font-semibold">School Director / Proprietor</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* News/Achievement Section */}
              <ScrollReveal delay={0.3}>
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl">
                  <div className="flex gap-4 mb-8">
                    <img 
                      src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80"
                      alt="Achievement"
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&q=80"
                      alt="Students"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=300&q=80"
                      alt="School"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-lg text-gray-700 leading-relaxed space-y-4">
                    <p>
                      We are proud to announce that our JHS 3 students achieved outstanding results in the 2025 BECE examinations, with 95% obtaining Grade 1-3 in core subjects. This remarkable achievement reflects the dedication of our students, teachers, and the supportive learning environment we have cultivated.
                    </p>
                    <p>
                      Congratulations to all our students who excelled! Your hard work and determination inspire us all. Special recognition goes to Kofi Mensah, who achieved aggregate 6, representing the best performance in the Ashanti Region.
                    </p>
                    <p>
                      As we celebrate these achievements, we remain committed to our mission of nurturing excellence and building character in every child.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <ScrollReveal>
                <Link to="/academics" className="block w-full px-8 py-4 bg-[#E85D04] text-white text-lg font-bold rounded-full text-center hover:bg-[#DC4A03] transition-colors shadow-lg">
                  Our Programmes
                </Link>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                  <div className="bg-[#1a1a1a] text-white p-6">
                    <h3 className="text-2xl font-bold mb-4">Updates</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4 text-gray-700">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#E85D04] rounded-full mt-2" />
                        <span>Second Term Begins - January 12, 2026</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#E85D04] rounded-full mt-2" />
                        <span>PTA Meeting - February 15, 2026</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#E85D04] rounded-full mt-2" />
                        <span>Inter-House Sports - March 7, 2026</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#E85D04] rounded-full mt-2" />
                        <span>Mid-Term Break - February 17-21</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#E85D04] rounded-full mt-2" />
                        <span>Annual Sports Day - March 14, 2026</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Link to="/academics" className="block w-full px-8 py-4 bg-[#1a1a1a] text-white text-lg font-bold rounded-full text-center hover:bg-[#2a2a2a] transition-colors shadow-lg">
                  Academic Calendar
                </Link>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <Link to="/academics" className="block w-full px-8 py-4 border-2 border-[#E85D04] text-[#E85D04] text-lg font-bold rounded-full text-center hover:bg-[#E85D04] hover:text-white transition-colors">
                  Cambridge Programme
                </Link>
              </ScrollReveal>

              {/* Gallery Images */}
              <ScrollReveal delay={0.4}>
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80"
                    alt="School"
                    className="w-full rounded-2xl shadow-lg"
                  />
                  <img 
                    src="/generated-images/ffa9b3a9-22ad-4f05-aebf-c302436fd777/_result.png"
                    alt="Students"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Contact Section */}
      <section className="py-16 bg-white border-t-4 border-[#E85D04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <ScrollReveal>
              <div>
                <h4 className="text-xl font-bold text-[#1a1a1a] mb-4">SCHOOL HOURS</h4>
                <p className="text-gray-600 text-lg">7:30am – 3:30pm</p>
                <p className="text-gray-500 text-sm mt-2">Monday - Friday</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <h4 className="text-xl font-bold text-[#1a1a1a] mb-4">EMAIL & NUMBER</h4>
                <div className="space-y-2 text-gray-600">
                  <p><a href="mailto:info@maplegrove.edu.gh" className="hover:text-[#E85D04]">info@maplegrove.edu.gh</a></p>
                  <p>School Director – +233 24 111 2233</p>
                  <p>Headteacher – +233 24 333 4455</p>
                  <p>Admin Office – +233 24 222 3344</p>
                  <p>Admissions – +233 24 567 8901</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <h4 className="text-xl font-bold text-[#1a1a1a] mb-4">ADDRESS</h4>
                <div className="text-gray-600">
                  <p>Maple Grove International School</p>
                  <p>14 Asanteman Road, Ayigya</p>
                  <p>Kumasi, Ashanti Region</p>
                  <p>Ghana, West Africa</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div>
                <h4 className="text-xl font-bold text-[#1a1a1a] mb-4">FOLLOW US</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-[#E85D04] rounded-full flex items-center justify-center text-white hover:bg-[#DC4A03] transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#E85D04] rounded-full flex items-center justify-center text-white hover:bg-[#DC4A03] transition-colors">
                    <Youtube size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 bg-[#E85D04] rounded-full flex items-center justify-center text-white hover:bg-[#DC4A03] transition-colors">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E85D04] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MG</span>
              </div>
              <div>
                <div className="font-bold text-lg">Maple Grove</div>
                <div className="text-sm text-white/60">International School</div>
              </div>
            </div>
            <p className="text-white/50 text-sm">
              &copy; 2026 Maple Grove International School. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
