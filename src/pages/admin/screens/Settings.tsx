import { useState } from 'react';
import { CalendarDays, CheckCircle2, GraduationCap, Phone, Save, Wallet } from 'lucide-react';
import { academicYear, formatCurrency, gradingScale, school } from '../../../data';
import { formatLongDate, paymentChannels } from '../../../data/portal';
import { can, feeByCategory } from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Badge, Button, Card, CardHead, CardPad, PageHead, SavedNote, Segmented, Table, Td, Tr,
} from '../ui';

/**
 * Settings.
 *
 * The term, the grading scale, the fee heads and the details the school puts on
 * everything it sends. None of it changes during a school day, so the screen is
 * quiet and plain: it is read twice a year and should be obvious when it is.
 */
export function SettingsScreen() {
  const { auth } = useStaffAuth();
  const [tab, setTab] = useState<'Year' | 'Grading' | 'Fees' | 'School'>('Year');
  const [saved, setSaved] = useState(false);

  if (!auth) return null;
  const mayEdit = can(auth.role, 'settings', 'edit');

  return (
    <div className="space-y-5">
      <PageHead
        title="Settings"
        sub="The school year, the grading scale and where the money goes"
        actions={mayEdit ? <Button icon={Save} onClick={() => setSaved(true)}>Save changes</Button> : <Badge tone="plain">Read only for your role</Badge>}
      />

      {saved ? (
        <SavedNote
          families={0}
          what="The settings are saved. They apply to everything entered from now on, not to records already written."
          onReset={() => setSaved(false)}
        />
      ) : null}

      <Segmented options={['Year', 'Grading', 'Fees', 'School'] as const} value={tab} onChange={setTab} label="Settings sections" />

      {tab === 'Year' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHead title={academicYear.name} sub="The three terms" icon={CalendarDays} tone="orange" />
            <ul>
              {academicYear.terms.map((term, index) => (
                <li key={term.id} className="border-t border-rule px-4 py-3 first:border-0 sm:px-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[0.875rem] font-medium text-ink">{term.name}</p>
                      <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                        {formatLongDate(term.start)} to {formatLongDate(term.end)}
                      </p>
                    </div>
                    {academicYear.currentTerm === term.id ? <Badge tone="green">Open now</Badge> : <Badge tone="plain">Closed</Badge>}
                  </div>
                  {index === 1 ? (
                    <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-mute">
                      Week by week attendance and fees are counted inside this term. Closing it locks
                      the register and freezes the results.
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="What happens at the end of a term" icon={CheckCircle2} tone="green" />
            <ul className="space-y-3 px-4 pb-4 sm:px-5">
              {[
                'Results are published to the parent app, subject by subject.',
                'Fee balances carry into the next term and stay visible to the family.',
                'The register closes and cannot be changed after the last day.',
                'A new term opens with the same classes and the same teachers, ready to copy.',
              ].map(line => (
                <li key={line} className="flex gap-3 text-[0.8125rem] leading-relaxed text-ink">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-deep" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}

      {tab === 'Grading' ? (
        <Card>
          <CardHead title="The grading scale" sub="Used for every subject mark" icon={GraduationCap} tone="purple" />
          <Table head={['Grade', 'From', 'To', 'Remark']}>
            {gradingScale.map(band => (
              <Tr key={band.grade}>
                <Td label="Grade" strong>{band.grade}</Td>
                <Td label="From">{band.min}</Td>
                <Td label="To">{band.max}</Td>
                <Td label="Remark">{band.remark}</Td>
              </Tr>
            ))}
          </Table>
          <p className="border-t border-rule px-4 py-3 text-[0.75rem] text-ink-mute sm:px-5">
            The parent app shows the grade and the remark beside the mark, worked out from this
            table rather than typed by a teacher.
          </p>
        </Card>
      ) : null}

      {tab === 'Fees' ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHead title="Fee heads this term" sub="What the school bills for" icon={Wallet} tone="yellow" />
            <Table head={['Head', 'Billed']}>
              {feeByCategory.map(line => (
                <Tr key={line.category}>
                  <Td label="Head" strong>{line.category}</Td>
                  <Td label="Billed">{formatCurrency(line.billed)}</Td>
                </Tr>
              ))}
            </Table>
          </Card>
          <Card>
            <CardHead title="Where families pay" sub="Shown in the parent app" icon={Phone} tone="orange" />
            <ul className="space-y-2 px-4 pb-4 sm:px-5">
              {paymentChannels.map(channel => (
                <li key={channel.label} className="rounded-2xl bg-canvas px-4 py-3">
                  <p className="text-[0.8125rem] font-semibold text-ink">{channel.label}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink">{channel.value}</p>
                  <p className="mt-0.5 text-[0.75rem] text-ink-mute">{channel.note}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}

      {tab === 'School' ? (
        <Card>
          <CardHead title={school.name} sub={school.motto} icon={GraduationCap} tone="green" />
          <CardPad className="pt-0">
            <dl className="space-y-3">
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Address</dt>
                <dd className="mt-0.5 text-[0.875rem] text-ink">{school.address}</dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Telephone</dt>
                <dd className="mt-0.5 text-[0.875rem] text-ink">{school.phone}</dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Email</dt>
                <dd className="mt-0.5 text-[0.875rem] text-ink">{school.email}</dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Office hours</dt>
                <dd className="mt-0.5 text-[0.875rem] text-ink">Monday to Friday, 7:30am to 4:30pm</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-2xl bg-tint-green px-4 py-3 text-[0.8125rem] leading-relaxed text-ink">
              These are the details a parent sees when they tap for help in the app. One place to
              change them, and every screen that shows a phone number shows this one.
            </p>
          </CardPad>
        </Card>
      ) : null}
    </div>
  );
}

export default SettingsScreen;
