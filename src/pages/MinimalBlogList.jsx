import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const blogs = [
  {
    id: 1,
    title: 'Text Expansions',
    path: '/blog/text-expansions',
    date: 'March 31, 2026',
    summary: 'A brief guide on why you should definitely be using text expansions to save yourself incredible amounts of time and friction on small repetitive tasks.'
  }
];

export default function MinimalBlogList() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-8">Blog</h1>

        <div className="space-y-10 leading-loose text-lg">
          {blogs.map(blog => (
            <div key={blog.id}>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <Link to={blog.path} className={`text-xl font-semibold ${linkClass}`}>
                  {blog.title} <span className="text-xs opacity-50">→</span>
                </Link>
                <span className="text-sm opacity-70 italic">{blog.date}</span>
              </div>
              <p className="opacity-90">{blog.summary}</p>
            </div>
          ))}
        </div>

        <hr className={`my-12 border-t ${hrClass}`} />
        <Link to="/" className="opacity-80 hover:text-minimal-gold hover:underline">Return Home</Link>
      </div>
    </div>
  );
}
