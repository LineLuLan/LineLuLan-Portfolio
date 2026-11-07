// Intent: publish Line's refreshable academic record as a static, accessible page.
// Status: implemented. Next: refresh with import:transcript. Blockers: none. Confidence: source-backed data.
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeDock } from '@/components/ThemeDock';
import { GradeTrend } from '@/components/transcript/GradeTrend';
import { SemesterCard } from '@/components/transcript/SemesterCard';
import { chronological, displayScore, gradeBand, gradeOrder } from '@/components/transcript/transcript';
import transcript from '@/content/transcript.json';
import '@/components/transcript/transcript.css';

export const metadata: Metadata = {
  title: 'Academic record',
  description: "Line's BSc Data Science academic record at International University, VNU-HCM: course grades, semester GPA and cumulative progress.",
};

export default function TranscriptPage() {
  const semesters = chronological(transcript.semesters);
  const latest = semesters.findLast((semester) => semester.summary?.cumulativeGpa4 != null)?.summary;
  const courses = semesters.flatMap((semester) => semester.courses);
  const distribution = gradeOrder.map((letter) => ({ letter, count: courses.filter((course) => course.letter === letter).length }));
  const graded = distribution.reduce((sum, grade) => sum + grade.count, 0);
  const updated = new Date(`${transcript.updated}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  return (
    <div className="relative min-h-screen">
      <Header />
      <main id="hero" tabIndex={-1} className="transcript-page focus:outline-none">
        <header className="transcript-hero">
          <Link href="/#experience" className="transcript-back"><span aria-hidden="true">&larr;</span> Back to experience</Link>
          <p className="eyebrow">Academic record</p>
          <h1 className="editorial-h2">Course by course<span className="text-accent">.</span></h1>
          <p className="transcript-program">{transcript.program}<span>{transcript.school}</span></p>
          <dl className="transcript-overview">
            <div className="transcript-gpa-tile">
              <dt>Cumulative GPA</dt>
              <dd>{displayScore(latest?.cumulativeGpa4, 2)} <span>/ 4.0</span></dd>
            </div>
            <div><dt>Cumulative score</dt><dd>{displayScore(latest?.cumulativeGpa10, 1)} <span>/ 100</span></dd></div>
            <div>
              <dt>Credits earned</dt>
              <dd>
                {displayScore(latest?.creditsCumulative)} <span>/ {transcript.creditsRequired}</span>
                <progress className="transcript-credit-progress" value={latest?.creditsCumulative ?? undefined} max={transcript.creditsRequired}
                  aria-label="Credits earned toward degree" />
              </dd>
            </div>
          </dl>
          <p className="transcript-updated">Last updated <time dateTime={transcript.updated}>{updated}</time></p>
        </header>
        <GradeTrend semesters={semesters} />
        <section className="transcript-distribution" aria-labelledby="distribution-heading">
          <div className="transcript-section-heading">
            <h2 id="distribution-heading">Letter grades.</h2>
            <p>{graded} graded courses · P and NA excluded</p>
          </div>
          <ul className="transcript-grade-distribution">
            {distribution.filter((grade) => grade.count > 0).map((grade) => <li key={grade.letter} style={{ flexGrow: grade.count }}>
              <span className="transcript-distribution-bar" data-band={gradeBand(grade.letter)} aria-hidden="true" />
              <span><strong>{grade.letter}</strong><span>{grade.count}<span className="sr-only"> courses</span></span></span>
            </li>)}
          </ul>
        </section>
        <div className="transcript-semesters">
          {[...semesters].reverse().map((semester) => <SemesterCard key={semester.id} semester={semester} />)}
        </div>
        <p className="transcript-footnote">Grades from the university portal. P = pass (non-credit intensive English), NA = not graded.</p>
      </main>
      <Footer />
      <ThemeDock />
    </div>
  );
}
