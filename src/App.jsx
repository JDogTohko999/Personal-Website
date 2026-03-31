import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MinimalHome from './pages/MinimalHome';
import TextExpansions from './pages/TextExpansions';
import OldWebsiteWrapper from './pages/OldWebsiteWrapper';

import MinimalExperience from './pages/MinimalExperience';
import MinimalProjects from './pages/MinimalProjects';
import MinimalAchievements from './pages/MinimalAchievements';
import MinimalTravel from './pages/MinimalTravel';
import MinimalBlogList from './pages/MinimalBlogList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MinimalHome />} />
        <Route path="/blog" element={<MinimalBlogList />} />
        <Route path="/blog/text-expansions" element={<TextExpansions />} />
        
        <Route path="/experience" element={<MinimalExperience />} />
        <Route path="/projects" element={<MinimalProjects />} />
        <Route path="/achievements" element={<MinimalAchievements />} />
        <Route path="/travel" element={<MinimalTravel />} />
        
        <Route path="/old" element={<OldWebsiteWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
