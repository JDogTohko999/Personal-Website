import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Linkedin, Github, FileText, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
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
    { name: 'About Me', href: '#about-me' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'VAISI', href: '#vaisi' },
  ];

  const externalLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/jasonchin9/' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/JDogTohko999' },
    { name: 'Substack', icon: FileText, href: 'https://substack.com/@jdogtohko999' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-portfolio-bg/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#about-me" className="text-xl font-bold text-portfolio-text hover:text-portfolio-gold transition-colors">
              Portfolio
            </a>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-portfolio-muted hover:text-portfolio-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {/* Links Dropdown */}
              <div className="relative ml-4 group">
                <button 
                  className="flex items-center text-portfolio-muted hover:text-portfolio-gold px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
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
                      className="flex items-center px-4 py-2 text-sm text-portfolio-muted hover:bg-portfolio-green hover:text-white"
                    >
                      <link.icon className="w-4 h-4 mr-2 text-portfolio-gold" />
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>


              {/* Theme Dropdown */}
              <div className="relative ml-4 group">
                <button 
                  className="flex items-center text-portfolio-muted hover:text-portfolio-gold px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                  onMouseEnter={() => setThemeOpen(true)}
                  onMouseLeave={() => setThemeOpen(false)}
                >
                  <Palette className="w-4 h-4 mr-1" />
                  <ChevronDown className="ml-0.5 w-3 h-3" />
                </button>
                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-0 w-40 bg-portfolio-card rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 transition-all duration-200 ${themeOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  onMouseEnter={() => setThemeOpen(true)}
                  onMouseLeave={() => setThemeOpen(false)}
                >
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`block w-full text-left px-4 py-2 text-sm text-portfolio-muted hover:bg-portfolio-green hover:text-white ${theme === t.id ? 'text-portfolio-gold font-bold' : ''}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-portfolio-muted hover:text-portfolio-text hover:bg-portfolio-card focus:outline-none"
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
                className="text-portfolio-muted hover:text-portfolio-gold block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-portfolio-border pt-2 pb-2">
              <p className="px-3 text-xs text-portfolio-muted uppercase tracking-wider">Links</p>
              {externalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-portfolio-muted hover:text-portfolio-gold block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.name}
                </a>
              ))}
            </div>
            {/* Mobile Theme Switcher */}
            <div className="border-t border-portfolio-border pt-2 pb-2">
               <p className="px-3 text-xs text-portfolio-muted uppercase tracking-wider">Theme</p>
               {themes.map((t) => (
                 <button
                   key={t.id}
                   onClick={() => {
                     setTheme(t.id);
                     setIsOpen(false);
                   }}
                   className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-portfolio-muted hover:text-portfolio-gold ${theme === t.id ? 'text-portfolio-gold' : ''}`}
                 >
                   <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2 border border-portfolio-border" style={{backgroundColor: t.color}}></span>
                    {t.name}
                   </span>
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
