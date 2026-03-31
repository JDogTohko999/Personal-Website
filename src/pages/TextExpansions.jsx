import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TextExpansions() {
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

  const bgClass = isDarkMode ? 'bg-[#18181b]' : 'bg-[#fffdfa]';
  const textClass = isDarkMode ? 'text-[#e5e5e5]' : 'text-minimal-dark-grey';
  const linkClass = 'text-minimal-brown dark:text-minimal-tan hover:text-minimal-gold hover:underline transition-colors';
  const hrClass = isDarkMode ? 'border-minimal-olive opacity-30' : 'border-minimal-tan opacity-60';

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-serif pb-20 ${bgClass} ${textClass} fixed inset-0 overflow-auto`}>
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

        <h1 className="text-3xl font-bold tracking-tight mb-4">Seriously, use text expansions</h1>
        <p className="opacity-70 mb-10 text-sm">March 31, 2026</p>

        <div className="space-y-6 leading-loose text-lg">
          <p>
            You probably write the same strings of text over and over again every day. Email addresses, common code snippets, introductory greetings, and zoom links.
          </p>
          <p>
            It sounds like a small thing, taking only seconds each time. But when you add up the friction and the cognitive context-switching of typing out <i>"Hope you're having a great week so far"</i> for the tenth time today, it's a massive drain on your energy.
          </p>
          <p>
            A <strong>text expander</strong> sits quietly in your operating system. When you type a short trigger string—like <code className={`px-2 py-1 rounded ${isDarkMode ? 'bg-black' : 'bg-[#eae8e4]'}`}>;em</code>—it instantly replaces it with your full email address. Type <code className={`px-2 py-1 rounded ${isDarkMode ? 'bg-black' : 'bg-[#eae8e4]'}`}>;zoom</code> and boom, there's your personal meeting room link.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4 text-minimal-olive">The setup</h2>
          <p>
            I recommend using a tool like <a href="https://espanso.org/" target="_blank" rel="noreferrer" className={linkClass}>Espanso</a> (open source, works everywhere) or MacOS's built-in text shortcuts if you are exclusively in the Apple ecosystem.
          </p>
          <p>
            Start small. Add just 5 snippets you use daily. Over time, build out a library. It is one of the highest ROI 10-minute investments you can make for your digital hygiene.
          </p>
        </div>

        <hr className={`my-12 border-t ${hrClass}`} />

        <div className="opacity-80 flex flex-col sm:flex-row justify-between gap-4">
          <Link to="/" className="hover:text-minimal-gold hover:underline">Return Home</Link>
        </div>
      </div>
    </div>
  );
}
