// Intent: count inclusive calendar months without double-counting grouped promotions.
// Status: implemented. Next: maintain date boundaries. Blockers: none. Confidence: unit coverage.
import type { ExperienceRole } from '@/types';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthIndex = (date: string) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7)) - 1;
const monthLabel = (date: string) => `${months[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`;

function durationLabel(count: number) {
  const years = Math.floor(count / 12);
  const remainder = count % 12;
  return [years ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : '', remainder || !years ? `${remainder} ${remainder === 1 ? 'mo' : 'mos'}` : ''].filter(Boolean).join(' ');
}

export function roleDateRange(role: ExperienceRole) {
  if (role.start === role.end) return monthLabel(role.start);
  return `${monthLabel(role.start)} – ${role.end ? monthLabel(role.end) : 'Present'}`;
}

export function orgDuration(roles: ExperienceRole[], today: string) {
  const occupied = new Set<number>();
  for (const role of roles) {
    const end = monthIndex(role.end ?? today);
    for (let month = monthIndex(role.start); month <= end; month++) occupied.add(month);
  }
  return durationLabel(occupied.size);
}

export function roleDuration(role: ExperienceRole, today: string) {
  return orgDuration([role], today);
}
