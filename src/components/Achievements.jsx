import { useState } from 'react';
import { Award, Medal, Trophy, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const featuredAchievement = {
  id: 3,
  title: 'Finalist — Martin Skeptical Debate',
  organization: 'Jefferson Society at UVA',
  date: 'Nov 2025 – Feb 2026',
  description: 'Lost in the finals of UVA\'s inaugural Martin Skeptical Debate series. \nResolution: "Artificial intelligence will significantly increase biological risk in the next five years."\n\nThis was my first time ever debating, and wow, what an eye opening experience. Makes me wish I\'d started sooner! Also, such a great excuse to research a topic I\'m passionate about. Huge shoutout to my friends that came to watch and to Lisa for carrying me.',
  links: [
    { label: 'UVA News', href: 'https://news.virginia.edu/content/jefferson-society-crowns-winners-first-martin-skeptical-debate' },
    { label: 'About the Series', href: 'https://news.virginia.edu/content/late-professors-legacy-spawns-new-scientific-debate-series-4000-prize' }
  ],
  photos: [
    '/martin_skeptical_debate_first_round.jpg',
    '/Martin_Skeptical_Debate_Inline-02-NA-Debate-RG.jpg',
    '/J_Mrtn_skpt_debate_finals.jpg',
  ],
  icon: Trophy
};

const achievements = [
  {
    id: 1,
    title: 'Eagle Scout',
    organization: 'Boy Scouts of America',
    description: 'Achieved by 4% of scouts. Conceived and executed a project restoring and archiving local historic headstones. Led volunteers to complete 162 hours of service.',
    icon: Medal
  },
  {
    id: 2,
    title: 'Dean\'s List',
    organization: 'UVA Engineering',
    description: 'Achieved all 7 semesters',
    icon: Star
  },
  {
    id: 4,
    title: '3rd - Google Vision AI',
    organization: 'UPS Hackathon 2024',
    description: 'Competed against 53 teams. Leveraged Cloud Vision AI for package detection.',
    icon: Trophy
  },
  {
    id: 5,
    title: 'Top 5 Overall',
    organization: 'UPS Hackathon 2023',
    description: 'Conceptualized and developed UPASK, an interactive help forum. Presented to senior management.',
    icon: Award
  }
];

const PhotoModal = ({ photos, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const prev = (e) => { e.stopPropagation(); setIndex((i) => (i - 1 + photos.length) % photos.length); };
  const next = (e) => { e.stopPropagation(); setIndex((i) => (i + 1) % photos.length); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          <img
            src={photos[index]}
            alt={`Photo ${index + 1}`}
            className="w-full max-h-[75vh] object-contain rounded-xl"
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-portfolio-gold' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Achievements = () => {
  const [modalState, setModalState] = useState(null); // { photos, startIndex }

  const openPhoto = (photos, startIndex) => setModalState({ photos, startIndex });

  return (
    <section id="achievements" className="py-20 bg-portfolio-bg border-t border-portfolio-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-text mb-4">Achievements</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full"></div>
        </motion.div>

        {/* Featured: Martin Skeptical Debate — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-portfolio-card rounded-xl border border-portfolio-border hover:border-portfolio-gold/50 transition-colors group mb-6 p-6 flex flex-col md:flex-row gap-6"
        >
          {/* Left: icon + text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            <div className="w-16 h-16 bg-portfolio-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-portfolio-gold/20 transition-colors">
              <featuredAchievement.icon className="w-8 h-8 text-portfolio-gold" />
            </div>
            <h3 className="text-lg font-bold text-portfolio-card-text mb-1">{featuredAchievement.title}</h3>
            <p className="text-sm text-portfolio-gold font-medium">{featuredAchievement.organization}</p>
            <p className="text-xs text-portfolio-muted mb-3">{featuredAchievement.date}</p>
            <p className="text-portfolio-muted text-sm leading-relaxed mb-3 whitespace-pre-line">{featuredAchievement.description}</p>
            <div className="flex gap-3 flex-wrap">
              {featuredAchievement.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-portfolio-gold hover:underline"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Right: photo thumbnails */}
          <div className="flex flex-row md:flex-row gap-3 items-center justify-center md:justify-end flex-shrink-0">
            {featuredAchievement.photos.map((src, i) => (
              <button
                key={src}
                onClick={() => openPhoto(featuredAchievement.photos, i)}
                className="w-28 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden border border-portfolio-border hover:border-portfolio-gold/60 transition-colors flex-shrink-0"
              >
                <img
                  src={src}
                  alt={`Debate photo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Remaining achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-portfolio-card p-6 rounded-xl border border-portfolio-border flex flex-col items-center text-center hover:border-portfolio-gold/50 transition-colors group"
            >
              <div className="w-16 h-16 bg-portfolio-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-portfolio-gold/20 transition-colors">
                <achievement.icon className="w-8 h-8 text-portfolio-gold" />
              </div>
              <h3 className="text-lg font-bold text-portfolio-card-text mb-2">{achievement.title}</h3>
              <p className="text-sm text-portfolio-gold font-medium mb-3">{achievement.organization}</p>
              <p className="text-portfolio-muted text-sm leading-relaxed">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalState && (
          <PhotoModal
            photos={modalState.photos}
            startIndex={modalState.startIndex}
            onClose={() => setModalState(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Achievements;
