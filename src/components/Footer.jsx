import React from 'react';
import { Linkedin, Github, FileText, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-portfolio-bg py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-portfolio-gold transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-portfolio-gold transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://substack.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-portfolio-gold transition-colors">
              <FileText className="w-5 h-5" />
            </a>
            <a href="mailto:email@example.com" className="text-gray-400 hover:text-portfolio-gold transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
