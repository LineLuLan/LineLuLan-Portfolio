// Intent: protect the real portal import and fail before publishing malformed results.
// Status: regression gate. Next: update source expectations when new grades arrive. Blockers: source export required.
// Confidence: real-file assertions plus format and final-result edge cases.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseTranscript } from './import-transcript.mjs';

const source = readFileSync(new URL('../.transcript-source/DiemSinhVien.xls', import.meta.url));
const result = parseTranscript(source);
assert.equal(result.creditsRequired, 135, 'Default degree requirement');
assert.equal(parseTranscript(source, { creditsRequired: 140 }).creditsRequired, 140, 'Preserve the configured degree requirement on re-import');
assert.equal(parseTranscript(source, {}).creditsRequired, 135, 'Default older transcripts without a degree requirement');
const published = JSON.parse(readFileSync(new URL('../content/transcript.json', import.meta.url), 'utf8'));
assert.equal(published.creditsRequired, 135, 'Published degree requirement');
assert.equal(result.semesters.length, 7);
const courses = result.semesters.flatMap((semester) => semester.courses);
assert.equal(courses.length, 29);
const fall = result.semesters.find((semester) => semester.id === '2025-2026-1');
assert.equal(fall.summary.gpa4, 3.69);
assert.equal(fall.summary.cumulativeGpa4, 3.52);
assert.equal(fall.summary.standing, 'Very good');
const latest = result.semesters.at(-1);
assert.equal(latest.summary.cumulativeGpa4, 3.56);
assert.equal(latest.summary.cumulativeGpa10, 86);
assert.equal(latest.summary.creditsCumulative, 72);
assert.equal(courses.filter((course) => course.letter === 'P').length, 3);
assert.equal(courses.filter((course) => course.letter === 'NA').length, 1);
for (const course of courses.filter((course) => ['P', 'NA'].includes(course.letter))) {
  assert.deepEqual(course.scores, { coursework: null, midterm: null, final: null });
  assert.equal(course.total10, null);
}
assert.equal(result.semesters.filter((semester) => semester.summary === null).length, 3);
assert.equal(courses.find((course) => course.code === 'PT002IU').scores.coursework, 0);
assert.equal(courses.find((course) => course.code === 'IT069IU').total10, 98);
assert.deepEqual(courses.find((course) => course.code === 'IT079IU').weights, { coursework: 35, midterm: 25, final: 40 });
assert.match(result.updated, /^\d{4}-\d{2}-\d{2}$/);

// Reuse the observed portal format: no fabricated schema or alternate column order.
const html = new TextDecoder('utf-16le').decode(source);
const encode = (value) => Buffer.from(`\uFEFF${value}`, 'utf16le');
const revised = html.replace(/(>98<\/span><\/td><td title="98"[^>]*><span class="Label">)98/, '$190');
assert.equal(parseTranscript(encode(revised)).semesters.flatMap((semester) => semester.courses).find((course) => course.code === 'IT069IU').total10, 90, 'Use final total, not first-attempt total');
const entities = html.replace('Algorithms & Data Structures', 'Algorithms &amp; Data &#83;tructures');
assert.equal(parseTranscript(encode(entities)).semesters.flatMap((semester) => semester.courses).find((course) => course.code === 'IT013IU').name, 'Algorithms & Data Structures');
assert.throws(() => parseTranscript(Buffer.from('not a UTF-16 export')), /UTF-16LE/);
assert.throws(() => parseTranscript(encode('<table></table>')), /header|semester/i);
assert.throws(() => parseTranscript(encode(html.replace('>77.1</span>', '>oops</span>'))), /numeric/i);
console.log('PASS: 29 published courses / 7 semesters, portal summaries, null P/NA scores, zero scores, weights, entities, final totals and malformed-input guards.');
