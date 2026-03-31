import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const cityData = [
  { name: "Wyckoff, NJ", description: "I grew up my entire life here, a suburb of NYC." },
  { name: "Charlottesville, VA", description: "Wahoowa!" },
  { name: "València", description: "I spent a semester abroad here with the two most amazing host parents, shoutout Elena and Enrique." },
  { name: "Sevilla", description: "Visited twice, very pretty and fun." },
  { name: "Madrid", description: "Visited many times, got the vibe. I prefer other Spanish cities." },
  { name: "Zahara de la Sierra", description: "2 month workaway summer '25." },
  { name: "London", description: "Visited." },
  { name: "Marrakesh", description: "Highlight of trip was playing rock paper scissors and soccer with local kids for an hour." },
  { name: "Annecy", description: "Beautiful town and awesome hiking." },
  { name: "Geneva", description: "Spent just a day here. Super cool (especially the lake), but everything was so expensive." },
  { name: "Rome", description: "Fun trip with big group." },
  { name: "Florence", description: "Didn't plan anything, wandered around with a friend. Still fun." },
  { name: "Amsterdam", description: "Had a local show us around, avoided touristy things for better or for worse." },
  { name: "Kingston", description: "Family vacations." },
  { name: "Punta Cana", description: "Family vacation." },
  { name: "Cancun", description: "Family Vacations." },
  { name: "Montreal", description: "Visit 2nd cousins." },
  { name: "East Madison, NH", description: "7 week sleepaway camp for 8 summers straight." },
  { name: "Olympic Mountain Range", description: "Month long NOLS backpacking trip." },
  { name: "Mt. Pleasant, SC", description: "Parents moved south from NJ in late 2025!" },
  { name: "Paris", description: "Befriended some of the most interesting people I've met, awesome first time solo travelling." },
  { name: "Grand Canyon, AZ", description: "Spring break 2025." },
  { name: "Zion National Park, UT", description: "Spring break 2025." },
  { name: "Sedona, AZ", description: "Spring break 2025." },
];

export default function MinimalTravel() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-8">Travels & Places</h1>
        <p className="opacity-80 mb-10 text-lg">A brief log of places I've been and things I experienced.</p>

        <ul className="space-y-6 leading-loose text-lg list-none pl-0">
          {cityData.map(city => (
            <li key={city.name}>
              <strong className="text-minimal-olive">{city.name}: </strong> 
              <span className="opacity-90">{city.description}</span>
            </li>
          ))}
        </ul>

        <hr className={`my-12 border-t ${hrClass}`} />
        <Link to="/" className="opacity-80 hover:text-minimal-gold hover:underline">Return Home</Link>
      </div>
    </div>
  );
}
