import React from 'react';

export const url = 'https://www.vaisi.org/';
export const logo = '/vaisi/new_vaisi_logo.jpg';
export const name = 'Virginia AI Security Initiative';
export const role = 'Co-founder & President';
export const period = "Aug '25 - May '26";
// Saved screenshot of the live site (used as a backdrop while an iframe loads).
export const homepageScreenshot = '/vaisi/vaisi_homepage.jpg';

export const imageSets = {
  panel: {
    altText: 'Moderated Panel with Prof. Korinek, Danks, and Evans',
    label: (
      <>
        Moderated Panel with Prof.{' '}
        <a href="https://www.korinek.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Korinek</a>,{' '}
        <a href="https://www.daviddanks.org/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Danks</a>, and{' '}
        <a href="https://www.cs.virginia.edu/~evans/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Evans</a>
      </>
    ),
    cover: '/vaisi/panel_audience.JPG',
    images: [
      '/vaisi/panel_audience.JPG',
      '/vaisi/panel_chat.JPG',
      '/vaisi/panel_further_right.JPG',
      '/vaisi/panel_right.JPG',
    ],
  },
  fellowship: {
    altText: 'AI Governance Fellowship',
    label: 'AI Governance Fellowship',
    cover: '/vaisi/fellows_on_steps.JPG',
    images: [
      '/vaisi/fellows_on_steps.JPG',
      '/vaisi/fellows_standing.JPG',
    ],
  },
};

export const story = {
  heading: 'VAISI lives on!',
  paragraphs: [
    <>
      Through some combination of luck and skill, I managed to find{' '}
      <a href="https://www.sethlifland.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Seth</a>,{' '}
      <a href="https://www.linkedin.com/in/nia-m-a50406379/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Nia</a>,{' '}
      <a href="https://shubhrangshu.com/" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">Shubs</a>,{' '}
      and a{' '}
      <a href="https://vaisi.org/about" target="_blank" rel="noopener noreferrer" className="text-portfolio-gold hover:underline">handful</a>{' '}
      of incredible students who are now organizing VAISI.
    </>,
    <>I intend to be an active advisor for the foreseeable future.</>,
  ],
};

export const textImage = {
  src: '/vaisi/vaisi_jason_andrew_text.jpg',
  label: 'The text that started it all',
  alt: 'The text message that started VAISI',
};
