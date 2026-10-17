import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, Phone, UserPlus } from 'lucide-react';
import { formatLongDate } from '../../../data/portal';
import { admissionQueue, admissionStages, can } from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Avatar, Badge, Button, Card, CardHead, Drawer, Kpi, PageHead, SearchField, Segmented, SavedNote, Table, Td, Tr,
} from '../ui';

/**
 * Admissions.
 *
 * A queue, because that is what it is: a person moves one application forward
 * one step, and the family hears about it. The stages across the top are the
 * pipeline and the counts are read off the list, so nothing can say four when
 * there are three.
 *
 * Accepting an application is the one action on this screen that creates a
 * record elsewhere in the system, so it is the one action that says so
 * afterwards.
 */

export function AdmissionsScreen() {
  const { auth } = useStaffAuth();
  const [stage, setStage] = useState<(typeof admissionStages)[number] | 'All'>('All');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  if (!auth) return null;
  const mayEdit = can(auth.role, 'admissions', 'edit');

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return admissionQueue.filter(application => {
      if (stage !== 'All' && application.stage !== stage) return false;
      if (!needle) return true;
      return (
        application.child.toLowerCase().includes(needle) ||
        application.parent.toLowerCase().includes(needle) ||
        application.applyingFor.toLowerCase().includes(needle)
      );
    });
  }, [stage, query]);

  const open = admissionQueue.find(application => application.id === openId) ?? null;
  const countIn = (target: string) => admissionQueue.filter(application => application.stage === target).length;

  return (
    <div className="space-y-5">
      <PageHead
        title="Admissions"
        sub="From the first enquiry to the first day"
        actions={mayEdit ? <Button icon={UserPlus} onClick={() => setSaved('An application form has been opened for the office.')}>New application</Button> : undefined}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {admissionStages.map((entry, index) => (
          <Kpi
            key={entry}
            icon={index === 3 ? CheckCircle2 : ClipboardList}
            tone={index === 0 ? 'orange' : index === 1 ? 'purple' : index === 2 ? 'green' : 'plain'}
            label={entry}
            value={countIn(entry)}
            note={entry === 'New' ? 'Not yet looked at' : entry === 'Enrolled' ? 'This term' : 'In progress'}
          />
        ))}
      </div>

      <Card>
        <CardHead title="The queue" sub={`${rows.length} of ${admissionQueue.length} applications`} icon={ClipboardList} tone="green" />
        <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:px-5">
          <SearchField value={query} onChange={setQuery} placeholder="Search a child or a parent" />
          <Segmented options={['All', ...admissionStages] as const} value={stage} onChange={setStage} label="Filter by stage" />
        </div>

        <Table head={['Child', 'Applying for', 'Parent', 'Received', 'Stage', '']}>
          {rows.map(application => (
            <Tr key={application.id}>
              <Td label="Child" strong>
                <span className="flex items-center gap-2.5">
                  <Avatar name={application.child} size="sm" tone="green" />
                  {application.child}
                </span>
              </Td>
              <Td label="For">{application.applyingFor}</Td>
              <Td label="Parent">{application.parent}</Td>
              <Td label="Received">{formatLongDate(application.received)}</Td>
              <Td label="Stage">
                <Badge tone={application.stage === 'New' ? 'orange' : application.stage === 'Interview' ? 'purple' : application.stage === 'Offer' ? 'green' : 'plain'}>
                  {application.stage}
                </Badge>
              </Td>
              <Td align="right">
                <Button tone="plain" onClick={() => setOpenId(application.id)}>
                  Open
                </Button>
              </Td>
            </Tr>
          ))}
          {!rows.length ? (
            <Tr>
              <Td>
                <span className="block py-4 text-center text-ink-mute">No application matches that.</span>
              </Td>
            </Tr>
          ) : null}
        </Table>
      </Card>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open?.child ?? 'Application'}>
        {open ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={open.child} size="lg" tone="green" />
              <div>
                <p className="text-[1rem] font-semibold text-ink">{open.child}</p>
                <p className="text-[0.8125rem] text-ink-mute">Applying for {open.applyingFor}</p>
                <div className="mt-1.5">
                  <Badge tone={open.stage === 'New' ? 'orange' : open.stage === 'Offer' ? 'green' : 'purple'}>{open.stage}</Badge>
                </div>
              </div>
            </div>

            <dl className="space-y-2 rounded-2xl bg-canvas px-4 py-3">
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Parent</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">{open.parent}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Phone</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">{open.phone}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Received</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">{formatLongDate(open.received)}</dd>
              </div>
            </dl>

            <p className="rounded-2xl bg-tint-orange px-4 py-3 text-[0.8125rem] leading-relaxed text-ink">
              {open.note}
            </p>

            {mayEdit ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  icon={CheckCircle2}
                  tone="green"
                  onClick={() => {
                    setSaved(`${open.child} has been moved forward, and ${open.parent} can see it in the app.`);
                    setOpenId(null);
                  }}
                >
                  Move to the next stage
                </Button>
                <a
                  href={`tel:${open.phone.replace(/\s/g, '')}`}
                  className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-canvas px-4 text-[0.8125rem] font-semibold text-ink"
                >
                  <Phone size={15} aria-hidden="true" />
                  Call the parent
                </a>
              </div>
            ) : (
              <p className="text-[0.8125rem] text-ink-mute">
                Your role can read this queue but not move it. The office decides.
              </p>
            )}
          </div>
        ) : null}
      </Drawer>

      {saved ? (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md md:inset-x-auto md:right-6 md:bottom-6">
          <SavedNote families={1} what={saved} onReset={() => setSaved(null)} />
        </div>
      ) : null}
    </div>
  );
}

export default AdmissionsScreen;
