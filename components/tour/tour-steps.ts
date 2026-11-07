// Intent: keep Line's approved tour copy and navigation in one pure, testable module.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: boundary tests.
export const TOUR_STEPS = [
  { target: 'hero', title: "Hi, I'm Line", body: "Start here: who I am, what I'm open to, and my local time in Vietnam. Hover the orbit and the planets line up into Pisces; each star is a section." },
  { target: 'about', title: 'About', body: 'Where research meets production: how I work and what I bring to a team.' },
  { target: 'experience', title: 'Experience', body: "Where I've worked. Pick a company on the left; photos open full screen." },
  { target: 'stack', title: 'Stack', body: 'The tools I ship with, starting with the agent-coding harness I use every day.' },
  { target: 'work', title: 'Work', body: 'Selected projects. Drag or use the arrows, then open any card for the full story.' },
  { target: 'framework', title: 'Framework', body: 'DABM: Data, Agent, Behavior, Modeling. The four questions I ask before I build anything.' },
  { target: 'record', title: 'Record', body: 'My path so far. Awards are gold, current roles are green; tap a milestone for details.' },
  { target: 'contact', title: 'Contact', body: 'Want to work together? Send a message or copy my email here.' },
  { target: null, title: "That's the tour", body: 'Thanks for looking around. The planets in the orbit will take you back to any section.' },
] as const;

export function nextStep(index: number) {
  return Math.min(TOUR_STEPS.length - 1, Math.max(0, index + 1));
}

export function previousStep(index: number) {
  return Math.max(0, Math.min(TOUR_STEPS.length - 1, index - 1));
}

export function targetForStep(index: number) {
  return TOUR_STEPS[index]?.target ?? null;
}
