import React from 'react';
import { Briefcase, Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const experiences = [
  {
    id: 1,
    role: 'Co-founder and President',
    company: 'Virginia AI Safety Initiative (VAISI)',
    period: 'Aug 2025 - Present',
    description: 'Creating an environment that enables the UVA community to engage with and take action on AI safety. Focused on recruitment, operations, and planning the AI Governance Fellowship.'
  },
  
  {
    id: 2,
    role: 'Pathfinder Fellow',
    company: 'Kairos',
    period: 'Aug 2025 - Dec 2025',
    description: 'Received mentorship, community, and funding crucial for establishing VAISI.'
  },
  {
    id: 3,
    role: 'Intensive AGI Strategy Course',
    company: 'BlueDot Impact',
    period: 'Jan 2025',
    description: 'Learned about trends, risks, stakeholders, and proposed frameworks for steering AI towards beneficial outcomes. Still working on final project',
    link: 'https://bluedot.org/courses/agi-strategy'
  },
  {
    id: 4,
    role: 'IT Summer Intern (Systems Engineering)',
    company: 'UPS',
    period: 'Jun 2024 - Aug 2024',
    description: 'Identified bottlenecks and coded a PowerShell script to automate system setup, reducing process time from 2-3hrs to seconds. Estimated anual savings ~$4,000. Won 3rd place in Google Cloud Vision AI Hackathon category.'
  },
  {
    id: 5,
    role: 'Undergraduate Research Assistant',
    company: 'UVA Engineering Link Lab',
    period: 'Sep 2023 - Sep 2024',
    description: 'Co-authored research paper for UbiComp/ISWC 2024. Spearheaded research on musical chords and emotionality, conducting qualitative and quantitative user studies.'
  },
  {
    id: 6,
    role: 'IT Summer Intern (Global Networking)',
    company: 'UPS',
    period: 'Jun 2023 - Aug 2023',
    description: 'Worked with SD-WAN, SNMP, and telemetry. Led front-end development for a team that placed top 10% in the UPS 2023 Hackathon.'
  },
  {
    id: 7,
    role: 'Founder + Operator',
    company: "JC's PCs",
    period: 'Aug 2019 - Aug 2022',
    description: 'Launched custom PC business ($6k revenue). Mentored peers in PC building and hardware troubleshooting.'
  },
  // Education
  {
    id: 8,
    role: 'B.S. Computer Engineering',
    company: 'University of Virginia',
    period: 'Aug 2022 - May 2026',
    description: 'GPA: 3.7/4.0. Lead of AI Safety Initiative. Former Exec of Google Developer Group at UVA, Trigon Engineering Society.'
  },
  {
    id: 9,
    role: 'Engineering & Design Program',
    company: 'Ramapo High School',
    period: 'Sep 2018 - Jun 2022',
    description: 'GPA: 3.8/4.0. Chess Club President, Varsity Tennis Captain.'
  },
  // Volunteering
  {
    id: 10,
    role: 'Volunteer',
    company: 'Families for Families NJ',
    period: 'Oct 2018 - Aug 2025',
    description: 'Assisted in furniture collection and delivery for families transitioning out of homelessness. Translated (Spanish) at food pantries.'
  },
  {
    id: 11,
    role: 'Member',
    company: 'Giving What We Can',
    period: 'Sep 2025 - Present',
    description: 'Pledged to give at least 10% of lifetime income to effective charities.'
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
          <h2 className="text-3xl md:text-4xl font-bold text-portfolio-text mb-4">Experience</h2>
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
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-portfolio-card-text">{exp.role}</h3>
                          {exp.link && (
                            <a 
                              href={exp.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-portfolio-gold hover:text-portfolio-gold/80 transition-colors"
                              aria-label={`Link to ${exp.company}`}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
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
