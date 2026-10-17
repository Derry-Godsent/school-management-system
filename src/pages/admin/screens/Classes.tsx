import { useState } from 'react';
import { BookOpen, CalendarCheck, Clock, MapPin, Users } from 'lucide-react';
import { classInfo } from '../../../data/portal';
import { classSummary, rollWithFees } from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Avatar, Badge, Button, Card, CardHead, CardPad, Drawer, Kpi, Meter, PageHead, Row,
} from '../ui';

/**
 * Classes.
 *
 * A school is organised by class long before it is organised by module, so this
 * screen is a card per class: who leads it, who teaches in it, how big it is,
 * how the term is going, and what is on today. A head teacher opens a card to
 * see the teaching team; a form teacher opens the same card and finds the way
 * into the register.
 */
export function ClassesScreen() {
  const { auth } = useStaffAuth();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!auth) return null;

  const open = classSummary.find(klass => klass.id === openId) ?? null;
  const info = open ? classInfo[open.id] : null;

  return (
    <div className="space-y-5">
      <PageHead
        title="Classes"
        sub="Who teaches what, and how the term is going"
        actions={<Badge tone="green">{classSummary.length} classes</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {classSummary.map(klass => (
          <Card key={klass.id}>
            <CardPad>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[1.125rem] font-semibold text-ink">{klass.name}</h2>
                  <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                    {klass.room} · {klass.pupils} pupils
                  </p>
                </div>
                <Badge tone={klass.termAttendance >= 95 ? 'green' : 'yellow'}>{klass.termAttendance}% attendance</Badge>
              </div>

              <div className="mt-3.5 flex items-center gap-3 rounded-2xl bg-canvas px-3.5 py-2.5">
                <Avatar name={klass.formTeacher.name} size="sm" tone="green" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium text-ink">{klass.formTeacher.name}</p>
                  <p className="text-[0.6875rem] text-ink-mute">Form teacher</p>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2">
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.08em] text-ink-mute">Average</dt>
                  <dd className="mt-0.5 text-[1rem] font-semibold tabular-nums text-ink">{klass.average.toFixed(1)}</dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.08em] text-ink-mute">In today</dt>
                  <dd className="mt-0.5 text-[1rem] font-semibold tabular-nums text-ink">
                    {klass.presentToday}/{klass.pupils}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.08em] text-ink-mute">Subjects</dt>
                  <dd className="mt-0.5 text-[1rem] font-semibold tabular-nums text-ink">{klass.subjects}</dd>
                </div>
              </dl>

              <div className="mt-3">
                <Meter value={klass.presentToday} max={klass.pupils} tone="green" />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button tone="plain" onClick={() => setOpenId(klass.id)}>
                  Open the class
                </Button>
                <Button to="/admin/attendance" tone="green">
                  Register
                </Button>
              </div>
            </CardPad>
          </Card>
        ))}
      </div>

      <Card>
        <CardHead title="Today's timetable" sub="Both classes, period by period" icon={Clock} tone="orange" />
        <ul>
          {classSummary.flatMap(klass =>
            classInfo[klass.id].todayLessons.map((lesson, index) => (
              <li key={`${klass.id}-${lesson.time}`} className="border-t border-rule first:border-0">
                <Row
                  icon={BookOpen}
                  tone={index % 2 === 0 ? 'orange' : 'purple'}
                  title={`${lesson.subject} · ${klass.name}`}
                  sub={`${lesson.time} · ${lesson.teacher} · ${lesson.room}`}
                />
              </li>
            ))
          )}
        </ul>
      </Card>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open ? `${open.name} · ${open.room}` : 'Class'} wide>
        {open && info ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">{open.pupils} pupils</Badge>
              <Badge tone="purple">{open.average.toFixed(1)} average</Badge>
              <Badge tone="orange">{open.termAttendance}% this term</Badge>
            </div>

            <div className="rounded-2xl bg-tint-green px-4 py-3">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-green-deep">Form teacher</p>
              <div className="mt-2 flex items-center gap-3">
                <Avatar name={open.formTeacher.name} tone="green" />
                <div className="min-w-0">
                  <p className="truncate text-[0.875rem] font-medium text-ink">{open.formTeacher.name}</p>
                  <p className="text-[0.75rem] text-ink-mute">{open.formTeacher.email}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">
                Subject teachers
              </p>
              <ul className="space-y-1.5">
                {[info.formTeacher, ...info.subjectTeachers].map(teacher => (
                  <li key={teacher.name} className="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2">
                    <Avatar name={teacher.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.8125rem] font-medium text-ink">{teacher.name}</span>
                      <span className="block text-[0.6875rem] text-ink-mute">{teacher.subject ?? 'Form teacher'}</span>
                    </span>
                    <a
                      href={`tel:${teacher.phone.replace(/\s/g, '')}`}
                      className="inline-flex min-h-[2.25rem] items-center rounded-full bg-paper px-3 text-[0.6875rem] font-semibold text-ink"
                    >
                      Call
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">
                Today, period by period
              </p>
              <ul className="space-y-1.5">
                {info.todayLessons.map(lesson => (
                  <li key={lesson.time} className="flex items-start gap-3 rounded-xl bg-canvas px-3 py-2">
                    <span className="w-11 shrink-0 text-[0.75rem] font-semibold tabular-nums text-ink">{lesson.time}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.8125rem] font-medium text-ink">{lesson.subject}</span>
                      <span className="block truncate text-[0.6875rem] text-ink-mute">
                        {lesson.teacher} · {lesson.room}
                      </span>
                    </span>
                    <MapPin size={14} className="mt-1 shrink-0 text-ink-mute" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-tint-orange px-4 py-3">
              <p className="text-[0.8125rem] leading-relaxed text-ink">
                {rollWithFees.filter(pupil => pupil.classId === open.id).filter(pupil => pupil.duty).length} pupils
                in this class hold a duty, and the parent app shows a short profile for each of them.
              </p>
            </div>
          </div>
        ) : null}
      </Drawer>

      <p className="flex items-center gap-2 text-[0.75rem] text-ink-mute">
        <Users size={14} aria-hidden="true" />
        {rollWithFees.length} pupils across both classes.
        <CalendarCheck size={14} aria-hidden="true" /> Registers open at 7:30.
      </p>
    </div>
  );
}

export default ClassesScreen;
