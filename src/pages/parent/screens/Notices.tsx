import { useState } from 'react';
import { Bell, CalendarDays, Pin, Users } from 'lucide-react';
import { formatDate, formatLongDate, noticesFor, type Notice } from '../../../data/portal';
import { asParentNotice, useLive } from '../../../data/live';
import { useWard } from '../PortalShell';
import { Card, CardPad, Chip, IconChip, ScreenTitle, Segmented, Sheet, StatCard } from '../ui';
import type { Tone } from '../ui';

const FILTERS = ['All', 'School', 'Class', 'Teacher', 'Fees'] as const;
type Filter = (typeof FILTERS)[number];

const AUDIENCE_TONE: Record<string, Tone> = {
  School: 'orange',
  Class: 'green',
  Teacher: 'purple',
  Fees: 'yellow',
};

/**
 * Notices: a feed of cards, the way a message feed works. Four at a time, with
 * the headline and two lines, and the whole notice behind a tap.
 */
export function NoticesScreen() {
  const { child, profile, klass } = useWard();
  const [filter, setFilter] = useState<Filter>('All');
  const [showAll, setShowAll] = useState(false);
  const [reading, setReading] = useState<Notice | null>(null);
  const { sent } = useLive();

  if (!child || !profile || !klass) return null;

  // What the school has sent since this session opened comes first, because it
  // is the newest thing and the reason the app is worth opening.
  const live = sent
    .map(asParentNotice)
    .filter(notice => !notice.classId || notice.classId === profile.classId);
  const all = [...live, ...noticesFor(profile.classId)];
  const matching = filter === 'All' ? all : all.filter(notice => notice.audience === filter);
  const shown = showAll ? matching : matching.slice(0, 4);
  const hidden = matching.length - shown.length;

  return (
    <div className="space-y-5">
      <ScreenTitle title="Notices" sub={`${all.length} this term, for ${child.name.split(' ')[0]} and the school`} />

      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          icon={Users}
          label="Whole school"
          value={all.filter(n => n.audience === 'School').length}
          note="For every family"
          tone="orange"
        />
        <StatCard
          icon={CalendarDays}
          label={klass.name}
          value={all.filter(n => n.audience === 'Class').length}
          note="About this class"
          tone="green"
        />
      </div>

      <Segmented options={FILTERS} value={filter} onChange={setFilter} label="Filter notices" />

      {shown.length ? (
        <ul className="space-y-3">
          {shown.map(notice => {
            const tone = AUDIENCE_TONE[notice.audience] ?? 'orange';
            return (
              <li key={notice.id}>
                <Card>
                  <CardPad>
                    <div className="flex items-start gap-3">
                      <IconChip icon={Bell} tone={tone} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Chip tone={tone}>{notice.audience}</Chip>
                          {notice.pinned ? <Chip tone="plain" icon={Pin}>Pinned</Chip> : null}
                          <span className="min-w-0 truncate text-[0.75rem] text-ink-mute">
                            {notice.from} · {formatDate(notice.date)}
                          </span>
                        </div>
                        <h2 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-ink">{notice.title}</h2>
                        <p className="mt-1.5 line-clamp-2 text-[0.875rem] leading-relaxed text-ink-mute">
                          {notice.body}
                        </p>
                        <button
                          type="button"
                          onClick={() => setReading(notice)}
                          className="mt-3 inline-flex min-h-[2.25rem] items-center rounded-full bg-canvas px-3.5 text-[0.75rem] font-semibold text-ink"
                        >
                          Read
                        </button>
                      </div>
                    </div>
                  </CardPad>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card>
          <CardPad>
            <p className="text-[0.875rem] text-ink-mute">Nothing in this category.</p>
          </CardPad>
        </Card>
      )}

      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="min-h-[3rem] w-full rounded-2xl bg-paper py-3.5 text-[0.8125rem] font-semibold text-ink shadow-[0_1px_3px_rgba(17,17,17,0.06)]"
        >
          Show {hidden} more
        </button>
      ) : null}
      {showAll && matching.length > 4 ? (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="min-h-[3rem] w-full rounded-2xl bg-canvas py-3.5 text-[0.8125rem] font-semibold text-ink-mute"
        >
          Show fewer
        </button>
      ) : null}

      <Sheet open={!!reading} onClose={() => setReading(null)} title={reading?.title ?? ''}>
        {reading ? (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone={AUDIENCE_TONE[reading.audience] ?? 'orange'}>{reading.audience}</Chip>
              <span className="text-[0.75rem] text-ink-mute">{formatLongDate(reading.date)}</span>
            </div>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">{reading.body}</p>
            <p className="mt-4 text-[0.8125rem] text-ink-mute">From {reading.from}</p>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

export default NoticesScreen;
