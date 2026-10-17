import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, GraduationCap, Send, TrendingUp } from 'lucide-react';
import { getGrade } from '../../../data';
import {
  can, classSummary, resultBatches, rollWithFees, type Publishable,
} from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Avatar, Badge, Button, Card, CardHead, CardPad, Drawer, Kpi, Meter, PageHead, SavedNote, Segmented, Table, Td, Tr,
} from '../ui';

/**
 * Results.
 *
 * Two jobs live here and they belong to different people. A subject teacher
 * enters a mark per pupil. A head teacher or a director looks at a subject that
 * is fully marked and releases it, which is the moment every family in that
 * class can see it.
 *
 * Splitting the two is the point. Marks are not live the instant a teacher
 * types them, because a half entered column is not a result. They are live the
 * instant somebody with the authority publishes them, and the screen says which
 * of the two states each subject is in.
 */

const STATUS_TONE = { Ready: 'orange', Draft: 'plain', Published: 'green' } as const;

export function AcademicsScreen() {
  const { auth } = useStaffAuth();
  const [openBatch, setOpenBatch] = useState<Publishable | null>(null);
  const [published, setPublished] = useState<string[]>([]);
  const [publishedNow, setPublishedNow] = useState<Publishable | null>(null);

  if (!auth) return null;

  const mayPublish = can(auth.role, 'academics', 'edit') && (auth.role === 'head' || auth.role === 'director');
  const mayEnter = can(auth.role, 'academics', 'edit');

  const batches = resultBatches.map(batch =>
    published.includes(`${batch.classId}-${batch.subject}`) ? { ...batch, status: 'Published' as const } : batch
  );
  const ready = batches.filter(batch => batch.status === 'Ready');
  const waiting = batches.filter(batch => batch.status === 'Draft');

  return (
    <div className="space-y-5">
      <PageHead
        title="Results"
        sub="Marks are private until they are published, then they are on every phone in the class"
        actions={<Badge tone={ready.length ? 'orange' : 'green'}>{ready.length} ready to publish</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={GraduationCap} tone="purple" label="Class average" value={Math.round((classSummary.reduce((total, klass) => total + klass.average, 0) / classSummary.length) * 10) / 10} note="Across both classes" />
        <Kpi icon={Send} tone="orange" label="Ready to publish" value={ready.length} note="Fully marked" />
        <Kpi icon={CheckCircle2} tone="green" label="Published" value={batches.filter(batch => batch.status === 'Published').length} note="Visible to parents" />
        <Kpi icon={ClipboardList} tone="yellow" label="Still marking" value={waiting.length} note="Not released yet" />
      </div>

      {mayEnter && auth.role !== 'head' && auth.role !== 'director' ? (
        <GradeEntry subject={auth.role === 'subject' ? 'Mathematics' : 'Class work'} />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHead title="Subjects this term" sub="Every subject, and where its marks have got to" icon={ClipboardList} tone="purple" />
          <Table head={['Subject', 'Teacher', 'Marked', 'Average', 'State', '']}>
            {batches.map(batch => (
              <Tr key={`${batch.classId}-${batch.subject}`}>
                <Td label="Subject" strong>
                  <span className="flex items-center gap-2">
                    {batch.subject}
                    <span className="text-[0.6875rem] text-ink-mute">{batch.className}</span>
                  </span>
                </Td>
                <Td label="Teacher">{batch.teacher}</Td>
                <Td label="Marked">
                  <span className="tabular-nums">
                    {batch.marked} of {batch.outOf}
                  </span>
                </Td>
                <Td label="Average">
                  <span className="tabular-nums">{batch.average}</span>
                </Td>
                <Td label="State">
                  <Badge tone={STATUS_TONE[batch.status]}>{batch.status}</Badge>
                </Td>
                <Td align="right">
                  <Button tone="plain" onClick={() => setOpenBatch(batch)}>
                    {batch.status === 'Ready' ? 'Review' : batch.status === 'Draft' ? 'See' : 'Open'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Table>
          <p className="border-t border-rule px-4 py-3 text-[0.75rem] text-ink-mute sm:px-5">
            A subject only appears on a parent&apos;s phone after it is published.
          </p>
        </Card>

        <div className="space-y-4">
          {publishedNow ? (
            <SavedNote
              families={publishedNow.className === 'JHS 2' ? 24 : 19}
              what={`${publishedNow.subject} is published. ${publishedNow.className} families can see the new marks and their new positions in the parent app.`}
              onReset={() => setPublishedNow(null)}
            />
          ) : null}

          <Card>
            <CardHead title="How it reads on the app" sub="A published subject" icon={TrendingUp} tone="green" />
            <CardPad className="pt-0">
              <div className="rounded-2xl bg-tint-purple px-4 py-3">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-purple-deep">Mathematics</p>
                <p className="mt-1 text-[1.75rem] font-semibold leading-none tabular-nums text-ink">88</p>
                <p className="mt-1 text-[0.75rem] text-ink-mute">Position 2 of 24 · class average 68</p>
                <div className="mt-2.5">
                  <Meter value={88} tone="purple" />
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-[0.8125rem] text-ink">
                <li className="flex justify-between gap-3">
                  <span className="text-ink-mute">Grade</span>
                  <span className="font-medium">{getGrade(88).grade} · {getGrade(88).remark}</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span className="text-ink-mute">Seen by</span>
                  <span className="font-medium">24 families</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span className="text-ink-mute">Published</span>
                  <span className="font-medium">This morning</span>
                </li>
              </ul>
            </CardPad>
          </Card>

          {!mayPublish ? (
            <Card tone="orange">
              <CardPad>
                <p className="text-[0.8125rem] leading-relaxed text-ink">
                  Only the head teacher and the director release results. A subject teacher enters
                  the marks and stops there, which is what keeps a half finished column off a
                  parent&apos;s phone.
                </p>
              </CardPad>
            </Card>
          ) : null}
        </div>
      </div>

      <Drawer open={!!openBatch} onClose={() => setOpenBatch(null)} title={openBatch ? `${openBatch.subject} · ${openBatch.className}` : 'Subject'} wide>
        {openBatch ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone={STATUS_TONE[openBatch.status]}>{openBatch.status}</Badge>
              <Badge tone="plain">{openBatch.marked} of {openBatch.outOf} marked</Badge>
              <Badge tone="purple">Average {openBatch.average}</Badge>
            </div>

            <div className="rounded-2xl bg-canvas px-4 py-3">
              <p className="text-[0.75rem] text-ink-mute">Teacher</p>
              <p className="text-[0.875rem] font-medium text-ink">{openBatch.teacher}</p>
            </div>

            <div>
              <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">
                The marks
              </p>
              <ul className="space-y-1.5">
                {rollWithFees
                  .filter(pupil => pupil.classId === openBatch.classId)
                  .slice(0, 10)
                  .map((pupil, index) => {
                    const score = Math.max(32, Math.min(96, Math.round(openBatch.average + 22 - index * 4)));
                    return (
                      <li key={pupil.id} className="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2">
                        <Avatar name={pupil.name} size="sm" />
                        <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-ink">{pupil.name}</span>
                        <span className="text-[0.75rem] text-ink-mute">Grade {getGrade(score).grade}</span>
                        <span className="w-9 text-right text-[0.875rem] font-semibold tabular-nums text-ink">{score}</span>
                      </li>
                    );
                  })}
              </ul>
              <p className="mt-2 text-[0.75rem] text-ink-mute">
                Showing 10 of {openBatch.outOf}. Ranks are worked out from the whole class.
              </p>
            </div>

            {mayPublish && openBatch.status === 'Ready' ? (
              <Button
                icon={Send}
                tone="green"
                full
                onClick={() => {
                  setPublished(current => [...current, `${openBatch.classId}-${openBatch.subject}`]);
                  setPublishedNow(openBatch);
                  setOpenBatch(null);
                }}
              >
                Publish to {openBatch.className} families
              </Button>
            ) : null}
            {mayPublish && openBatch.status === 'Draft' ? (
              <Button icon={Send} tone="plain" full onClick={() => undefined}>
                {openBatch.outOf - openBatch.marked} marks still missing
              </Button>
            ) : null}
            {!mayPublish ? (
              <p className="rounded-2xl bg-tint-orange px-4 py-3 text-[0.8125rem] leading-relaxed text-ink">
                Your role can read this subject. Publishing is the head teacher&apos;s decision.
              </p>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

/** A working gradebook, for the teacher who owns the subject. */
function GradeEntry({ subject }: { subject: string }) {
  const [classId, setClassId] = useState<'jhs2' | 'p5'>('jhs2');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const pupils = useMemo(() => rollWithFees.filter(pupil => pupil.classId === classId), [classId]);
  const valueFor = (id: string, fallback: number) => scores[id] ?? fallback;
  const values = pupils.map(pupil => valueFor(pupil.id, Math.round(pupil.average)));
  const average = Math.round((values.reduce((total, score) => total + score, 0) / values.length) * 10) / 10;

  return (
    <Card>
      <CardHead
        title={`Enter ${subject} marks`}
        sub="Type a mark out of 100 for each pupil, then save"
        icon={GraduationCap}
        tone="purple"
        action={<Badge tone="purple">Average {average}</Badge>}
      />
      <div className="px-4 pb-3 sm:px-5">
        <Segmented options={['jhs2', 'p5'] as const} value={classId} onChange={setClassId} label="Choose a class" />
      </div>
      <div className="max-h-[26rem] overflow-y-auto border-t border-rule">
        <ul>
          {pupils.map(pupil => {
            const value = valueFor(pupil.id, Math.round(pupil.average));
            return (
              <li key={pupil.id} className="flex items-center gap-3 border-b border-rule px-4 py-2 last:border-0 sm:px-5">
                <Avatar name={pupil.name} size="sm" />
                <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-ink">{pupil.name}</span>
                <label className="flex items-center gap-2">
                  <span className="sr-only">{`Mark for ${pupil.name}`}</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={value}
                    onChange={event =>
                      setScores(current => ({ ...current, [pupil.id]: Math.max(0, Math.min(100, Number(event.target.value) || 0)) }))
                    }
                    className="h-11 w-16 rounded-xl border border-rule bg-canvas px-2 text-right text-[0.875rem] font-semibold tabular-nums text-ink focus:border-gold-deep focus:bg-paper focus:outline-none"
                  />
                  <span className="w-6 text-[0.6875rem] text-ink-mute">/100</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule px-4 py-3 sm:px-5">
        {saved ? (
          <p className="text-[0.75rem] font-medium text-green-deep">
            Saved as a draft. The head teacher can publish it, and it is not on a parent&apos;s phone until then.
          </p>
        ) : (
          <p className="text-[0.75rem] text-ink-mute">
            {pupils.length} pupils · marks are kept as a draft
          </p>
        )}
        <Button icon={CheckCircle2} tone="purple" onClick={() => setSaved(true)}>
          Save the marks
        </Button>
      </div>
    </Card>
  );
}

export default AcademicsScreen;
