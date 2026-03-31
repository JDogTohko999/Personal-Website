import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const experiences = [
  {
    id: 1,
    role: 'Co-founder and President',
    company: 'Virginia AI Security Initiative (VAISI)',
    period: 'Aug 2025 - Present',
    description: 'Creating an environment that enables the UVA community to engage with and take action on AI risks. Focused on team management, effective recruitment, event coordination, and creating + leading the VAISI\'s AI Governance Fellowship.'
  },
  {
    id: 2,
    role: 'Pathfinder Fellow',
    company: 'Kairos',
    period: 'Aug 2025 - Dec 2025',
    description: 'Received mentorship, community, and funding crucial for establishing VAISI.'
  },
  {
    id: 3,
    role: 'Intensive AGI Strategy Course',
    company: 'BlueDot Impact',
    period: 'Jan 2025',
    description: 'Learned about trends, risks, stakeholders, and proposed frameworks for steering AI towards beneficial outcomes. Still working on final project',
    link: 'https://bluedot.org/courses/agi-strategy'
  },
  {
    id: 4,
    role: 'IT Summer Intern (Systems Engineering)',
    company: 'UPS',
    period: 'Jun 2024 - Aug 2024',
    description: 'Identified bottlenecks and coded a PowerShell script to automate system setup, reducing process time from 2-3hrs to seconds. Estimated anual savings ~$4,000. Won 3rd place in Google Cloud Vision AI Hackathon category.'
  },
  {
    id: 5,
    role: 'Undergraduate Research Assistant',
    company: 'UVA Engineering Link Lab',
    period: 'Sep 2023 - Sep 2024',
    description: 'Co-authored research paper for UbiComp/ISWC 2024. Spearheaded research on musical chords and emotionality, conducting qualitative and quantitative user studies.'
  },
  {
    id: 6,
    role: 'IT Summer Intern (Global Networking)',
    company: 'UPS',
    period: 'Jun 2023 - Aug 2023',
    description: 'Worked with SD-WAN, SNMP, and telemetry. Led front-end development for a team that placed top 10% in the UPS 2023 Hackathon.'
  },
  {
    id: 7,
    role: 'Founder + Operator',
    company: "JC's PCs",
    period: 'Aug 2019 - Aug 2022',
    description: 'Launched custom PC business ($6k revenue). Mentored peers in PC building and hardware troubleshooting.'
  }
];

export default function MinimalExperience() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-8">Experience</h1>

        <div className="space-y-10 leading-loose text-lg">
          {experiences.map(exp => (
            <div key={exp.id}>
              <h2 className="text-xl font-semibold text-minimal-olive">{exp.role}</h2>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                <span className="font-medium">
                  {exp.link ? <a href={exp.link} target="_blank" rel="noreferrer" className={linkClass}>{exp.company} <span className="text-xs opacity-50">→</span></a> : exp.company}
                </span>
                <span className="text-sm opacity-70 italic">{exp.period}</span>
              </div>
              <p className="opacity-90">{exp.description}</p>
            </div>
          ))}
        </div>

        <hr className={`my-12 border-t ${hrClass}`} />
        <Link to="/" className="opacity-80 hover:text-minimal-gold hover:underline">Return Home</Link>
      </div>
    </div>
  );
}
