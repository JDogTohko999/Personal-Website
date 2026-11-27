import React from 'react';
import { links } from './profile';
import PhotoLink from '../components/PhotoLink.jsx';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

export const linkedinUrl = links.linkedin;

// kind: 'work' | 'education' | 'volunteer'. highlight: shown by default in a condensed view.
// orgUrl: the organisation's own site (its name links there). link: a project/paper link shown when open.
export const experiences = [
  {
    id: 13,
    role: 'Student Team Organizer',
    company: 'Cambridge Boston Alignment Initiative',
    period: 'Sep 2026 - Present',
    description: (
      <>
        Helping run MIT's AI safety group (<a href="https://mitaialignment.org/" {...ext}>MAIA</a>), and some shared programming with Harvard's (<a href="https://haist.ai/" {...ext}>AIST</a>). Recently I've been focused on organizing AIST/MAIA's three fall <a href="https://mitaialignment.org/getinvolved/#workshops" {...ext}>workshops</a>.
      </>
    ),
    short: "Helping run MIT's AI safety group and organizing AIST/MAIA's fall workshops.",
    orgUrl: 'https://www.cbai.ai/',
    kind: 'work',
    current: true,
    highlight: true,
  },
  {
    id: 12,
    role: 'Co-director',
    company: 'AI Safety Seeding Initiative',
    period: 'June 2026 - Present',
    description: (
      <>
        Actively sourcing and supporting founders of AI safety university groups. This is an expanded version of my original Bootloader Initiative from May.
      </>
    ),
    short: 'Sourcing and supporting founders of AI safety university groups.',
    orgUrl: 'https://aisafetyseeding.org/',
    kind: 'work',
    current: true,
    highlight: true,
  },
  {
    id: 1,
    role: 'Co-founder and Former President',
    company: 'Virginia AI Security Initiative',
    period: 'Aug 2025 - May 2026',
    description: 'Created an environment that enabled the UVA community to engage with and take action on AI risks. Focused on team management, effective recruitment, event coordination, and creating + leading VAISI\'s AI Governance Fellowship.',
    short: "Built UVA's AI risk community; led recruitment, events, and the AI Governance Fellowship.",
    link: 'https://vaisi.org',
    orgUrl: 'https://www.vaisi.org/',
    kind: 'work',
    current: false,
    highlight: true,
  },
  {
    id: 2,
    role: 'Pathfinder Fellow and Mentor',
    company: 'Kairos',
    period: 'Aug 2025 - Present',
    description: (
      <>
        <span className="work-part"><strong>Fellow</strong>, Fall &rsquo;25. Received mentorship, community, and funding crucial for establishing VAISI.</span>
        <span className="work-part"><strong>Mentor</strong>, Fall &rsquo;26. Mentoring university group founders at BYU, Dartmouth, and UNC.</span>
      </>
    ),
    short: "Fellow in Fall '25 (mentorship and funding for VAISI); mentor in Fall '26 for founders at BYU, Dartmouth, and UNC.",
    link: 'https://pathfinder.kairos-project.org/',
    orgUrl: 'https://kairos-project.org/',
    kind: 'work',
    current: true,
    highlight: false,
  },
  {
    id: 3,
    role: 'Intensive AGI Strategy Course',
    company: 'BlueDot Impact',
    period: 'Jan 2025',
    description: 'Learned about trends, risks, stakeholders, and proposed frameworks for steering AI towards beneficial outcomes. Still working on final project',
    short: 'Studied AI trends, risks, stakeholders, and frameworks for beneficial outcomes.',
    link: 'https://bluedot.org/courses/agi-strategy',
    orgUrl: 'https://bluedot.org/',
    kind: 'work',
    current: false,
    highlight: false,
  },
  {
    id: 4,
    role: 'IT Summer Intern (Systems Engineering)',
    company: 'UPS',
    orgUrl: 'https://www.ups.com/',
    period: 'Jun 2024 - Aug 2024',
    description: 'Identified bottlenecks and coded a PowerShell script to automate system setup, reducing process time from 2-3hrs to seconds. Estimated anual savings ~$4,000. Won 3rd place in Google Cloud Vision AI Hackathon category.',
    short: 'Automated system setup with PowerShell, cutting 2-3hrs to seconds; ~$4,000 annual savings.',
    kind: 'work',
    current: false,
    highlight: false,
  },
  {
    id: 5,
    role: 'Undergraduate Research Assistant',
    company: 'UVA Engineering Link Lab',
    period: 'Sep 2023 - Sep 2024',
    description: 'Co-authored research paper for UbiComp/ISWC 2024. Spearheaded research on musical chords and emotionality, conducting qualitative and quantitative user studies.',
    short: 'Co-authored UbiComp/ISWC 2024 paper on musical chords and emotionality.',
    link: 'https://doi.org/10.1145/3675094.3678495',
    orgUrl: 'https://engineering.virginia.edu/labs-groups/link-lab',
    kind: 'work',
    current: false,
    highlight: false,
  },
  {
    id: 6,
    role: 'IT Summer Intern (Global Networking)',
    company: 'UPS',
    orgUrl: 'https://www.ups.com/',
    period: 'Jun 2023 - Aug 2023',
    description: 'Worked with SD-WAN, SNMP, and telemetry. Led front-end development for a team that placed top 10% in the UPS 2023 Hackathon.',
    short: 'Worked with SD-WAN, SNMP, telemetry; led front-end for top-10% hackathon team.',
    kind: 'work',
    current: false,
    highlight: false,
  },
  {
    id: 7,
    role: 'Founder + Operator',
    company: "JC's PCs",
    period: 'Aug 2019 - Aug 2022',
    description: 'Launched custom PC business ($6k revenue). Mentored peers in PC building and hardware troubleshooting.',
    short: 'Launched custom PC business ($6k revenue); mentored peers.',
    kind: 'work',
    current: false,
    highlight: false,
  },
  // Education
  {
    id: 8,
    role: 'B.S. Computer Engineering | AI Focal Path',
    company: 'University of Virginia',
    period: 'Aug 2022 - May 2026',
    description: (
      <>
        <a href="https://doi.org/10.18130/yqgv-1g90" {...ext}>Capstone + Thesis</a>
        {' · '}
        <a href="https://doi.org/10.1145/3675094.3678495" {...ext}>Extraneous research</a>
        <br />
        VAISI, Dsig, Trigon, chess club, and founding member of the Boomsticks (
        <PhotoLink
          images={['/now/Boomsticks_AFC.jpg', '/now/boomsticks_beach_outside_grad.JPG']}
          alt="The Boomsticks"
          alts={['The Boomsticks on the banner at the AFC', 'The Boomsticks on the beach court at graduation']}
        >
          3x IM Co-ed Volleyball Champs
        </PhotoLink>
        ).
      </>
    ),
    short: 'Capstone + Thesis, research; VAISI, Dsig, Trigon, chess club, and the Boomsticks.',
    orgUrl: 'https://www.virginia.edu/',
    kind: 'education',
    current: false,
    highlight: true,
  },
  {
    id: 9,
    role: 'Engineering & Design Program',
    company: 'Ramapo High School',
    orgUrl: 'https://ramapo.rih.org/',
    period: 'Sep 2018 - Jun 2022',
    description: 'GPA: 3.8/4.0. Chess Club President, Varsity Tennis Co-Captain.',
    short: 'GPA 3.8/4.0; Chess Club President, Varsity Tennis Co-Captain.',
    kind: 'education',
    current: false,
    highlight: false,
  },
  // Volunteering
  {
    id: 10,
    role: 'Volunteer',
    company: 'Families for Families NJ',
    orgUrl: 'https://www.families4families.com/',
    period: 'Oct 2018 - Aug 2025',
    description: 'Assisted in furniture collection and delivery for families transitioning out of homelessness. Translated (Spanish) at food pantries.',
    short: 'Furniture delivery for families leaving homelessness; Spanish translation at food pantries.',
    kind: 'volunteer',
    current: false,
    highlight: false,
  },
  {
    id: 11,
    role: '🔸Pledger',
    company: 'Giving What We Can',
    period: 'Sep 2025 - Present',
    description: 'Pledged to give at least 10% of lifetime income to effective charities.',
    short: 'Pledged at least 10% of lifetime income to effective charities.',
    link: 'https://www.givingwhatwecan.org/pledge',
    orgUrl: 'https://www.givingwhatwecan.org/',
    kind: 'volunteer',
    current: true,
    highlight: false,
  },
];
