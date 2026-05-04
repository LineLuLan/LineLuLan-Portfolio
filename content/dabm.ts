import type { DABMQuadrant } from '@/types';

export const dabmQuadrants: DABMQuadrant[] = [
  {
    letter: 'D',
    label: 'DATA',
    body: "Is it raw or processed? What's the context, the preprocessing depth, the reliability? Is it enough — and right — for what we want to train?",
  },
  {
    letter: 'A',
    label: 'AGENT',
    body: 'Autonomous entities with their own logic and decision-making. Used to simulate complex systems or support decisions.',
  },
  {
    letter: 'B',
    label: 'BEHAVIORAL',
    body: 'The core layer. How components interact, how flows propagate, how the system actually operates under load.',
  },
  {
    letter: 'M',
    label: 'MODELING',
    body: 'The standardization layer. Turns the whole system into something we can simulate, optimize, and verify against intent.',
  },
];

export const dabmIntro =
  'A personal framework combining causal inference, simulation, and AI systems.';
