import React from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Dashboard',
    description: 'A comprehensive analytics dashboard for online retailers featuring real-time data visualization.',
    tags: ['React', 'D3.js', 'Firebase'],
    github: '#',
    demo: '#'
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Productivity tool allowing teams to collaborate on tasks with live updates and file sharing.',
    tags: ['Next.js', 'Tailwind', 'Supabase'],
    github: '#',
    demo: '#'
  },
  {
    id: 3,
    title: 'Weather Forecast AI',
    description: 'Machine learning model that predicts micro-climate changes using local sensor data.',
    tags: ['Python', 'TensorFlow', 'React'],
    github: '#',
    demo: '#'
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-portfolio-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Projects & Activities</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full"></div>
        </motion.div>

        {/* VAISI Spotlight */}
        <motion.div 
          id="vaisi"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 bg-gradient-to-r from-portfolio-green to-portfolio-bg border border-portfolio-gold/30 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-portfolio-gold/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 md:flex items-center justify-between gap-8">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-portfolio-gold/20 text-portfolio-gold rounded-full text-xs font-bold tracking-wider mb-4">FEATURED CLUB</div>
              <h3 className="text-3xl font-bold text-white mb-4">VAISI</h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                As a key member/leader of VAISI (The Virginia Artificial Intelligence Software Initiative), I collaborate with peers to explore cutting-edge AI technologies, organize workshops, and build innovative software solutions for the university community.
              </p>
              <a href="#" className="inline-flex items-center text-portfolio-gold hover:text-white font-bold transition-colors group">
                Learn more about VAISI 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            {/* Visual element for VAISI (Logo placeholder) */}
            <div className="mt-8 md:mt-0 flex-shrink-0">
               <div className="w-32 h-32 bg-portfolio-card rounded-full flex items-center justify-center border-2 border-portfolio-gold/50 shadow-lg mx-auto">
                 <span className="text-2xl font-bold text-white">VAISI</span>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-portfolio-card border border-gray-800 rounded-xl overflow-hidden hover:border-portfolio-gold/30 hover:shadow-xl transition-all group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-portfolio-gold transition-colors">{project.title}</h3>
                  <div className="flex gap-3">
                    <a href={project.github} className="text-gray-400 hover:text-white transition-colors" title="View Code">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={project.demo} className="text-gray-400 hover:text-white transition-colors" title="Live Demo">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-portfolio-gold bg-portfolio-gold/10 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
