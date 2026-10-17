import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Megaphone, Pin, Send, Smartphone, Users } from 'lucide-react';
import { formatLongDate } from '../../../data/portal';
import { allNotices, can, rollWithFees } from '../../../data/admin';
import { useLive } from '../../../data/live';
import { useStaffAuth } from '../AuthContext';
import {
  Badge, Button, Card, CardHead, CardPad, Kpi, PageHead, SavedNote, Segmented, Table, Td, Tr,
} from '../ui';

/**
 * Notices.
 *
 * The composer is the screen that makes the parent app worth having. A notice
 * is written once, aimed at the right people, and the number under the send
 * button says exactly how many families are about to receive it before it is
 * sent, not afterwards.
 *
 * The phone on the right is not decoration. It renders the finished notice the
 * way the parent app draws it, so nobody in the office has to imagine what a
 * message will look like on a small screen.
 */

const AUDIENCES = ['Whole school', 'One class', 'Families owing fees', 'One family'] as const;

export function CommunicationsScreen() {
  const { auth } = useStaffAuth();
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>('Whole school');
  const [classId, setClassId] = useState<'jhs2' | 'p5'>('jhs2');
  const [title, setTitle] = useState('Sports day, Saturday 14 March');
  const [body, setBody] = useState(
    'Sports day is Saturday 14 March, from 8am on the school field. House vest, shorts and trainers are needed. Parents race at midday.'
  );
  const [sent, setSent] = useState<number | null>(null);
  const { publishNotice } = useLive();

  if (!auth) return null;
  const maySend = can(auth.role, 'communications', 'edit');

  const reach = useMemo(() => {
    if (audience === 'Whole school') return rollWithFees.length;
    if (audience === 'One class') return rollWithFees.filter(pupil => pupil.classId === classId).length;
    if (audience === 'Families owing fees') return rollWithFees.filter(pupil => pupil.feeBalance > 0).length;
    return 1;
  }, [audience, classId]);

  return (
    <div className="space-y-5">
      <PageHead
        title="Notices"
        sub="Written once here, read on every phone that needs it"
        actions={<Badge tone="orange">{allNotices.length} sent this term</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Megaphone} tone="orange" label="Sent this term" value={allNotices.length} note="Every audience" />
        <Kpi icon={Users} tone="green" label="Families reached" value={rollWithFees.length} note="One app, no printing" />
        <Kpi icon={Bell} tone="purple" label="Pinned" value={allNotices.filter(notice => notice.pinned).length} note="Held at the top of the feed" />
        <Kpi icon={Smartphone} tone="yellow" label="Delivered" value="100%" note="No message cost to the school" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* ---------------------------------------------------------------- */}
        {/* The composer.                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Card>
          <CardHead title="Write a notice" sub="It arrives the moment you send it" icon={Megaphone} tone="orange" />

          <div className="space-y-4 px-4 pb-4 sm:px-5">
            <div>
              <p className="mb-2 text-[0.75rem] font-medium text-ink">Who is it for</p>
              <Segmented options={AUDIENCES} value={audience} onChange={setAudience} label="Choose an audience" />
            </div>

            {audience === 'One class' ? (
              <Segmented options={['jhs2', 'p5'] as const} value={classId} onChange={setClassId} label="Choose a class" />
            ) : null}

            <label className="block">
              <span className="mb-2 block text-[0.75rem] font-medium text-ink">Headline</span>
              <input
                value={title}
                onChange={event => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-rule bg-canvas px-4 py-3 text-[0.9375rem] text-ink focus:border-gold-deep focus:bg-paper focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.75rem] font-medium text-ink">The notice</span>
              <textarea
                value={body}
                onChange={event => setBody(event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-rule bg-canvas px-4 py-3 text-[0.9375rem] leading-relaxed text-ink focus:border-gold-deep focus:bg-paper focus:outline-none"
              />
            </label>

            <div className="rounded-2xl bg-tint-orange px-4 py-3">
              <p className="text-[0.8125rem] text-ink">
                <span className="font-semibold">
                  {reach} {reach === 1 ? 'family' : 'families'}
                </span>{' '}
                will get this, and nobody else.
              </p>
            </div>

            {maySend ? (
              <Button
                icon={Send}
                full
                onClick={() => {
                  publishNotice({
                    title: title.trim() || 'A notice from the school',
                    body: body.trim(),
                    from: `${auth.name}, ${auth.title}`,
                    audience:
                      audience === 'Families owing fees'
                        ? 'Fees'
                        : audience === 'One class'
                          ? 'Class'
                          : 'School',
                    classId: audience === 'One class' ? classId : undefined,
                    reach,
                  });
                  setSent(reach);
                }}
              >
                Send to {reach} {reach === 1 ? 'family' : 'families'}
              </Button>
            ) : (
              <p className="text-[0.8125rem] text-ink-mute">
                Your role can read the notice history and draft, but not send.
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          {sent !== null ? (
            <SavedNote
              families={sent}
              what={`"${title}" is sent. It is already at the top of the parent app's notices feed.`}
              onReset={() => setSent(null)}
              extra={
                <Link
                  to="/parent"
                  className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-full bg-paper px-3 text-[0.75rem] font-semibold text-green-deep"
                >
                  Open the parent app
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              }
            />
          ) : null}

          {/* The phone preview, drawn with the app's own shapes. */}
          <div data-device="phone-frame" className="mx-auto w-full max-w-[19rem] rounded-[2rem] bg-ink p-2 shadow-[0_1px_3px_rgba(17,17,17,0.06)]">
            <div className="overflow-hidden rounded-[1.6rem] bg-canvas">
              <div className="flex items-center justify-between bg-paper px-4 py-3">
                <span className="text-[0.6875rem] font-semibold text-ink">Notices</span>
                <span className="text-[0.5625rem] text-ink-mute">Parent app</span>
              </div>
              <div className="space-y-2 p-3">
                <div className="rounded-2xl bg-paper p-3">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-tint-orange px-2 py-0.5 text-[0.5625rem] font-semibold text-gold-deep">
                      {audience === 'Families owing fees' ? 'Fees' : audience === 'One class' ? 'Class' : 'School'}
                    </span>
                    <span className="text-[0.5625rem] text-ink-mute">{formatLongDate('2026-02-18')}</span>
                  </div>
                  <p className="mt-1.5 text-[0.75rem] font-semibold leading-snug text-ink">{title || 'Your headline'}</p>
                  <p className="mt-1 line-clamp-3 text-[0.6875rem] leading-relaxed text-ink-mute">
                    {body || 'The notice appears here.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-paper/60 p-3">
                  <p className="text-[0.5625rem] font-semibold text-ink-mute">Earlier notices</p>
                  <p className="mt-1 text-[0.6875rem] text-ink-mute">Mid term break, 17 to 21 February</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[0.6875rem] text-ink-mute">
            This is the parent app&apos;s own notice card
          </p>
        </div>
      </div>

      <Card>
        <CardHead title="What has been sent" sub="Newest first" icon={Pin} tone="purple" />
        <Table head={['Notice', 'Audience', 'From', 'Date', '']}>
          {allNotices.map(notice => (
            <Tr key={notice.id}>
              <Td label="Notice" strong>{notice.title}</Td>
              <Td label="Audience">
                <Badge tone={notice.audience === 'Fees' ? 'yellow' : notice.audience === 'Class' ? 'green' : notice.audience === 'Teacher' ? 'purple' : 'orange'}>
                  {notice.audience}
                </Badge>
              </Td>
              <Td label="From">{notice.from}</Td>
              <Td label="Date">{formatLongDate(notice.date)}</Td>
              <Td align="right">
                <Badge tone="green">Delivered</Badge>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Card tone="green">
        <CardPad>
          <p className="text-[0.8125rem] leading-relaxed text-ink">
            A notice costs nothing to send and cannot be lost in a bag. It stays in the feed, so a
            parent who joins the school in March can still read what was said in January.
          </p>
        </CardPad>
      </Card>
    </div>
  );
}

export default CommunicationsScreen;
