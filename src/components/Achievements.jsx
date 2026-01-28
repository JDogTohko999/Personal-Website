import React from 'react';
import { Award, Medal, Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const achievements = [
  {
    id: 1,
    title: 'Eagle Scout',
    organization: 'Boy Scouts of America',
    description: 'Conceived and executed a project restoring historic headstones. Led volunteers to complete 162 hours of service.',
    icon: Medal
  },
  {
    id: 2,
    title: 'Dean\'s List',
    organization: 'UVA Engineering',
    description: 'Achieved all 7 semesters (GPA >= 3.4).',
    icon: Star
  },
  {
    id: 3,
    title: '3rd Place - Google Vision AI',
    organization: 'UPS Hackathon 2024',
    description: 'Competed against 53 teams. Leveraged Cloud Vision AI for package detection.',
    icon: Trophy
  },
  {
    id: 4,
    title: 'Top 10% - UPASK',
    organization: 'UPS Hackathon 2023',
    description: 'Conceptualized and developed an interactive help forum. Placed in top 10% out of 50+ teams.',
    icon: Award
  }
];

const Achievements = () => {
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
              <p className="text-portfolio-muted text-sm leading-relaxed">
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
