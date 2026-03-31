import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MinimalHome() {
  // Check local storage or system preference, default to light mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('minimal-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('minimal-theme', !isDarkMode ? 'dark' : 'light');
  };

  const bgClass = isDarkMode ? 'bg-[#18181b]' : 'bg-[#fffdfa]'; // Very slightly off-white light, matte dark
  const textClass = isDarkMode ? 'text-[#e5e5e5]' : 'text-minimal-dark-grey';
  const linkClass = 'hover:text-minimal-gold hover:underline transition-colors';
  const hrClass = isDarkMode ? 'border-minimal-olive opacity-30' : 'border-minimal-tan opacity-60';
  
  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-serif pb-20 ${bgClass} ${textClass} fixed inset-0 overflow-auto`}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header / Theme Toggle */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Jason Chin</h1>
          <button 
            onClick={toggleTheme}
            className="text-sm px-3 py-1 rounded-full border border-current hover:bg-minimal-dark-grey hover:text-white dark:hover:bg-gray-200 dark:hover:text-black transition-colors"
          >
            {isDarkMode ? 'Day Mode' : 'Night Mode'}
          </button>
        </div>

        <p className="mb-6 leading-relaxed text-lg">
          jason_chin [at] uva [dot] edu
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/blog" className={linkClass}>Blog</Link>
          <a href="https://substack.com/@jdogtohko999" target="_blank" rel="noreferrer" className={linkClass}>Substack</a>
          <a href="https://github.com/JDogTohko999" target="_blank" rel="noreferrer" className={linkClass}>GitHub</a>
          <a href="https://www.linkedin.com/in/jasonchin9/" target="_blank" rel="noreferrer" className={linkClass}>LinkedIn</a>
        </div>

        <p className="mb-8 leading-relaxed text-lg">
          Hi, I'm Jason. I'm a 4th year computer engineer pursuing the AI Focal Path at UVA. I focus on advancing robust AI while mitigating risks. I'm actively exploring technical alignment and smart governance to ensure AI systems are reliable, secure, and broadly beneficial. I also lead the Virginia AI Security Initiative (VAISI).
        </p>

        <hr className={`my-8 border-t ${hrClass}`} />

        <h2 className="text-xl font-semibold mb-4 mt-8">Now</h2>
        <ul className="list-disc list-inside space-y-2 mb-8 leading-relaxed">
          <li>President of <a href="https://vaisi.org" target="_blank" rel="noreferrer" className={`text-minimal-brown hover:text-minimal-green hover:underline transition-colors dark:text-minimal-tan`}>Virginia AI Security Initiative</a> at UVA.</li>
          <li>Helping found a club focused on accelerating pandemic prevention and readiness.</li>
          <li>Figuring out post grad plans.</li>
        </ul>

        <hr className={`my-8 border-t ${hrClass}`} />

        <h2 className="text-xl font-semibold mb-4 mt-8">Past</h2>
        <ul className="list-disc list-inside space-y-2 mb-8 leading-relaxed">
          <li><Link to="/experience" className={linkClass}>Experience <span className="text-xs opacity-50">→</span></Link></li>
          <li><Link to="/projects" className={linkClass}>Projects <span className="text-xs opacity-50">→</span></Link></li>
          <li><Link to="/achievements" className={linkClass}>Achievements <span className="text-xs opacity-50">→</span></Link></li>
          <li><Link to="/travel" className={linkClass}>Travel <span className="text-xs opacity-50">→</span></Link></li>
        </ul>

        <hr className={`my-8 border-t ${hrClass}`} />

        <div className="mt-12 text-sm opacity-80 flex flex-col sm:flex-row justify-between gap-4">
          <span>Looking for the interactive version? <Link to="/old" className="underline hover:text-minimal-gold">Return to the original themed site</Link>.</span>
        </div>
      </div>
    </div>
  );
}
