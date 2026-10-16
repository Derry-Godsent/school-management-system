import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { getGrade } from '../../../data';
import { formatDate, markedWork, pendingWork } from '../../../data/portal';
import { useWard } from '../PortalShell';
import {
  Card, CardBody, CardHead, Chip, Delta, Meter, Row, StatTile, gradeNote, scoreTone,
} from '../ui';

export function GradesScreen() {
  const { child, profile, klass, average, standing, best, weakest } = useWard();
  const [showAll, setShowAll] = useState(false);

  if (!child || !profile || !klass) return null;

  const marked = markedWork(child.id);
  const due = pendingWork(child.id);
  const subjects = showAll ? profile.subjects : profile.subjects.slice(0, 5);
  const reports = profile.reports;
  const highest = Math.max(...reports.map(report => report.average), 1);

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink">Grades</h1>
        <p className="mt-1 text-[0.8125rem] text-ink-mute">
          {child.name} · {klass.name} · Second Term
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Average" value={average.toFixed(1)} note={getGrade(average).remark} tone="purple" />
        <StatTile label="Position" value={`${standing.rank}/${standing.size}`} note="In the class" tone="green" />
        <StatTile label="Subjects" value={profile.subjects.length} note="All marked" tone="orange" />
        <StatTile label="Due" value={due.length} note={due.length ? formatDate(due[0].date) : 'Nothing'} tone="yellow" />
      </div>

      {/* best and weakest, side by side, as two colour blocks */}
      <div className="grid gap-4 sm:grid-cols-2">
        {best ? (
          <Card tone="green" shape="solid">
            <CardBody>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-green-deep">Strongest</p>
              <p className="mt-1.5 font-display text-xl text-ink">{best.subject}</p>
              <p className="mt-1 font-display text-3xl leading-none text-green-deep">{best.score}</p>
              <p className="mt-2 text-[0.8125rem] text-ink-mute">
                Position {best.position} · class average {best.classAverage}
              </p>
            </CardBody>
          </Card>
        ) : null}
        {weakest ? (
          <Card tone="orange" shape="solid">
            <CardBody>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">Weakest</p>
              <p className="mt-1.5 font-display text-xl text-ink">{weakest.subject}</p>
              <p className="mt-1 font-display text-3xl leading-none text-gold-deep">{weakest.score}</p>
              <p className="mt-2 text-[0.8125rem] text-ink-mute">
                Position {weakest.position} · class average {weakest.classAverage}
              </p>
            </CardBody>
          </Card>
        ) : null}
      </div>

      {/* ------------------------------------------------------- subject cards */}
      <Card shape="top" tone="purple">
        <CardBody>
          <CardHead
            eyebrow="Subject by subject"
            title="Marks against the class"
            action={
              <button
                type="button"
                onClick={() => setShowAll(value => !value)}
                className="rounded-lg bg-purple px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-paper"
              >
                {showAll ? 'Fewer' : `All ${profile.subjects.length}`}
              </button>
            }
          />
          <ul className="space-y-3">
            {subjects.map(subject => {
              const tone = scoreTone(subject.score);
              return (
                <li key={subject.subject} className="rounded-xl bg-cream px-3.5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[0.875rem] font-medium text-ink">{subject.subject}</p>
                      <p className="mt-0.5 truncate text-[0.75rem] text-ink-mute">{subject.teacher}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple text-[0.8125rem] font-bold text-paper">
                        {subject.score}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Meter value={subject.score} tone={tone} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Chip tone="plain">Pos {subject.position}</Chip>
                    <Chip tone="plain">Class {subject.classAverage}</Chip>
                    <Delta from={subject.previous} to={subject.score} />
                  </div>
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>

      {/* ------------------------------------------------------- marked and due */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card shape="top" tone="green">
          <CardBody>
            <CardHead eyebrow="Marked work" title={`${marked.length} pieces returned`} />
            <ul className="space-y-2.5">
              {marked.map(work => {
                const percent = work.score === null ? 0 : Math.round((work.score / work.outOf) * 100);
                const good = percent >= 70;
                return (
                  <li key={work.title} className="flex items-start gap-3 rounded-xl bg-cream px-3 py-2.5">
                    <span className="mt-0.5">
                      {good ? (
                        <CheckCircle2 size={17} className="text-green-deep" aria-hidden="true" />
                      ) : (
                        <Clock size={17} className="text-gold-deep" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.8125rem] font-medium text-ink">{work.title}</span>
                      <span className="block text-[0.75rem] text-ink-mute">
                        {work.subject} · {work.type} · {formatDate(work.date)}
                      </span>
                    </span>
                    <span className={`shrink-0 rounded-lg px-2 py-1 text-[0.75rem] font-bold ${good ? 'bg-green text-ink' : 'bg-gold text-ink'}`}>
                      {percent}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>

        <Card shape="top" tone="yellow">
          <CardBody>
            <CardHead eyebrow="Still to come" title={due.length ? `${due.length} pieces due` : 'Nothing due'} />
            {due.length ? (
              <ul className="space-y-2.5">
                {due.map(work => (
                  <li key={work.title} className="rounded-xl bg-cream px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-[0.8125rem] font-medium text-ink">{work.title}</span>
                        <span className="block text-[0.75rem] text-ink-mute">
                          {work.subject} · out of {work.outOf}
                        </span>
                      </span>
                      <Chip tone="yellow" solid>
                        {formatDate(work.date)}
                      </Chip>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[0.875rem] text-ink-mute">Every piece has been handed in.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* ------------------------------------------------------- the trend, as bars */}
      <Card shape="top">
        <CardBody>
          <CardHead
            eyebrow="Term by term"
            title={`${reports[reports.length - 1]?.average.toFixed(1)} this term`}
            action={
              <Link
                to="/parent/class"
                className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-green-deep"
              >
                Who teaches <ArrowRight size={13} aria-hidden="true" />
              </Link>
            }
          />
          <div className="flex items-end gap-4">
            {reports.map(report => (
              <div key={report.term} className="flex-1">
                <div className="flex h-28 items-end rounded-lg bg-cream">
                  <div
                    className="w-full rounded-lg bg-purple"
                    style={{ height: `${(report.average / highest) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 font-display text-lg text-ink">{report.average.toFixed(1)}</p>
                <p className="text-[0.75rem] text-ink-mute">{report.term}</p>
              </div>
            ))}
          </div>
          <dl className="mt-2">
            <Row label="Grade remark">{gradeNote(average)}</Row>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}

export default GradesScreen;
