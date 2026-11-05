import type { StackIconKey } from '@/lib/stack-icons';
import type { PlanetKind } from '@/lib/pixel-planets';

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
  listed?: boolean;
  lead?: boolean;
  planet: PlanetKind;
  year: string;
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
    video?: string;
    model?: string; // Hugging Face model page
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

export type StackItem = { name: string; icon?: StackIconKey };

export type SkillTier = {
  id: string;
  label: string;
  caption: string;
  items: StackItem[];
  practices?: string[];
};

export type DABMStep = {
  letter: 'D' | 'A' | 'B' | 'M';
  label: string;
  planet: PlanetKind;
  body: string;
};

export type SocialLinks = {
  openreview: string;
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
  proof: string;
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
  availability: string; // short status chip in the hero, one line on phones
  // Editorial enhancements
  stats: ProfileStat[];
  whatIBring: WhatIBringItem[];
  exploring: string[];
  narrative: ProfileNarrative;
};
