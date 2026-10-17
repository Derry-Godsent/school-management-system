import { useState } from 'react';
import { CheckCircle2, Clock, GraduationCap, Layers, TrendingUp } from 'lucide-react';
import { getGrade } from '../../../data';
import { formatDate, markedWork, pendingWork } from '../../../data/portal';
import { useWard } from '../PortalShell';
import {
  Card, CardPad, Chip, Delta, IconChip, Meter, Rule, ScreenTitle, Segmented, StatCard, gradeNote, scoreTone,
} from '../ui';

const VIEWS = ['All subjects', 'Term by term', 'Work'] as const;

export function GradesScreen() {
  const { child, profile, klass, average, standing, best, weakest } = useWard();
  const [view, setView] = useState<(typeof VIEWS)[number]>('All subjects');

  if (!child || !profile || !klass) return null;

  const marked = markedWork(child.id);
  const due = pendingWork(child.id);
  const reports = profile.reports;
  const highest = Math.max(...reports.map(report => report.average), 1);

  return (
    <div className="space-y-5">
      <ScreenTitle title="Grades" sub={`${child.name} · ${klass.name} · Second Term`} />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Average" value={average.toFixed(1)} note={getGrade(average).remark} tone="purple" />
        <StatCard icon={TrendingUp} label="Position" value={`${standing.rank}/${standing.size}`} note="In the class" tone="green" />
        <StatCard icon={Layers} label="Subjects" value={profile.subjects.length} note="All marked" tone="orange" />
        <StatCard icon={Clock} label="Due" value={due.length} note={due.length ? formatDate(due[0].date) : 'Nothing'} tone="yellow" />
      </div>

      {/* best and weakest, as two soft cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {best ? (
          <Card variant="tint" tone="green">
            <CardPad>
              <Chip tone="green">Best performing</Chip>
              <p className="mt-2 text-[0.9375rem] font-medium text-ink">{best.subject}</p>
              <p className="mt-1 text-[2rem] font-semibold leading-none tabular-nums text-green-deep">{best.score}</p>
              <p className="mt-2 text-[0.75rem] text-ink-mute">
                Position {best.position} of {standing.size} · class average {best.classAverage}
              </p>
              <div className="mt-3">
                <Meter value={best.score} tone="green" />
              </div>
            </CardPad>
          </Card>
        ) : null}
        {weakest ? (
          <Card variant="tint" tone="orange">
            <CardPad>
              <Chip tone="orange">Lowest performing</Chip>
              <p className="mt-2 text-[0.9375rem] font-medium text-ink">{weakest.subject}</p>
              <p className="mt-1 text-[2rem] font-semibold leading-none tabular-nums text-gold-deep">{weakest.score}</p>
              <p className="mt-2 text-[0.75rem] text-ink-mute">
                Position {weakest.position} of {standing.size} · class average {weakest.classAverage}
              </p>
              <div className="mt-3">
                <Meter value={weakest.score} tone="orange" />
              </div>
            </CardPad>
          </Card>
        ) : null}
      </div>

      <Segmented options={VIEWS} value={view} onChange={setView} label="Grade views" />

      {/* ------------------------------------------------- subject by subject */}
      {view === 'All subjects' ? (
        <Card>
          <CardPad>
            <ul className="space-y-3">
              {profile.subjects.map(subject => (
                <li key={subject.subject} className="rounded-2xl bg-canvas px-3.5 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[0.875rem] font-medium text-ink">{subject.subject}</p>
                      <p className="mt-0.5 truncate text-[0.75rem] text-ink-mute">{subject.teacher}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Delta from={subject.previous} to={subject.score} />
                      <span
                        className={`flex h-9 w-11 items-center justify-center rounded-xl text-[0.875rem] font-semibold tabular-nums ${
                          scoreTone(subject.score) === 'green'
                            ? 'bg-tint-green text-green-deep'
                            : scoreTone(subject.score) === 'orange'
                              ? 'bg-tint-orange text-gold-deep'
                              : scoreTone(subject.score) === 'yellow'
                                ? 'bg-tint-yellow text-yellow-deep'
                                : 'bg-tint-purple text-purple-deep'
                        }`}
                      >
                        {subject.score}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <Meter value={subject.score} tone={scoreTone(subject.score)} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Chip tone="plain">Pos {subject.position}</Chip>
                    <Chip tone="plain">Class {subject.classAverage}</Chip>
                  </div>
                </li>
              ))}
            </ul>
          </CardPad>
        </Card>
      ) : null}

      {/* ------------------------------------------------- term by term */}
      {view === 'Term by term' ? (
        <Card>
          <CardPad>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-mute">
              Average each term
            </p>
            <div className="mt-4 flex items-end gap-4">
              {reports.map(report => (
                <div key={report.term} className="flex-1">
                  <div className="flex h-32 items-end overflow-hidden rounded-2xl bg-canvas">
                    <div
                      className="w-full rounded-2xl bg-purple"
                      style={{ height: `${(report.average / highest) * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2 text-[1.0625rem] font-semibold tabular-nums text-ink">
                    {report.average.toFixed(1)}
                  </p>
                  <p className="text-[0.75rem] text-ink-mute">{report.term}</p>
                  <p className="text-[0.6875rem] text-ink-mute">
                    {report.position} of {report.size}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.8125rem] text-ink-mute">
              This term so far: {average.toFixed(1)}, {gradeNote(average)}.
            </p>
          </CardPad>
        </Card>
      ) : null}

      {/* ------------------------------------------------- work marked and due */}
      {view === 'Work' ? (
        <div className="space-y-3">
          <Card>
            <CardPad>
              <div className="mb-2 flex items-center gap-2.5">
                <IconChip icon={CheckCircle2} tone="green" size="sm" />
                <h2 className="text-[0.9375rem] font-semibold text-ink">
                  {marked.length} pieces returned
                </h2>
              </div>
              <ul className="space-y-2">
                {marked.map(work => {
                  const percent = work.score === null ? 0 : Math.round((work.score / work.outOf) * 100);
                  const good = percent >= 70;
                  return (
                    <li key={work.title} className="flex items-center gap-3 rounded-2xl bg-canvas px-3.5 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.875rem] font-medium text-ink">{work.title}</span>
                        <span className="block text-[0.75rem] text-ink-mute">
                          {work.subject} · {work.type} · {formatDate(work.date)}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-xl px-2.5 py-1.5 text-[0.8125rem] font-semibold tabular-nums ${
                          good ? 'bg-tint-green text-green-deep' : 'bg-tint-orange text-gold-deep'
                        }`}
                      >
                        {percent}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardPad>
          </Card>

          <Card>
            <CardPad>
              <div className="mb-2 flex items-center gap-2.5">
                <IconChip icon={Clock} tone="yellow" size="sm" />
                <h2 className="text-[0.9375rem] font-semibold text-ink">
                  {due.length ? `${due.length} pieces due` : 'Nothing due'}
                </h2>
              </div>
              {due.length ? (
                <div className="-mx-4">
                  {due.map((work, index) => (
                    <div key={work.title}>
                      {index > 0 ? <Rule /> : null}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.875rem] font-medium text-ink">{work.title}</span>
                          <span className="block text-[0.75rem] text-ink-mute">
                            {work.subject} · out of {work.outOf}
                          </span>
                        </span>
                        <Chip tone="yellow">{formatDate(work.date)}</Chip>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[0.8125rem] text-ink-mute">Every piece has been handed in.</p>
              )}
            </CardPad>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

export default GradesScreen;
