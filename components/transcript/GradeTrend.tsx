// Intent: make the GPA trajectory readable without chart dependencies or client state.
// Status: implemented. Next: browser and keyboard checks. Blockers: none. Confidence: shared SVG/table values.
import { chronological, displayScore, type Semester } from './transcript';

export function GradeTrend({ semesters }: { semesters: Semester[] }) {
  const points = chronological(semesters).flatMap((semester) => {
    const summary = semester.summary;
    return summary?.gpa4 != null && summary.cumulativeGpa4 != null ? [{
      label: semester.label,
      shortLabel: `S${semester.term} ${semester.year.slice(2, 4)}/${semester.year.slice(7, 9)}`,
      semester: summary.gpa4,
      cumulative: summary.cumulativeGpa4,
    }] : [];
  });
  const first = points[0];
  const last = points.at(-1);
  const description = first && last
    ? `GPA on a 4.0 scale. From ${first.label} to ${last.label}, semester GPA changed from ${first.semester} to ${last.semester}; cumulative GPA from ${first.cumulative} to ${last.cumulative}.`
    : 'GPA trend will appear when semester summaries are available.';

  function chart(width: number, compact: boolean) {
    const left = 38;
    const right = width - (compact ? 112 : 155);
    const top = 28;
    const bottom = 224;
    const x = (index: number) => left + index * (right - left) / Math.max(1, points.length - 1);
    const y = (value: number) => bottom - (value - 2.5) / 1.5 * (bottom - top);
    return (
      <svg className={compact ? 'transcript-trend-mobile' : 'transcript-trend-desktop'}
        viewBox={`0 0 ${width} ${compact ? 286 : 270}`} role="img" aria-label={description}>
        {[2.5, 3.25, 4].map((tick) => <g key={tick}>
          <line x1={left} x2={width - 8} y1={y(tick)} y2={y(tick)} className="transcript-gridline" />
          <text x={left - 10} y={y(tick) + 4} textAnchor="end" className="transcript-axis">{tick.toFixed(tick === 3.25 ? 2 : 1)}</text>
        </g>)}
        {points.map((point, index) => <text key={point.label} x={x(index)} y={bottom + 28 + (compact && index % 2 ? 18 : 0)}
          textAnchor="middle" className="transcript-axis">{point.shortLabel}</text>)}
        {(['cumulative', 'semester'] as const).map((series) => <g key={series} className={`transcript-series-${series}`}>
          <polyline points={points.map((point, index) => `${x(index)},${y(point[series])}`).join(' ')}
            fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={series === 'cumulative' ? '5 5' : undefined} />
          {points.map((point, index) => <g key={point.label} className="transcript-chart-point">
            <circle cx={x(index)} cy={y(point[series])} r="5" fill="var(--color-panel)" stroke="currentColor" strokeWidth="2"
              tabIndex={0} aria-label={`${point.label}, ${series} GPA ${point[series].toFixed(2)}`}>
              <title>{`${point.label}: ${series} GPA ${point[series].toFixed(2)}`}</title>
            </circle>
            <g className="transcript-chart-tooltip" aria-hidden="true" pointerEvents="none">
              <rect x={x(index) - 23} y={y(point[series]) + (series === 'semester' ? -34 : 10)} width="46" height="24" rx="4" fill="var(--color-paper)" />
              <text x={x(index)} y={y(point[series]) + (series === 'semester' ? -17 : 27)} textAnchor="middle">{point[series].toFixed(2)}</text>
            </g>
          </g>)}
          {last && <text x={right + 12} y={y(last[series]) + (series === 'semester' ? -10 : 18)} className="transcript-series-label">
            <tspan x={right + 12}>{series === 'semester' ? 'Semester' : 'Cumulative'}</tspan>
            <tspan dx="6" fontWeight="700">{last[series].toFixed(2)}</tspan>
          </text>}
        </g>)}
      </svg>
    );
  }

  return (
    <section className="transcript-trend transcript-card" aria-labelledby="trend-heading">
      <div className="transcript-section-heading">
        <h2 id="trend-heading">The trajectory.</h2>
        <p>Semester & cumulative GPA · 4.0 scale</p>
      </div>
      {points.length ? <>{chart(900, false)}{chart(320, true)}</> : <p>{description}</p>}
      <div className="sr-only"><table>
        <caption>Semester and cumulative GPA on a 4.0 scale</caption>
        <thead><tr><th scope="col">Semester</th><th scope="col">Semester GPA</th><th scope="col">Cumulative GPA</th></tr></thead>
        <tbody>{points.map((point) => <tr key={point.label}>
          <th scope="row">{point.label}</th><td>{displayScore(point.semester, 2)}</td><td>{displayScore(point.cumulative, 2)}</td>
        </tr>)}</tbody>
      </table></div>
    </section>
  );
}
