// Single source of truth for content shapes. Edit content/*.ts against these types.

export type ProjectState = 'live' | 'wip' | 'classified' | 'paused';

export type ProjectDomain = 'research' | 'LLM' | 'ML' | 'EdTech' | 'creative' | 'other';

export type DABMMapping = {
  D: string; // data
  A: string; // agent
  B: string; // behavior
  M: string; // modeling
};

export type Project = {
  slug: string;
  name: string;
  codename?: string;
  tagline: string;
  domains: ProjectDomain[];
  state: ProjectState;
  featured?: boolean;
  // story
  problem?: string;
  dataset?: string;
  method?: string;
  results?: string;
  tech?: string[];
  role?: string;
  collaborators?: { name: string; role?: string }[];
  // links
  links?: {
    github?: string;
    demo?: string;
    paper?: string;
  };
  // DABM
  dabm?: DABMMapping;
  // visual
  image?: string;
  // ETA for WIP/classified
  eta?: string;
  // why it matters (1 sentence)
  why?: string;
};

export type ChronicleType = 'education' | 'role' | 'award' | 'event' | 'project';

export type ChronicleEvent = {
  id: string;
  date: string; // ISO YYYY-MM-DD
  endDate?: string; // for ongoing roles
  type: ChronicleType;
  title: string;
  org?: string;
  description?: string;
  link?: string;
  ongoing?: boolean;
};

export type SkillTier = {
  id: 'core' | 'llm' | 'working' | 'exploring';
  command: string; // e.g. "cat core_stack.log"
  label: string; // e.g. "CORE STACK"
  caption: string; // e.g. "daily reach"
  rows: SkillRow[];
};

export type SkillRow = {
  category: string; // e.g. "Languages"
  items: string[]; // e.g. ["Python", "SQL", "TypeScript"]
};

export type DABMQuadrant = {
  letter: 'D' | 'A' | 'B' | 'M';
  label: string; // "DATA", "AGENT", ...
  body: string;
};

export type SocialLinks = {
  github: string;
  linkedin: string;
  kaggle: string;
  email: string;
};

export type ProfileStat = {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
  pad?: number;
};

export type WhatIBringItem = {
  title: string;
  description: string;
};

export type ProfileNarrative = {
  intro: string;
  mission: string;
};

export type Profile = {
  name: string;
  alias: string;
  title: string;
  positioning: string;
  framework: {
    short: string;
    long: string;
    tagline: string;
  };
  pillars: string[];
  facts: { key: string; value: string }[];
  location: string;
  status: string;
  gpa: string;
  research: string;
  building: string;
  openTo: string;
  // Editorial enhancements
  stats: ProfileStat[];
  whatIBring: WhatIBringItem[];
  exploring: string[];
  narrative: ProfileNarrative;
};
