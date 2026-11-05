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

// Intent: apply persisted preferences before paint, including when storage is blocked.
// Status: P1 foundation. Next: add themes through the registry. Blockers: none.
// Confidence: covered by stored, invalid, and denied-storage checks.
export const themeInitScript = `(function(){var r=document.documentElement,t=${JSON.stringify(DEFAULT_THEME)},m='on';try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(themes.map((theme) => theme.id))}.indexOf(s)>-1)t=s;if(localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)})==='off')m='off';}catch(e){}r.dataset.theme=t;r.dataset.motion=m;})();`;
