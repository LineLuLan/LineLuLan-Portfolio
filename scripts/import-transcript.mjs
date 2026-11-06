// Intent: refresh Line's public transcript from the university's UTF-16LE HTML export.
// Status: implemented. Next: rerun when published grades change. Blockers: local export required.
// Confidence: real-source regression test; source values are preserved, never recalculated.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const columns = ['STT', 'Mã Môn', 'Tên Môn', 'TC', '% QT', '% KT', '% Thi', 'Bài tập', 'Kiểm tra', 'Thi L1', 'TK1(10)', 'TK(10)', 'TK1(CH)', 'TK(CH)'];
const summaryFields = {
  'Điểm trung bình học kỳ hệ 10/100': 'gpa10',
  'Điểm trung bình học kỳ hệ 4': 'gpa4',
  'Điểm trung bình tích lũy': 'cumulativeGpa10',
  'Điểm trung bình tích lũy (hệ 4)': 'cumulativeGpa4',
  'Số tín chỉ đạt': 'creditsEarned',
  'Số tín chỉ tích lũy': 'creditsCumulative',
  'Phân loại điểm trung bình HK': 'standing',
};
const standings = { 'Khá': 'Good', 'Giỏi': 'Very good', 'Xuất sắc': 'Excellent', 'Trung bình': 'Average' };
const letters = new Set(['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'P', 'NA']);

function text(html) {
  const entities = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return html.replace(/<[^>]*>/g, '').replace(/&(#x[\da-f]+|#\d+|nbsp|amp|lt|gt|quot|apos);/gi, (_, entity) => {
    if (entity[0] !== '#') return entities[entity.toLowerCase()];
    const hex = entity[1].toLowerCase() === 'x';
    return String.fromCodePoint(parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
  }).replace(/\s+/g, ' ').trim().normalize('NFC');
}

function number(value, label) {
  if (['', '–', '-', 'P', 'NA'].includes(value)) return null;
  if (!/^\d+(?:[.,]\d+)?$/.test(value)) throw new Error(`Invalid numeric value in ${label}`);
  const parsed = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsed)) throw new Error(`Invalid numeric value in ${label}`);
  return parsed;
}

export function parseTranscript(source, existing = {}) {
  if (source[0] !== 0xff || source[1] !== 0xfe) throw new Error('Expected a BOM-prefixed UTF-16LE HTML grade export');
  const html = new TextDecoder('utf-16le', { fatal: true }).decode(source);
  const semesters = [];
  let semester;
  let headerSeen = false;
  for (const [, attributes, body] of html.matchAll(/<tr\b([^>]*)>([\s\S]*?)<\/tr\s*>/gi)) {
    const classes = attributes.match(/\bclass\s*=\s*["']([^"']*)["']/i)?.[1].split(/\s+/) ?? [];
    const cells = [...body.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]\s*>/gi)].map(([, cell]) => text(cell));
    if (classes.includes('title-diem')) {
      if (cells.length !== columns.length || cells.some((cell, index) => cell !== columns[index])) {
        throw new Error('Unexpected transcript header; review the portal column mapping before importing');
      }
      headerSeen = true;
    } else if (classes.includes('title-hk-diem')) {
      if (!headerSeen) throw new Error('Semester appears before the transcript header');
      const title = cells[0]?.match(/^Học kỳ (\d+)\s*-\s*Năm học (\d{4}-\d{4})$/);
      if (!title) throw new Error('Unrecognized semester title');
      const term = Number(title[1]);
      const year = title[2];
      const id = `${year}-${term}`;
      if (semesters.some((entry) => entry.id === id)) throw new Error(`Duplicate semester ${id}`);
      semester = { id, label: `Semester ${term} · ${year.replace('-', '–')}`, term, year, courses: [], summary: null };
      semesters.push(semester);
    } else if (classes.includes('row-diem')) {
      if (!semester || cells.length !== columns.length) throw new Error('Course row has no semester or an unexpected column count');
      // Unissued, entirely blank result rows are not published grades. Explicit P/NA rows stay.
      if (cells.slice(7).every((cell) => cell === '')) continue;
      const letter = cells[13];
      if (!letters.has(letter)) throw new Error(`Missing or unsupported final letter grade for ${cells[1]}`);
      const credits = number(cells[3], 'credits');
      if (!cells[1] || !cells[2] || credits === null) throw new Error('Course identity or credits missing');
      if (semester.courses.some((course) => course.code === cells[1])) throw new Error(`Duplicate course ${cells[1]} in ${semester.id}`);
      const nonNumeric = letter === 'P' || letter === 'NA';
      semester.courses.push({
        code: cells[1], name: cells[2], credits,
        weights: { coursework: number(cells[4], '% QT'), midterm: number(cells[5], '% KT'), final: number(cells[6], '% Thi') },
        scores: {
          coursework: nonNumeric ? null : number(cells[7], 'coursework'),
          midterm: nonNumeric ? null : number(cells[8], 'midterm'),
          final: nonNumeric ? null : number(cells[9], 'final'),
        },
        total10: nonNumeric ? null : number(cells[11], 'final total'), letter,
      });
    } else if (classes.includes('row-diemTK')) {
      if (!semester || cells.length !== 1) throw new Error('Summary row has no semester or an unexpected cell count');
      const separator = cells[0].indexOf(':');
      const label = cells[0].slice(0, separator).trim();
      const value = cells[0].slice(separator + 1).trim();
      const field = summaryFields[label];
      if (separator < 0 || !field) throw new Error('Unrecognized semester summary field');
      semester.summary ??= Object.fromEntries(Object.values(summaryFields).map((name) => [name, null]));
      if (field === 'standing') {
        if (!standings[value]) throw new Error('Unrecognized academic standing; add its English translation');
        semester.summary.standing = standings[value];
      } else semester.summary[field] = number(value, label);
    }
  }
  const published = semesters.filter((entry) => entry.courses.length > 0);
  if (!headerSeen || !published.length) throw new Error('No transcript header or published semester results found');
  published.sort((a, b) => a.year.localeCompare(b.year) || a.term - b.term);
  const today = new Date();
  return {
    updated: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    program: 'BSc Data Science', school: 'International University, VNU-HCM',
    creditsRequired: existing.creditsRequired ?? 135, semesters: published,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const input = process.argv[2] ? resolve(process.argv[2]) : new URL('../.transcript-source/DiemSinhVien.xls', import.meta.url);
  // The portal export has no degree requirement; retain Line's configured total on refresh.
  const output = new URL('../content/transcript.json', import.meta.url);
  let existing = {};
  try {
    existing = JSON.parse(readFileSync(output, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const transcript = parseTranscript(readFileSync(input), existing);
  writeFileSync(output, `${JSON.stringify(transcript, null, 2)}\n`);
  console.log(`Imported ${transcript.semesters.reduce((sum, semester) => sum + semester.courses.length, 0)} courses across ${transcript.semesters.length} semesters into content/transcript.json`);
}
