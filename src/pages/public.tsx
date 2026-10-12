import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { school, news, events, galleryAlbums, departments, admissionApplications } from '../data';
import { Menu, X, MapPin, Phone, Mail, Clock, ChevronRight, ArrowRight, Calendar, Award, BookOpen, Users, GraduationCap, Sparkles, Star } from 'lucide-react';

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
    <nav data-lenis-prevent className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E85D04] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MG</span>
            </div>
            <div className={`hidden sm:block ${isHome ? 'text-white' : 'text-gray-900'}`}>
              <div className="font-semibold text-sm leading-tight">Maple Grove</div>
              <div className="text-xs opacity-70">International School</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#E85D04] ${
                  location.pathname === link.path
                    ? 'text-[#E85D04]'
                    : isHome ? 'text-white/90 hover:text-white' : 'text-gray-700'
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
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-[#E85D04] text-white text-sm font-medium rounded-lg hover:bg-[#DC4A03] transition-colors"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg ${isHome ? 'text-white' : 'text-gray-900'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-[#E85D04]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admissions"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 mt-3 bg-[#E85D04] text-white text-sm font-medium rounded-lg text-center"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// FOOTER
// ============================================================================
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E85D04] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MG</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Maple Grove</div>
                <div className="text-xs text-gray-400">International School</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {school.motto}. Providing quality education from Early Years through JHS with a blended Ghanaian and Cambridge curriculum.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {['About', 'Academics', 'Admissions', 'Gallery', 'News'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Programmes</h4>
            <ul className="space-y-2.5">
              {['Early Years (KG 1 - KG 2)', 'Primary (P1 - P6)', 'Junior High School', 'Cambridge Enrichment Stream'].map(item => (
                <li key={item}>
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#E85D04] mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">{school.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#E85D04] shrink-0" />
                <span className="text-sm text-gray-400">{school.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#E85D04] shrink-0" />
                <span className="text-sm text-gray-400">{school.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; 2026 {school.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/parent" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Parent Portal</Link>
            <span className="text-gray-700">|</span>
            <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">School Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// HOME PAGE
// ============================================================================
function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-gray-900/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Sparkles size={14} className="text-[#E85D04]" />
              <span className="text-xs font-medium text-white/90">Now accepting applications for 2026/2027</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Where Every Child{' '}
              <span className="text-[#E85D04]">Discovers</span>{' '}
              Their Best
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
              A premium private school in Kumasi offering a blended Ghanaian and Cambridge curriculum from Early Years through Junior High School.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/admissions"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors"
              >
                Apply for Admission
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                Explore Our School
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '320+', label: 'Students' },
              { value: '18', label: 'Years of Excellence' },
              { value: '95%', label: 'BECE Pass Rate' },
              { value: '25:1', label: 'Max Class Size' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Maple Grove */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">Why Parents Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              An education that prepares children for the world ahead
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen size={24} />,
                title: 'Blended Curriculum',
                description: 'We combine the rigour of the Ghanaian national curriculum with Cambridge international standards, giving students the best of both worlds.',
              },
              {
                icon: <Users size={24} />,
                title: 'Small Class Sizes',
                description: 'With a maximum of 25 students per class, every child receives personal attention and support from dedicated teachers.',
              },
              {
                icon: <Award size={24} />,
                title: 'Proven Results',
                description: 'Our students consistently achieve outstanding BECE results, with 95% obtaining Grade 1-3 in core subjects over the past three years.',
              },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-[#E85D04]/10 rounded-xl flex items-center justify-center text-[#E85D04] mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">Our Programmes</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              From first steps to BECE success
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <div key={dept.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-2 ${i === 0 ? 'bg-[#E85D04]' : i === 1 ? 'bg-[#E85D04]/70' : 'bg-[#E85D04]/40'}`} />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {i === 0 ? <Star size={20} className="text-[#E85D04]" /> : i === 1 ? <BookOpen size={20} className="text-[#E85D04]" /> : <GraduationCap size={20} className="text-[#E85D04]" />}
                    <h3 className="text-xl font-semibold text-gray-900">{dept.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {dept.levels.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {i === 0 && 'A nurturing environment where young learners develop foundational skills through play-based and structured learning.'}
                    {i === 1 && 'Building strong academic foundations in literacy, numeracy, science and the arts with character development.'}
                    {i === 2 && 'Rigorous academic preparation for BECE with Cambridge enrichment opportunities for high-achieving students.'}
                  </p>
                  <Link to="/academics" className="inline-flex items-center gap-1 text-sm font-medium text-[#E85D04] mt-4 hover:gap-2 transition-all">
                    Learn more <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Life Preview */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">School Life</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-6">
                More than academics. A complete education.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Maple Grove, we believe education extends beyond the classroom. Our students participate in sports, cultural activities, community service, and creative arts that develop well-rounded individuals.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Inter-house Sports', 'Debate Club', 'Cultural Dance', 'Science Club', 'Music & Arts', 'Community Service'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#E85D04] rounded-full" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/gallery" className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                View Gallery <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80')" }} />
                <div className="rounded-2xl overflow-hidden h-32 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80')" }} />
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden h-32 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80')" }} />
                <div className="rounded-2xl overflow-hidden h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80')" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">Latest Updates</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">News & Events</h2>
            </div>
            <Link to="/news" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#E85D04] hover:gap-2 transition-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.slice(0, 3).map(item => (
              <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Calendar size={32} className="text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-[#E85D04] bg-orange-50 px-2 py-1 rounded">{item.category}</span>
                    <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-[#E85D04] font-medium text-sm uppercase tracking-wide">What's Coming Up</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Upcoming Events</h2>
          </div>
          <div className="space-y-4">
            {events.slice(0, 4).map(event => (
              <div key={event.id} className="flex items-center gap-6 p-5 bg-gray-50 rounded-xl hover:bg-orange-50/50 transition-colors">
                <div className="w-14 h-14 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm shrink-0">
                  <span className="text-xs font-medium text-[#E85D04] uppercase">
                    {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{event.time}{event.location ? ` • ${event.location}` : ''}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to give your child the best start?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto">
            Join the Maple Grove family. Applications are now open for the 2026/2027 academic year.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors">
              Start Application <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20">
              Book a School Visit
            </Link>
          </div>
        </div>
      </section>
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
