import { DeveloperProfile } from '@/types/profile';

export const sampleProfile: DeveloperProfile = {
  name: 'Sajal Malhotra',
  username: 'sajal',
  avatar: '/avatar.jpg',
  role: 'Undergraduate Developer',
  location: 'India',
  bio: 'I build things for the web, explore AI, and love turning ideas into real projects. Always up for new conversations and collaborations.',
  availability: 'Available for Collaboration',
  skills: [
    'C++',
    'Python',
    'JavaScript',
    'React',
    'Node.js',
    'AI/ML',
    'SQL',
    'Web Development',
  ],
  projects: [
    {
      name: 'CampusConnect',
      description: 'A platform to connect students across colleges. Real-time messaging, event sharing, and community building.',
      technologies: ['Next.js', 'PostgreSQL', 'WebSocket'],
      github: 'https://github.com/sajal/campusconnect',
      liveDemo: 'https://campusconnect.dev',
    },
    {
      name: 'AI Resume Analyzer',
      description: 'Analyze and improve your resume with AI. Get actionable feedback on structure, keywords, and impact.',
      technologies: ['React', 'Gemini API', 'Python'],
      github: 'https://github.com/sajal/ai-resume-analyzer',
      liveDemo: 'https://resume-ai.sajal.dev',
    },
    {
      name: 'DevNotes',
      description: 'A minimal and powerful notes app for developers. Markdown-first, fast, and designed to stay out of your way.',
      technologies: ['Node.js', 'MongoDB', 'React'],
      github: 'https://github.com/sajal/devnotes',
      liveDemo: 'https://devnotes.sajal.dev',
    },
  ],
  links: {
    github: 'https://github.com/sajal',
    linkedin: 'https://linkedin.com/in/sajal',
    x: 'https://x.com/sajal',
    email: 'sajal@devdex.dev',
  },
  aiSummary:
    "Sajal is an undergraduate developer from India who's passionate about web development and AI. He builds practical tools and loves collaborating on projects that solve real problems.",
};
