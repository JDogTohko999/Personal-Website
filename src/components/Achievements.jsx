import React from 'react';
import { Award, Medal, Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const achievements = [
  {
    id: 1,
    title: 'Hackathon Winner',
    organization: 'Global Tech Summit 2023',
    description: 'First place in the "AI for Good" category.',
    icon: Trophy
  },
  {
    id: 2,
    title: 'Certified Cloud Architect',
    organization: 'AWS',
    description: 'Professional certification for designing distributed systems.',
    icon: Medal
  },
  {
    id: 3,
    title: 'Open Source Contributor',
    organization: 'React Community',
    description: 'Recognized for significant contributions to core libraries.',
    icon: Star
  },
  {
    id: 4,
    title: 'Dean\'s List',
    organization: 'University of Tech',
    description: 'Consistently maintained top 5% academic standing.',
    icon: Award
  }
];

const Achievements = () => {
  return (
    <section id="achievements" className="py-20 bg-portfolio-bg border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Achievements</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-portfolio-card p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center hover:border-portfolio-gold/50 transition-colors group"
            >
              <div className="w-16 h-16 bg-portfolio-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-portfolio-gold/20 transition-colors">
                <achievement.icon className="w-8 h-8 text-portfolio-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
              <p className="text-sm text-portfolio-gold font-medium mb-3">{achievement.organization}</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
