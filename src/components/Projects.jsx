import React from 'react';
import { Github, ArrowRight, ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'PRAGUVA',
    subtitle: 'UVA Capstone Project',
    date: 'Fall 2025',
    description: 'Built a Graph RAG interface for UVA\'s academic knowledge graph. Uses Neo4j with vector-indexed semantic search and GraphSAGE embeddings to enable intelligent querying of interconnected academic data.',
    tags: ['Python', 'Neo4j', 'Graph RAG'],
    github: 'https://github.com/jongh0327/PRAGUVA'
  },
  {
    id: 2,
    title: 'Cournot Oligopoly Simulation',
    subtitle: 'UVA CS4710 Course Project',
    date: 'Spring 2025',
    description: 'CS4710 team project modeling oligopolistic market competition. Implemented Cournot and Bertrand competition models to simulate firm pricing strategies, market entry effects, and multi-firm dynamics including affordable housing markets.',
    tags: ['Python', 'Game Theory', 'Simulation'],
    github: 'https://github.com/TerryWangUVA/CS4710CournotOlio'
  },
  {
    id: 3,
    title: 'Chord Emotionality Research',
    subtitle: 'UVA Link Lab Research',
    date: 'Fall 2023 - Spring 2024',
    description: 'Co-authored paper for UbiComp/ISWC 2024. Conducted two user studies exploring how emotions can be encoded into chord progressions for musical wellness feedback, finding that happier progressions use resolved triads in major keys and that musical background shapes perception.',
    tags: ['Research', 'Data Analysis', 'User Studies'],
    paper: 'https://doi.org/10.1145/3675094.3678495'
  },
  {
    id: 4,
    title: 'UPS Automation Script',
    subtitle: 'UPS Internship',
    date: 'Summer 2024',
    description: 'Developed a robust PowerShell script to automate system setup, reducing process time from 2-3 hours to under a minute with zero errors. Estimated annual savings ~$4,000.',
    tags: ['PowerShell', 'Automation', 'Scripting'],
    github: 'https://github.com/JDogTohko999/UPS-Intern-Project'
  },
  {
    id: 5,
    title: 'Find it First',
    subtitle: '2024 UPS Hackathon',
    date: 'Summer 2024',
    description: 'Won 3rd place in Google Category. Leveraged Google Cloud Vision AI to detect and label objects in photos to assist with lost package identification.',
    tags: ['Google Cloud Vision API', 'Python', 'AI/ML'],
    paper: 'https://docs.google.com/presentation/d/1B4e4lXVk_xeD_Bh8yV1T4_AAQkpW6Fb0BGRye_a035k/edit?usp=sharing'
  },
  {
    id: 6,
    title: 'UPASK Forum',
    subtitle: 'UPS Hackathon',
    date: 'Summer 2023',
    description: 'Built a full-stack technology help forum during the 2023 UPS Hackathon (Top 10%). Led front-end development connecting to MySQL via PHP.',
    tags: ['HTML/CSS/JS', 'PHP', 'MySQL'],
    github: 'https://github.com/JDogTohko999/UPASK',
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
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-text mb-4">Projects</h2>
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
              <h3 className="text-3xl font-bold text-portfolio-text mb-4">VAISI</h3>
              <p className="text-portfolio-muted text-lg mb-6 leading-relaxed">
                As the co-founder and president, my mission is to get VAISI off the ground and attain critical mass in terms of membership, operational capacity, and legitimacy.
              </p>
              <a href="https://vaisi.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-portfolio-gold hover:text-portfolio-text font-bold transition-colors group">
                Learn more about VAISI 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            {/* Visual element for VAISI (Logo placeholder) */}
            <div className="mt-8 md:mt-0 flex-shrink-0">
                 <div className="w-32 h-32 bg-portfolio-card rounded-full flex items-center justify-center border-2 border-portfolio-gold/50 shadow-lg mx-auto">
                   <span className="text-2xl font-bold text-portfolio-card-text">VAISI</span>
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
              className="bg-portfolio-card border border-portfolio-border rounded-xl overflow-hidden hover:border-portfolio-gold/30 hover:shadow-xl transition-all group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-portfolio-card-text group-hover:text-portfolio-gold transition-colors">{project.title}</h3>
                    {project.subtitle && <p className="text-xs text-portfolio-gold/70 mt-1">{project.subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {project.date && <span className="text-xs text-portfolio-muted">{project.date}</span>}
                    {project.github && (
                      <a href={project.github} className="text-portfolio-muted hover:text-portfolio-text transition-colors" title="View Code">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.paper && (
                      <a href={project.paper} target="_blank" rel="noopener noreferrer" className="text-portfolio-muted hover:text-portfolio-text transition-colors" title="View Paper">
                        <ScrollText className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-portfolio-muted mb-6 text-sm leading-relaxed">
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
