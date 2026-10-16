import { useState } from 'react';
import { Pin } from 'lucide-react';
import { formatLongDate, noticesFor } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Badge, Eyebrow, SectionHead } from '../ui';

const FILTERS = ['All', 'School', 'Class', 'Teacher', 'Fees'] as const;
type Filter = (typeof FILTERS)[number];

const AUDIENCE_TONE = {
  School: 'orange',
  Class: 'green',
  Teacher: 'purple',
  Fees: 'yellow',
} as const;

/**
 * Notices.
 *
 * A parent's real question here is "does this concern my child", so the notices
 * for their class come with everything else and the whole list can be filtered
 * down to the class or the teacher. Pinned notices stay at the top.
 */
export function NoticesScreen() {
  const { child, profile, klass } = useWard();
  const [filter, setFilter] = useState<Filter>('All');

  if (!child || !profile || !klass) return null;

  const all = noticesFor(profile.classId);
  const shown = filter === 'All' ? all : all.filter(notice => notice.audience === filter);
  const pinned = all.filter(notice => notice.pinned).length;

  return (
    <div className="space-y-8">
      <section>
        <Eyebrow>Notices</Eyebrow>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">From the school</h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-mute">
          {all.length} notices, {pinned} of them pinned. The {klass.name} notices are included here
          because {child.name} is in that class.
        </p>
      </section>

      <section>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter notices">
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
                className={`shrink-0 px-3 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  active ? 'bg-ink text-paper' : 'bg-paper text-ink-mute hover:bg-cream'
                }`}
              >
                {option} {count}
              </button>
            );
          })}
        </div>
      </section>

      {shown.length ? (
        <ul className="space-y-3">
          {shown.map(notice => (
            <li key={notice.id} className="bg-paper px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={AUDIENCE_TONE[notice.audience]}>{notice.audience}</Badge>
                {notice.pinned ? (
                  <span className="inline-flex items-center gap-1 bg-tint-purple px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-purple-deep">
                    <Pin size={11} aria-hidden="true" /> Pinned
                  </span>
                ) : null}
                <span className="text-[0.75rem] text-ink-mute">{formatLongDate(notice.date)}</span>
              </div>
              <h2 className="mt-3 font-display text-lg text-ink sm:text-xl">{notice.title}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{notice.body}</p>
              <p className="mt-3 border-t border-rule pt-3 text-[0.8125rem] text-ink-mute">
                From {notice.from}
                {notice.classId ? ` · sent to ${klass.name}` : ' · sent to the whole school'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="bg-paper px-4 py-5 text-[0.9375rem] text-ink-mute">
          Nothing in this category. Choose another filter to see the rest.
        </p>
      )}

      <section className="bg-tint-orange px-4 py-5">
        <SectionHead
          eyebrow="Older notices"
          title="Where the rest went"
          note="Notices older than this term are kept by the school office and can be requested by phone or at the front desk."
        />
        <a
          href="tel:+233241234567"
          className="inline-flex items-center bg-ink px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
        >
          Call the office
        </a>
      </section>
    </div>
  );
}

export default NoticesScreen;
