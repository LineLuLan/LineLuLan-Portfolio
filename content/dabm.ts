import type { DABMStep } from '@/types';

export const dabmSteps: DABMStep[] = [
  {
    letter: 'D', label: 'Data', planet: 'earth',
    body: 'Question the data before trusting it: where it comes from, how it was processed, and whether it is enough for what we want to learn.',
  },
  {
    letter: 'A', label: 'Agent', planet: 'saturn',
    body: 'Model the actors as autonomous agents with their own logic, so the system can be simulated and decisions can be supported.',
  },
  {
    letter: 'B', label: 'Behavior', planet: 'jupiter',
    body: 'Study how the parts interact: how flows propagate and how the system actually behaves under load.',
  },
  {
    letter: 'M', label: 'Modeling', planet: 'neptune',
    body: 'Turn the whole system into something we can simulate, optimize and verify against the original intent.',
  },
];

export const dabmLead = 'Data first. Systems that behave. Models you can trust.';
export const dabmIntro = 'My own way of thinking through an AI system, from the raw data to the model that has to hold up in the real world.';
