// Intent: preserve every published course result with readable desktop and phone layouts.
// Status: implemented. Next: responsive acceptance. Blockers: none. Confidence: portal numbers are not recomputed.
import { displayScore, gradeBand, type Semester } from './transcript';

export function SemesterCard({ semester }: { semester: Semester }) {
  const summary = semester.summary;
  return (
    <section className="transcript-semester transcript-card" aria-labelledby={`semester-${semester.id}`}>
      <header className="transcript-semester-header">
        <div>
          <h2 id={`semester-${semester.id}`}>{semester.label}</h2>
          <p>{semester.courses.length} courses{summary?.creditsEarned != null ? ` · ${summary.creditsEarned} credits earned` : ' · No semester summary issued'}</p>
        </div>
        {summary && <div className="transcript-semester-stats">
          {summary.standing && <span className="transcript-standing">{summary.standing}</span>}
          <p><strong>{displayScore(summary.gpa4, 2)}</strong> / 4.0 <span>· {displayScore(summary.gpa10, 1)} / 100</span></p>
        </div>}
      </header>
      <table className="transcript-course-table" role="table">
        <caption className="sr-only">{semester.label}: course results; numeric scores use the university&apos;s 100-point scale. Component weights appear beside scores.</caption>
        <thead role="rowgroup"><tr role="row">
          {['Code', 'Course', 'Credits', 'Coursework', 'Midterm', 'Final', 'Total', 'Grade'].map((label) =>
            <th key={label} scope="col" role="columnheader">{label}</th>)}
        </tr></thead>
        <tbody role="rowgroup">{semester.courses.map((course) => <tr key={course.code} role="row">
          <td data-label="Code" className="transcript-course-code" role="cell">{course.code}</td>
          <th data-label="Course" scope="row" className="transcript-course-name" role="rowheader">{course.name}</th>
          <td data-label="Credits" role="cell">{course.credits}</td>
          {(['coursework', 'midterm', 'final'] as const).map((component) => <td key={component}
            data-label={component.charAt(0).toUpperCase() + component.slice(1)} role="cell">
            {displayScore(course.scores[component])}
            {course.weights[component] != null && <small className="transcript-weight">
              <span className="sr-only">Weight: </span>{course.weights[component]}%
            </small>}
          </td>)}
          <td data-label="Total" className="transcript-course-total" role="cell">{displayScore(course.total10)}</td>
          <td data-label="Grade" role="cell"><span className="transcript-grade" data-band={gradeBand(course.letter)}>{course.letter}</span></td>
        </tr>)}</tbody>
      </table>
    </section>
  );
}
