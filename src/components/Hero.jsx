import React from 'react';
import { Linkedin, Github, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0"
        >
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-portfolio-gold overflow-hidden shadow-2xl relative">
            <img
              src="/jason_chin_headshot_cropped_centered.jpg"
              alt="Jason Chin"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center md:text-left flex-1"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-portfolio-text mb-4">
            <span className="text-portfolio-gold">Jason Chin</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-portfolio-muted mb-6">
            AI Safety | Computer Engineering @ UVA '26
          </h2>
          <p className="text-lg text-portfolio-muted mb-8 leading-relaxed max-w-2xl">
            Fourth-year at UVA focused on mitigating risks from advanced AI. Excited by AI safety field building and AI policy. Co-founder and former president of the Virginia AI Security Initiative (VAISI).
          </p>
          {/* TODO (if you see this, do this): add in a "Schedule a Meeting" button that links to https://savvycal.com/jasonchin098  include a relevant icon */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <a 
              href="https://www.linkedin.com/in/jasonchin9/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-portfolio-gold text-portfolio-bg font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center shadow-lg hover:shadow-gold/20"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
            <a
              href="https://github.com/JDogTohko999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-portfolio-gold text-portfolio-gold font-bold rounded-lg hover:bg-portfolio-gold/10 transition-all flex items-center"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </a>
            <Link
              to="/blog"
              className="px-6 py-3 border border-portfolio-gold text-portfolio-gold font-bold rounded-lg hover:bg-portfolio-gold/10 transition-all flex items-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Blog
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
