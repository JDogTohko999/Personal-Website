import React from 'react';
import { Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-portfolio-bg">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-portfolio-gold overflow-hidden shadow-2xl relative">
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
              {/* Placeholder for Profile Picture */}
              <span className="text-center p-4">Profile Picture<br/>(Add img src)</span>
              {/* To use real image: <img src="/path/to/image.jpg" alt="Me" className="w-full h-full object-cover" /> */}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center md:text-left flex-1"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Hello, I'm <span className="text-portfolio-gold">Your Name</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-400 mb-6">
            Software Engineer & Developer
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
            I build modern, reliable, and user-centric web applications. Passionate about clean code, innovative design, and solving complex problems with elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-portfolio-gold text-portfolio-bg font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center shadow-lg hover:shadow-gold/20"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              Connect on LinkedIn
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border border-portfolio-gold text-portfolio-gold font-bold rounded-lg hover:bg-portfolio-gold/10 transition-all flex items-center"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
