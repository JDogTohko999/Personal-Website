import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Linkedin, Github, FileText } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About Me', href: '#hero' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'VAISI', href: '#vaisi' },
  ];

  const externalLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Substack', icon: FileText, href: 'https://substack.com' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-portfolio-bg/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#hero" className="text-xl font-bold text-white hover:text-portfolio-gold transition-colors">
              Portfolio
            </a>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-portfolio-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {/* Links Dropdown */}
              <div className="relative ml-4 group">
                <button 
                  className="flex items-center text-gray-300 hover:text-portfolio-gold px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                  onMouseEnter={() => setLinksOpen(true)}
                  onMouseLeave={() => setLinksOpen(false)}
                >
                  Links <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-0 w-48 bg-portfolio-card rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 transition-all duration-200 ${linksOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  onMouseEnter={() => setLinksOpen(true)}
                  onMouseLeave={() => setLinksOpen(false)}
                >
                  {externalLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-portfolio-green hover:text-white"
                    >
                      <link.icon className="w-4 h-4 mr-2 text-portfolio-gold" />
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-portfolio-bg shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-portfolio-gold block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-gray-700 pt-2 pb-2">
              <p className="px-3 text-xs text-gray-500 uppercase tracking-wider">Links</p>
              {externalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-portfolio-gold block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
