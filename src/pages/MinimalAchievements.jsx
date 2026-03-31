import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const featuredAchievement = {
  id: 3,
  title: 'Finalist — Martin Skeptical Debate',
  organization: 'Jefferson Society at UVA',
  date: 'Nov 2025 – Feb 2026',
  description: 'Lost in the finals of UVA\'s inaugural Martin Skeptical Debate series. \nResolution: "Artificial intelligence will significantly increase biological risk in the next five years."\n\nThis was my first time ever debating, and wow, what an eye opening experience. Makes me wish I\'d started sooner! Also, such a great excuse to research a topic I\'m passionate about. Huge shoutout to my friends that came to watch and to Lisa for carrying me.',
  links: [
    { label: 'UVA News', href: 'https://news.virginia.edu/content/jefferson-society-crowns-winners-first-martin-skeptical-debate' },
    { label: 'About the Series', href: 'https://news.virginia.edu/content/late-professors-legacy-spawns-new-scientific-debate-series-4000-prize' }
  ]
};

const achievements = [
  {
    id: 1,
    title: 'Eagle Scout',
    organization: 'Boy Scouts of America',
    description: 'Achieved by 4% of scouts. Conceived and executed a project restoring and archiving local historic headstones. Led volunteers to complete 162 hours of service.'
  },
  {
    id: 2,
    title: 'Dean\'s List',
    organization: 'UVA Engineering',
    description: 'Achieved all 7 semesters'
  },
  {
    id: 4,
    title: '3rd - Google Vision AI',
    organization: 'UPS Hackathon 2024',
    description: 'Competed against 53 teams. Leveraged Cloud Vision AI for package detection.'
  },
  {
    id: 5,
    title: 'Top 5 Overall',
    organization: 'UPS Hackathon 2023',
    description: 'Conceptualized and developed UPASK, an interactive help forum. Presented to senior management.'
  }
];

export default function MinimalAchievements() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-8">Achievements</h1>

        <div className="space-y-10 leading-loose text-lg">
          <div>
            <h2 className="text-xl font-semibold text-minimal-olive">{featuredAchievement.title}</h2>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium opacity-80">{featuredAchievement.organization}</span>
              <span className="text-sm opacity-70 italic">{featuredAchievement.date}</span>
            </div>
            <p className="opacity-90 whitespace-pre-line mb-4">{featuredAchievement.description}</p>
            <div className="flex flex-wrap gap-4">
              {featuredAchievement.links.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {link.label} <span className="text-xs opacity-50">→</span>
                </a>
              ))}
            </div>
          </div>

          <hr className={`my-8 border-t ${hrClass}`} />

          {achievements.map(ach => (
            <div key={ach.id}>
              <h2 className="text-lg font-semibold text-minimal-olive">{ach.title}</h2>
              <p className="font-medium opacity-80 mb-1">{ach.organization}</p>
              <p className="opacity-90 text-sm md:text-base">{ach.description}</p>
            </div>
          ))}
        </div>

        <hr className={`my-12 border-t ${hrClass}`} />
        <Link to="/" className="opacity-80 hover:text-minimal-gold hover:underline">Return Home</Link>
      </div>
    </div>
  );
}
