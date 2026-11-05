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

// Intent: keep appearance defaults and pre-paint validation in one registry.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: preference matrix.
export const modes = ['light', 'dark'] as const;
export type Mode = (typeof modes)[number];
export const accents = [
  { id: 'kafka', label: 'Kafka purple' },
  { id: 'nebula', label: 'Nebula blue' },
  { id: 'aurora', label: 'Aurora green' },
  { id: 'mars', label: 'Mars orange' },
  { id: 'rose', label: 'Rose pink' },
] as const;
export type Accent = (typeof accents)[number]['id'];
export const MODE_STORAGE_KEY = 'line.mode';
export const ACCENT_STORAGE_KEY = 'line.accent';
export const DEFAULT_ACCENT: Accent = 'kafka';
export const modePaper: Record<Mode, string> = { light: '#F8F7F4', dark: '#0F0D17' };
export function isMode(value: unknown): value is Mode {
  return modes.some((mode) => mode === value);
}
export function isAccent(value: unknown): value is Accent {
  return accents.some((accent) => accent.id === value);
}

export const themeInitScript = `(function(){var r=document.documentElement,t=${JSON.stringify(DEFAULT_THEME)},m=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on',source='system',mode=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light',modeSource='system',accent=${JSON.stringify(DEFAULT_ACCENT)};try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(themes.map((theme) => theme.id))}.indexOf(s)>-1)t=s;var choice=localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)});if(choice==='on'||choice==='off'){m=choice;source='user';}var c=localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)});if(${JSON.stringify(modes)}.indexOf(c)>-1){mode=c;modeSource='user';}var a=localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});if(${JSON.stringify(accents.map((entry) => entry.id))}.indexOf(a)>-1)accent=a;}catch(e){}r.dataset.theme=t;r.dataset.mode=mode;r.dataset.modeSource=modeSource;r.dataset.accent=accent;r.dataset.motion=m;r.dataset.motionSource=source;})();`;
