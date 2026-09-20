export interface Project {
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  liveDemo?: string;
  image?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
  website?: string;
}

export interface DeveloperProfile {
  name: string;
  username: string;
  avatar: string;
  role: string;
  location: string;
  bio: string;
  skills: string[];
  projects: Project[];
  links: SocialLinks;
  availability: string;
  aiSummary: string;
}

export type DeviceState =
  | 'enter'
  | 'card'
  | 'scan'
  | 'resolve'
  | 'unfold'
  | 'settled'
  | 'idle'
  | 'power'
  | 'identify'
  | 'open'
  | 'profile';

export type AIAgentState = 'idle' | 'listening' | 'thinking' | 'speaking';
