import { DeveloperProfile } from '@/types/profile';

export const sampleProfile: DeveloperProfile = {
  name: 'Sajal Malhotra',
  username: 'sajal',
  avatar: '/avatar.jpg',
  role: 'Developer',
  location: 'India',
  bio: 'I build products for the web, explore AI, and turn ideas into real software. Always up for thoughtful engineering collaborations.',
  availability: 'Available for collaboration',
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'C++',
    'PostgreSQL',
    'AI/ML',
    'SQL',
  ],
  projects: [
    {
      name: 'Pairfect',
      description: 'A platform connecting engineers for collaborative pair-programming and code reviews with low-latency audio.',
      technologies: ['Next.js', 'WebRTC', 'TypeScript'],
      github: 'https://github.com/sajal/pairfect',
      liveDemo: 'https://pairfect.dev',
    },
    {
      name: 'Thinkfolio',
      description: 'A minimalist digital workspace and thought catalog designed for distraction-free technical documentation.',
      technologies: ['React', 'Tailwind', 'PostgreSQL'],
      github: 'https://github.com/sajal/thinkfolio',
      liveDemo: 'https://thinkfolio.dev',
    },
    {
      name: 'CampusConnect',
      description: 'A real-time network connecting college students across campuses for shared events, resources, and projects.',
      technologies: ['Next.js', 'PostgreSQL', 'WebSocket'],
      github: 'https://github.com/sajal/campusconnect',
      liveDemo: 'https://campusconnect.dev',
    },
  ],
  links: {
    github: 'https://github.com/sajal',
    linkedin: 'https://linkedin.com/in/sajal',
    x: 'https://x.com/sajal',
    email: 'sajal@devdex.dev',
  },
  aiSummary:
    "Sajal is a software developer from India focused on web applications and AI tools. He builds practical products with high design quality.",
};
