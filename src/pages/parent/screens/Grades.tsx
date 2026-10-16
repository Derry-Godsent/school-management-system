import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Phone } from 'lucide-react';
import { getGrade } from '../../../data';
import { formatDate, formatLongDate, markedWork, pendingWork } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Badge, Callout, Eyebrow, Meter, SectionHead, Stat, Delta, gradeNote, scoreTone } from '../ui';

/**
 * Grades: the whole academic picture for one ward in one place.
 *
 * The subject list carries the three things a parent needs side by side: what
 * their child scored, what the class scored, and where the child sits in it.
 * A score on its own says very little, because a 74 in a subject the class
 * averaged 68 in is a good result and a 74 in a subject the class averaged 82
 * in is not.
 */
export function GradesScreen() {
  const { child, profile, klass, average, standing, best, weakest } = useWard();
  const [showAll, setShowAll] = useState(false);

  if (!child || !profile || !klass) return null;

  const marked = markedWork(child.id);
  const due = pendingWork(child.id);
  const subjects = showAll ? profile.subjects : profile.subjects.slice(0, 6);
  const grade = getGrade(average);
  const reports = profile.reports;
  const highest = Math.max(...reports.map(report => report.average), 1);

  return (
    <div className="space-y-10">
      <section>
        <Eyebrow>Grades</Eyebrow>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          {child.name} · {klass.name}
        </h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-mute">
          Second Term, 2025/2026. Marks appear here as teachers enter them, so the picture fills in
          during the term rather than at the end of it.
        </p>
      </section>

      {/* The headline, then the two subjects that matter most to a parent. */}
      <section>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Term average" value={average.toFixed(1)} note={gradeNote(average)} tone="green" />
          <Stat label="Position" value={`${standing.rank} of ${standing.size}`} note="In the class" tone="purple" />
          <Stat label="Subjects taken" value={profile.subjects.length} note="All marked this term" />
          <Stat label="Work due" value={due.length} note={due.length ? `Next on ${formatDate(due[0].date)}` : 'Nothing outstanding'} tone="orange" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {best ? (
          <Callout tone="green" title="Best performing subject">
            <p className="font-display text-xl text-ink">
              {best.subject} <span className="text-green-deep">{best.score}</span>
            </p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-mute">
              Position {best.position} of {standing.size}, class average {best.classAverage}. {best.teacher}
            </p>
          </Callout>
        ) : null}
        {weakest ? (
          <Callout tone="orange" title="Lowest performing subject">
            <p className="font-display text-xl text-ink">
              {weakest.subject} <span className="text-gold-deep">{weakest.score}</span>
            </p>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-mute">
              Position {weakest.position} of {standing.size}, class average {weakest.classAverage}.{' '}
              {weakest.teacher}
            </p>
          </Callout>
        ) : null}
      </section>

      {/* ------------------------------------------------------- subject by subject */}
      <section>
        <SectionHead
          eyebrow="Subject by subject"
          title="Marks, and how they compare"
          action={
            <button
              type="button"
              onClick={() => setShowAll(value => !value)}
              className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-gold-deep"
            >
              {showAll ? 'Show fewer' : `All ${profile.subjects.length} subjects`}
            </button>
          }
        />
        <ul className="bg-paper">
          {subjects.map(subject => (
            <li key={subject.subject} className="border-b border-rule px-4 py-4 last:border-b-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium text-ink">{subject.subject}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
                    {subject.teacher} · position {subject.position} of {standing.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl leading-none text-ink">{subject.score}</p>
                  <p className="mt-1 text-[0.75rem] text-ink-mute">{getGrade(subject.score).remark}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-mute">
                    Your child
                  </span>
                  <Meter value={subject.score} tone={scoreTone(subject.score)} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-[0.6875rem] uppercase tracking-[0.12em] text-ink-mute">
                    Class average
                  </span>
                  <Meter value={subject.classAverage} tone="plain" />
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                <Delta from={subject.previous} to={subject.score} />
                <span className="text-[0.75rem] text-ink-mute">
                  {subject.score >= subject.classAverage
                    ? `${subject.score - subject.classAverage} above the class average`
                    : `${subject.classAverage - subject.score} below the class average`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------- work marked, work due */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="Assignments and quizzes" title="Marked work" note="The most recent work the teachers have returned." />
          <ul className="bg-paper">
            {marked.map(work => {
              const percent = work.score === null ? 0 : Math.round((work.score / work.outOf) * 100);
              const good = percent >= 70;
              return (
                <li key={work.title} className="flex items-start gap-3 border-b border-rule px-4 py-3.5 last:border-b-0">
                  {good ? (
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-green-deep" aria-hidden="true" />
                  ) : (
                    <Clock size={17} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.875rem] font-medium text-ink">{work.title}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
                      {work.subject} · {work.type} · {formatDate(work.date)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-lg leading-none text-ink">{percent}%</p>
                    <p className="mt-1 text-[0.6875rem] text-ink-mute">
                      {work.score} of {work.outOf}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <SectionHead eyebrow="Still to come" title="Work due" note="Pieces with a date ahead of them, so nothing arrives unannounced." />
          {due.length ? (
            <ul className="bg-paper">
              {due.map(work => (
                <li key={work.title} className="border-b border-rule px-4 py-3.5 last:border-b-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="purple">{work.type}</Badge>
                    <span className="text-[0.75rem] text-ink-mute">Due {formatLongDate(work.date)}</span>
                  </div>
                  <p className="mt-2 text-[0.875rem] font-medium text-ink">{work.title}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
                    {work.subject} · marked out of {work.outOf}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] text-ink-mute">
                    Class teacher: {profile.subjects.find(subject => subject.subject === work.subject)?.teacher}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="bg-paper px-4 py-4 text-[0.875rem] text-ink-mute">Nothing outstanding.</p>
          )}
          <Link
            to="/parent/class"
            className="mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-green-deep"
          >
            See who teaches what <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------- who teaches what */}
      <section>
        <SectionHead eyebrow={`${klass.name} staff`} title="Who teaches your child" note="Every subject teacher, with a number to call." />
        <ul className="grid gap-px bg-rule sm:grid-cols-2">
          <li className="bg-paper px-4 py-3.5">
            <Badge tone="ink">Form teacher</Badge>
            <p className="mt-2 text-[0.875rem] font-medium text-ink">{klass.formTeacher.name}</p>
            <a
              href={`tel:${klass.formTeacher.phone.replace(/\s/g, '')}`}
              className="mt-1 inline-flex items-center gap-1.5 text-[0.8125rem] text-gold-deep"
            >
              <Phone size={13} aria-hidden="true" /> {klass.formTeacher.phone}
            </a>
          </li>
          {klass.subjectTeachers.map(teacher => (
            <li key={teacher.subject ?? teacher.name} className="bg-paper px-4 py-3.5">
              <Badge tone="plain">{teacher.subject}</Badge>
              <p className="mt-2 text-[0.875rem] font-medium text-ink">{teacher.name}</p>
              <a
                href={`tel:${teacher.phone.replace(/\s/g, '')}`}
                className="mt-1 inline-flex items-center gap-1.5 text-[0.8125rem] text-gold-deep"
              >
                <Phone size={13} aria-hidden="true" /> {teacher.phone}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------- the trend */}
      <section>
        <SectionHead eyebrow="Term by term" title="How the year is going" note="The average for each term so far this year." />
        <div className="bg-paper px-4 py-5">
          <div className="flex items-end gap-6">
            {reports.map(report => (
              <div key={report.term} className="flex-1">
                <div className="flex h-32 items-end bg-cream">
                  <div
                    className="w-full bg-gold"
                    style={{ height: `${(report.average / highest) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 font-display text-lg text-ink">{report.average.toFixed(1)}</p>
                <p className="text-[0.8125rem] text-ink-mute">{report.term}</p>
                <p className="text-[0.75rem] text-ink-mute">
                  {report.position} of {report.size} in class
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default GradesScreen;
