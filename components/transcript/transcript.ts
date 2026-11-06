// Intent: share the imported academic record shape across server-rendered views.
// Status: implemented. Next: refresh from the portal export. Blockers: none. Confidence: typed schema.
export type Course = {
  code: string;
  name: string;
  credits: number;
  weights: { coursework: number | null; midterm: number | null; final: number | null };
  scores: { coursework: number | null; midterm: number | null; final: number | null };
  total10: number | null;
  letter: string;
};

export type SemesterSummary = {
  gpa10: number | null;
  gpa4: number | null;
  cumulativeGpa10: number | null;
  cumulativeGpa4: number | null;
  creditsEarned: number | null;
  creditsCumulative: number | null;
  standing: string | null;
};

export type Semester = {
  id: string;
  label: string;
  term: number;
  year: string;
  courses: Course[];
  summary: SemesterSummary | null;
};

export const gradeOrder = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
export const displayScore = (score: number | null | undefined, digits?: number) =>
  score == null ? '–' : digits == null ? String(score) : score.toFixed(digits);
export const gradeBand = (letter: string) =>
  letter.startsWith('A') ? 'a' : letter.startsWith('B') ? 'b' : 'neutral';

export function chronological(semesters: Semester[]) {
  return [...semesters].sort((a, b) => a.year.localeCompare(b.year) || a.term - b.term);
}
