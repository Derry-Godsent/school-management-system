import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
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

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E85D04]/5 to-[#DC4A03]/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E85D04]/10 rounded-full mb-6">
                <div className="w-2 h-2 bg-[#E85D04] rounded-full animate-pulse" />
                <span className="text-xs font-medium text-[#E85D04]">Now Enrolling 2026/2027</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Where Every Child{' '}
                <span className="gradient-text">Discovers</span>{' '}
                Their Best
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A premium private school in Kumasi offering a blended Ghanaian and Cambridge curriculum from Early Years through Junior High School.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admissions" className="px-6 py-3 bg-[#E85D04] text-white font-medium rounded-lg hover:bg-[#DC4A03] transition-colors shadow-lg shadow-orange-500/20">
                  Apply Now
                </Link>
                <Link to="/about" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#E85D04]/20 to-[#DC4A03]/20 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80" 
                  alt="Students learning" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
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
