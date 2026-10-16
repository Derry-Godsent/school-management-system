import { useState } from 'react';
import { Bell, Pin } from 'lucide-react';
import { formatDate, formatLongDate, noticesFor, type Notice } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Card, CardBody, Chip, IconBadge, Sheet, StatTile } from '../ui';
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
 * Notices, each one a card with a colour that says where it came from. A parent
 * can filter down to the ones about their own child's class in one tap.
 */
export function NoticesScreen() {
  const { child, profile, klass } = useWard();
  const [filter, setFilter] = useState<Filter>('All');
  const [showAll, setShowAll] = useState(false);
  const [reading, setReading] = useState<Notice | null>(null);

  if (!child || !profile || !klass) return null;

  const all = noticesFor(profile.classId);
  const matching = filter === 'All' ? all : all.filter(notice => notice.audience === filter);
  // A feed, not a page: four notices are visible and the rest wait to be asked
  // for, which keeps the screen readable on a phone.
  const shown = showAll ? matching : matching.slice(0, 4);
  const hidden = matching.length - shown.length;
  const pinned = all.filter(notice => notice.pinned).length;

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink">Notices</h1>
        <p className="mt-1 text-[0.8125rem] text-ink-mute">
          {all.length} this term · {pinned} pinned
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="For the whole school" value={all.filter(n => n.audience === 'School').length} tone="orange" />
        <StatTile label={`For ${klass.name}`} value={all.filter(n => n.audience === 'Class').length} tone="green" />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter notices">
        {FILTERS.map(option => {
          const active = option === filter;
          const count = option === 'All' ? all.length : all.filter(notice => notice.audience === option).length;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(option)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.75rem] font-semibold transition-colors ${
                active ? 'bg-ink text-paper' : 'bg-paper text-ink-mute hover:bg-cream'
              }`}
            >
              {option} {count}
            </button>
          );
        })}
      </div>

      {shown.length ? (
        <ul className="space-y-3">
          {shown.map(notice => {
            const tone = AUDIENCE_TONE[notice.audience] ?? 'orange';
            return (
              <li key={notice.id}>
                <Card shape="top" tone={tone}>
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <IconBadge icon={Bell} tone={tone} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip tone={tone}>{notice.audience}</Chip>
                          {notice.pinned ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-yellow">
                              <Pin size={10} aria-hidden="true" /> Pinned
                            </span>
                          ) : null}
                          <span className="text-[0.75rem] text-ink-mute">{formatDate(notice.date)}</span>
                        </div>
                        <h2 className="mt-2 font-display text-[1.0625rem] leading-snug text-ink">{notice.title}</h2>
                        <p className="mt-1.5 line-clamp-2 text-[0.875rem] leading-relaxed text-ink">{notice.body}</p>
                        <p className="mt-2 text-[0.75rem] text-ink-mute">From {notice.from}</p>
                        <button
                          type="button"
                          onClick={() => setReading(notice)}
                          className="mt-2.5 rounded-lg bg-ink px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-paper"
                        >
                          Read the notice
                        </button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card shape="bare">
          <CardBody>
            <p className="text-[0.875rem] text-ink-mute">Nothing in this category.</p>
          </CardBody>
        </Card>
      )}

      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full rounded-xl bg-ink px-4 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
        >
          Show {hidden} more
        </button>
      ) : null}
      {showAll && matching.length > 4 ? (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="w-full rounded-xl bg-cream px-4 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-mute"
        >
          Show fewer
        </button>
      ) : null}

      <Card shape="bare">
        <CardBody>
          <p className="text-[0.8125rem] text-ink-mute">
            Older notices are kept at the school office and can be requested by phone.
          </p>
        </CardBody>
      </Card>

      {/* The full notice, opened from its card. */}
      <Sheet open={!!reading} onClose={() => setReading(null)} title={reading?.title ?? ''}>
        {reading ? (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone={AUDIENCE_TONE[reading.audience] ?? 'orange'}>
                {reading.audience}
              </Chip>
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
