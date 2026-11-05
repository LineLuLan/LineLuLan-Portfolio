export const themes = [
  {
    id: 'orbit',
    number: '01',
    name: 'Orbit',
    symbol: '◐',
    accent: '#8F2D9A',
    paper: '#F8F7F4',
    description: 'Paper · pixel planets · quiet purple',
  },
] as const;

export type ThemeId = (typeof themes)[number]['id'];

export const THEME_STORAGE_KEY = 'line.theme';
export const MOTION_STORAGE_KEY = 'line.motion';
export const DEFAULT_THEME: ThemeId = 'orbit';

export function isTheme(value: unknown): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

// Intent: honor explicit choices, otherwise follow the OS before first paint.
// Status: R2. Next: browser checks. Blockers: none. Confidence: storage/system regression matrix.
export const themeInitScript = `(function(){var r=document.documentElement,t=${JSON.stringify(DEFAULT_THEME)},m=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on',source='system';try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(themes.map((theme) => theme.id))}.indexOf(s)>-1)t=s;var choice=localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)});if(choice==='on'||choice==='off'){m=choice;source='user';}}catch(e){}r.dataset.theme=t;r.dataset.motion=m;r.dataset.motionSource=source;})();`;
