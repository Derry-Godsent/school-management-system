import { useMemo, useState } from 'react';
import { CalendarCheck, CheckCircle2, Clock, Save, UserX, Users } from 'lucide-react';
import { formatLongDate } from '../../../data/portal';
import { DEMO_TODAY, attendanceToday, can, registerFor } from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Avatar, Badge, Button, Card, CardHead, CardPad, Kpi, Meter, PageHead, SavedNote, Segmented,
} from '../ui';

/**
 * The register.
 *
 * This is the screen a form teacher uses twice a day, so it is built for speed:
 * one row per pupil, three states, one save. Every pupil starts as present,
 * because that is what is true of almost everyone almost every day, and the
 * teacher only marks the exceptions.
 *
 * Saving it is the moment the product exists for. The note afterwards says how
 * many families just received the change, not that a record was updated.
 */

type Mark = 'present' | 'late' | 'absent';

const MARKS: { value: Mark; label: string; icon: typeof CheckCircle2; tone: string }[] = [
  { value: 'present', label: 'Present', icon: CheckCircle2, tone: 'bg-green text-ink' },
  { value: 'late', label: 'Late', icon: Clock, tone: 'bg-yellow text-ink' },
  { value: 'absent', label: 'Away', icon: UserX, tone: 'bg-gold text-ink' },
];

export function AttendanceScreen() {
  const { auth } = useStaffAuth();
  const [classId, setClassId] = useState<'jhs2' | 'p5'>('jhs2');
  const [session, setSession] = useState<'Morning' | 'Afternoon'>('Morning');
  const [saved, setSaved] = useState(false);

  if (!auth) return null;
  const mayMark = can(auth.role, 'attendance', 'edit');

  const roster = useMemo(() => registerFor(classId), [classId]);
  const [marks, setMarks] = useState<Record<string, Mark>>({});

  const resolved = roster.map(pupil => ({ ...pupil, mark: marks[pupil.id] ?? (pupil.today as Mark) }));
  const present = resolved.filter(pupil => pupil.mark === 'present').length;
  const late = resolved.filter(pupil => pupil.mark === 'late').length;
  const away = resolved.filter(pupil => pupil.mark === 'absent').length;

  const total = attendanceToday.reduce((sum, klass) => sum + klass.presentToday, 0);
  const all = attendanceToday.reduce((sum, klass) => sum + klass.pupils, 0);

  return (
    <div className="space-y-5">
      <PageHead
        title="Register"
        sub={`${formatLongDate(DEMO_TODAY)} · ${session.toLowerCase()} session`}
        actions={<Badge tone={saved ? 'green' : 'orange'}>{saved ? 'Saved, and live' : 'Not saved yet'}</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Users} tone="purple" label="In school" value={total} note={`of ${all} on roll`} />
        <Kpi icon={CheckCircle2} tone="green" label="Present here" value={present} note={`${classId === 'jhs2' ? 'JHS 2' : 'Primary 5'}, ${session.toLowerCase()}`} />
        <Kpi icon={Clock} tone="yellow" label="Late" value={late} note="Arrived after the bell" />
        <Kpi icon={UserX} tone="orange" label="Away" value={away} note={away ? 'Follow up today' : 'Nobody absent'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHead
            title={`${classId === 'jhs2' ? 'JHS 2' : 'Primary 5'} register`}
            sub="Everyone starts present. Mark only the exceptions."
            icon={CalendarCheck}
            tone="green"
          />
          <div className="flex flex-col gap-2 px-4 pb-3 sm:flex-row sm:items-center sm:px-5">
            <Segmented options={['jhs2', 'p5'] as const} value={classId} onChange={setClassId} label="Choose a class" />
            <Segmented options={['Morning', 'Afternoon'] as const} value={session} onChange={setSession} label="Choose a session" />
          </div>

          <ul className="border-t border-rule">
            {resolved.map(pupil => (
              <li key={pupil.id} className="flex flex-wrap items-center gap-2 border-b border-rule px-4 py-2.5 last:border-0 sm:px-5">
                <Avatar name={pupil.name} size="sm" tone={pupil.mark === 'absent' ? 'orange' : undefined} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-medium text-ink">{pupil.name}</p>
                  <p className="text-[0.6875rem] text-ink-mute">
                    {pupil.admissionNo}
                    {pupil.duty ? ` · ${pupil.duty}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {MARKS.map(mark => {
                    const Icon = mark.icon;
                    const on = pupil.mark === mark.value;
                    return (
                      <button
                        key={mark.value}
                        type="button"
                        disabled={!mayMark}
                        onClick={() => setMarks(current => ({ ...current, [pupil.id]: mark.value }))}
                        aria-pressed={on}
                        aria-label={`${pupil.name}: ${mark.label}`}
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                          on ? mark.tone : 'bg-canvas text-ink-mute'
                        } ${!mayMark ? 'opacity-100' : ''}`}
                      >
                        <Icon size={17} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-4 py-3 sm:px-5">
            <p className="text-[0.75rem] text-ink-mute">
              {present} present · {late} late · {away} away
            </p>
            {mayMark ? (
              <Button icon={Save} tone="green" onClick={() => setSaved(true)}>
                Save the register
              </Button>
            ) : (
              <p className="text-[0.75rem] text-ink-mute">Your role can read the register but not mark it.</p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          {saved ? (
            <SavedNote
              families={resolved.length}
              what={`The ${classId === 'jhs2' ? 'JHS 2' : 'Primary 5'} ${session.toLowerCase()} register is saved, and the ${away} absence${away === 1 ? '' : 's'} went to the home.`}
              onReset={() => setSaved(false)}
            />
          ) : null}

          <Card>
            <CardHead title="The whole school" sub="Today, by class" icon={Users} tone="purple" />
            <div className="space-y-3 px-4 pb-4 sm:px-5">
              {attendanceToday.map(klass => (
                <div key={klass.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[0.8125rem] font-medium text-ink">{klass.name}</span>
                    <span className="text-[0.75rem] tabular-nums text-ink-mute">
                      {klass.presentToday} of {klass.pupils} · {klass.rate}%
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Meter value={klass.presentToday} max={klass.pupils} tone={klass.rate >= 90 ? 'green' : 'yellow'} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card tone="orange">
            <CardPad>
              <p className="text-[0.8125rem] leading-relaxed text-ink">
                Every absence reaches the parent app with the register, so a family knows before the
                pupil is home. No phone call to the office and no note in a bag.
              </p>
            </CardPad>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AttendanceScreen;
