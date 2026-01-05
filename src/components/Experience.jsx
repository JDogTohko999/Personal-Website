import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const experiences = [
  {
    id: 1,
    role: 'Senior Software Engineer',
    company: 'Tech Corp Inc.',
    period: '2023 - Present',
    description: 'Leading a team of developers in building scalable web applications. improved system performance by 40%.'
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    company: 'Creative Solutions',
    period: '2021 - 2023',
    description: 'Developed and maintained client-facing platforms using React and Node.js. Implemented CI/CD pipelines.'
  },
  {
    id: 3,
    role: 'Software Intern',
    company: 'StartUp Hub',
    period: '2020 - 2021',
    description: 'Collaborated on frontend features and bug fixes. Gained hands-on experience with Agile methodologies.'
  },
  // Education
  {
    id: 4,
    role: 'B.S. Computer Science',
    company: 'University of Tech',
    period: '2016 - 2020',
    description: 'Graduated with Honors. Focused on Distributed Systems and AI.'
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-portfolio-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-text mb-4">Experience & Education</h2>
          <div className="w-20 h-1 bg-portfolio-gold mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative border-l-2 border-portfolio-border ml-4 md:ml-0 md:pl-0 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 bg-portfolio-gold w-5 h-5 rounded-full border-4 border-portfolio-bg"></div>
              
              <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                {/* Date for Desktop */}
                <div className="hidden md:block col-span-1 text-right pt-1">
                  <span className="text-portfolio-gold font-mono text-sm">{exp.period}</span>
                </div>

                {/* Content Card */}
                <div className="col-span-4 bg-portfolio-card border border-portfolio-border p-6 rounded-lg hover:border-portfolio-gold/50 transition-colors shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-portfolio-card-text">{exp.role}</h3>
                      <h4 className="text-lg text-portfolio-gold">{exp.company}</h4>
                    </div>
                    <div className="md:hidden mt-2 flex items-center text-portfolio-muted text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {exp.period}
                    </div>
                  </div>
                  <p className="text-portfolio-muted leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
