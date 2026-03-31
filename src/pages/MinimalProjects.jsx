import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    title: 'PRAGUVA',
    subtitle: 'UVA Capstone Project',
    date: 'Fall 2025',
    description: 'Built a Graph RAG interface for UVA\'s academic knowledge graph. Uses Neo4j with vector-indexed semantic search and GraphSAGE embeddings to enable intelligent querying of interconnected academic data.',
    tags: ['Python', 'Neo4j', 'Graph RAG'],
    link: 'https://github.com/jongh0327/PRAGUVA'
  },
  {
    id: 2,
    title: 'Cournot Oligopoly Simulation',
    subtitle: 'UVA CS4710 Course Project',
    date: 'Spring 2025',
    description: 'CS4710 team project modeling oligopolistic market competition. Implemented Cournot and Bertrand competition models to simulate firm pricing strategies, market entry effects, and multi-firm dynamics including affordable housing markets.',
    tags: ['Python', 'Game Theory', 'Simulation'],
    link: 'https://github.com/TerryWangUVA/CS4710CournotOlio'
  },
  {
    id: 3,
    title: 'Chord Emotionality Research',
    subtitle: 'UVA Link Lab Research',
    date: 'Fall 2023 - Spring 2024',
    description: 'Co-authored paper for UbiComp/ISWC 2024. Conducted two user studies exploring how emotions can be encoded into chord progressions for musical wellness feedback, finding that happier progressions use resolved triads in major keys and that musical background shapes perception.',
    tags: ['Research', 'Data Analysis', 'User Studies'],
    link: 'https://doi.org/10.1145/3675094.3678495'
  },
  {
    id: 4,
    title: 'UPS Automation Script',
    subtitle: 'UPS Internship',
    date: 'Summer 2024',
    description: 'Developed a robust PowerShell script to automate system setup, reducing process time from 2-3 hours to under a minute with zero errors. Estimated annual savings ~$4,000.',
    tags: ['PowerShell', 'Automation', 'Scripting'],
    link: 'https://github.com/JDogTohko999/UPS-Intern-Project'
  },
  {
    id: 5,
    title: 'Find it First',
    subtitle: '2024 UPS Hackathon',
    date: 'Summer 2024',
    description: 'Won 3rd place in Google Category. Leveraged Google Cloud Vision AI to detect and label objects in photos to assist with lost package identification.',
    tags: ['Google Cloud Vision API', 'Python', 'AI/ML'],
    link: 'https://docs.google.com/presentation/d/1B4e4lXVk_xeD_Bh8yV1T4_AAQkpW6Fb0BGRye_a035k/edit?usp=sharing'
  },
  {
    id: 6,
    title: 'UPASK Forum',
    subtitle: 'UPS Hackathon',
    date: 'Summer 2023',
    description: 'Built a full-stack technology help forum during the 2023 UPS Hackathon (Top 10%). Led front-end development connecting to MySQL via PHP.',
    tags: ['HTML/CSS/JS', 'PHP', 'MySQL'],
    link: 'https://github.com/JDogTohko999/UPASK',
  }
];

export default function MinimalProjects() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('minimal-theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('minimal-theme', !isDarkMode ? 'dark' : 'light');
  };

  const bgClass = isDarkMode ? 'bg-[#18181b]' : 'bg-[#fffdfa]';
  const textClass = isDarkMode ? 'text-[#e5e5e5]' : 'text-minimal-dark-grey';
  const linkClass = 'text-minimal-brown dark:text-minimal-tan hover:text-minimal-gold hover:underline transition-colors';
  const hrClass = isDarkMode ? 'border-minimal-olive opacity-30' : 'border-minimal-tan opacity-60';

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-serif pb-20 ${bgClass} ${textClass} fixed inset-0 overflow-auto ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="text-xl font-bold tracking-tight hover:text-minimal-gold transition-colors">← Back</Link>
          <button 
            onClick={toggleTheme}
            className="text-sm px-3 py-1 rounded-full border border-current hover:bg-minimal-dark-grey hover:text-white dark:hover:bg-gray-200 dark:hover:text-black transition-colors"
          >
            {isDarkMode ? 'Day Mode' : 'Night Mode'}
          </button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Projects</h1>

        <div className="space-y-10 leading-loose text-lg">
          {projects.map(proj => (
            <div key={proj.id}>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <h2 className="text-xl font-semibold text-minimal-olive">
                  {proj.link ? <a href={proj.link} target="_blank" rel="noreferrer" className={linkClass}>{proj.title} <span className="text-xs opacity-50">→</span></a> : proj.title}
                </h2>
                <span className="text-sm opacity-70 italic">{proj.subtitle} ({proj.date})</span>
              </div>
              <p className="opacity-90">{proj.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {proj.tags.map(tag => (
                  <span key={tag} className="text-sm border opacity-80 px-2 py-0.5 rounded border-minimal-tan dark:border-minimal-olive">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr className={`my-12 border-t ${hrClass}`} />
        <Link to="/" className="opacity-80 hover:text-minimal-gold hover:underline">Return Home</Link>
      </div>
    </div>
  );
}
