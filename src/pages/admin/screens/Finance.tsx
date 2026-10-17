import { useMemo, useState } from 'react';
import {
  Banknote, Bell, CheckCircle2, CreditCard, Download, Receipt, Wallet,
} from 'lucide-react';
import { formatCurrency } from '../../../data';
import { formatLongDate } from '../../../data/portal';
import {
  DEMO_TODAY, can, feeByCategory, feePosition, recentPayments, rollWithFees,
} from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import { Bars, Donut, Ring } from '../charts';
import {
  Avatar, Badge, Button, Card, CardHead, CardPad, Drawer, Hero, Kpi, Meter, SavedNote, SearchField, Segmented, Table, Td, Tr,
} from '../ui';

/**
 * Finance.
 *
 * The bursar's screen, so it answers the three questions a bursar is asked all
 * day: how much came in, who still owes, and what was that payment. The four
 * figures at the top are the term in one line, and everything below is the
 * detail behind them.
 *
 * A reminder is the one action on this screen a parent feels, so it is the one
 * action that reports how many families received it.
 */

const VIEWS = ['Arrears', 'Payments', 'By category'] as const;

export function FinanceScreen() {
  const { auth } = useStaffAuth();
  const [view, setView] = useState<(typeof VIEWS)[number]>('Arrears');
  const [query, setQuery] = useState('');
  const [reminded, setReminded] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!auth) return null;
  const mayEdit = can(auth.role, 'finance', 'edit');

  const owing = rollWithFees.filter(pupil => pupil.feeBalance > 0);
  const arrears = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const base = [...owing].sort((one, other) => other.feeBalance - one.feeBalance);
    if (!needle) return base;
    return base.filter(pupil => pupil.name.toLowerCase().includes(needle) || pupil.className.toLowerCase().includes(needle));
  }, [query, owing]);

  const open = rollWithFees.find(pupil => pupil.id === openId) ?? null;

  return (
    <div className="space-y-5">
      <Hero
        eyebrow={`Bursary · second term, as at ${formatLongDate(DEMO_TODAY)}`}
        title="Finance"
        sub="What has come in, what is still owed, and who to call. This is the same ledger the parent app reads from, line for line."
        tone="yellow"
        actions={
          mayEdit ? (
            <>
              <Button tone="plain" icon={Download} onClick={() => undefined}>
                Export
              </Button>
              <Button icon={Bell} onClick={() => setReminded(arrears.length)}>
                Remind everyone owing
              </Button>
            </>
          ) : (
            <Badge tone="plain">Oversight only for your role</Badge>
          )
        }
      >
        <div className="flex flex-wrap items-center gap-6">
          <Ring value={feePosition.rate} caption="of the term bill collected" captionNote={`${formatCurrency(feePosition.outstanding)} still out`} tone="yellow" size={92} />
          <div className="min-w-0 flex-1">
            <Bars
              data={feeByCategory.map(line => ({ label: line.category.split(' ')[0], value: Math.round((line.collected / line.billed) * 100), max: 100 }))}
              tone="orange"
              height={100}
              suffix="%"
            />
          </div>
        </div>
      </Hero>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Receipt} tone="orange" label="Billed this term" value={formatCurrency(feePosition.billed).replace('GHS ', '')} note="Every pupil, every line" />
        <Kpi icon={Banknote} tone="green" label="Collected" value={formatCurrency(feePosition.collected).replace('GHS ', '')} note={`${feePosition.rate}% of the bill`} delta={{ value: '6.4%', up: true }} />
        <Kpi icon={Wallet} tone="yellow" label="Outstanding" value={formatCurrency(feePosition.outstanding).replace('GHS ', '')} note={`${feePosition.arrears} pupils still owing`} />
        <Kpi icon={CheckCircle2} tone="purple" label="Families clear" value={feePosition.cleared} note={`of ${rollWithFees.length} pupils`} />
      </div>

      {reminded !== null ? (
        <SavedNote
          families={reminded}
          what={`A reminder with the balance went out. All ${reminded} families can see it in the parent app, with their own figure on it.`}
          onReset={() => setReminded(null)}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card>
          <CardHead title="The ledger" sub="Who owes what" icon={Wallet} tone="yellow" />
          <div className="flex flex-col gap-2 px-4 pb-3 sm:flex-row sm:items-center sm:px-5">
            <Segmented options={VIEWS} value={view} onChange={setView} label="Choose a view" />
          </div>

          {view === 'Arrears' ? (
            <>
              <div className="px-4 pb-3 sm:px-5">
                <SearchField value={query} onChange={setQuery} placeholder="Search a pupil or a class" />
              </div>
              <Table head={['Pupil', 'Class', 'Balance', 'Guardian', '']}>
                {arrears.map(pupil => (
                  <Tr key={pupil.id}>
                    <Td label="Pupil" strong>
                      <span className="flex items-center gap-2.5">
                        <Avatar name={pupil.name} size="sm" tone="yellow" />
                        {pupil.name}
                      </span>
                    </Td>
                    <Td label="Class">{pupil.className}</Td>
                    <Td label="Balance">
                      <span className="font-semibold tabular-nums text-gold-deep">{formatCurrency(pupil.feeBalance)}</span>
                    </Td>
                    <Td label="Guardian">{pupil.guardianName}</Td>
                    <Td align="right">
                      <Button tone="plain" onClick={() => setOpenId(pupil.id)}>
                        Open
                      </Button>
                    </Td>
                  </Tr>
                ))}
                {!arrears.length ? (
                  <Tr>
                    <Td>
                      <span className="block py-4 text-center text-ink-mute">Nobody owes anything.</span>
                    </Td>
                  </Tr>
                ) : null}
              </Table>
              <p className="border-t border-rule px-4 py-3 text-[0.75rem] text-ink-mute sm:px-5">
                {arrears.length} pupils · {formatCurrency(arrears.reduce((total, pupil) => total + pupil.feeBalance, 0))} outstanding
              </p>
            </>
          ) : null}

          {view === 'Payments' ? (
            <Table head={['Receipt', 'Pupil', 'Amount', 'Method', 'When', '']}>
              {recentPayments.map(payment => (
                <Tr key={payment.id}>
                  <Td label="Receipt" strong>{payment.id}</Td>
                  <Td label="Pupil">
                    {payment.pupil}
                    <span className="ml-1 text-[0.6875rem] text-ink-mute">{payment.className}</span>
                  </Td>
                  <Td label="Amount">
                    <span className="tabular-nums text-green-deep">{formatCurrency(payment.amount)}</span>
                  </Td>
                  <Td label="Method">{payment.method}</Td>
                  <Td label="When">{payment.time}</Td>
                  <Td align="right">
                    <Badge tone="green">Received</Badge>
                  </Td>
                </Tr>
              ))}
            </Table>
          ) : null}

          {view === 'By category' ? (
            <div className="space-y-4 px-4 pb-5 pt-1 sm:px-5">
              {feeByCategory.map(line => {
                const rate = Math.round((line.collected / line.billed) * 100);
                return (
                  <div key={line.category}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-[0.8125rem] font-medium text-ink">{line.category}</span>
                      <span className="text-[0.75rem] tabular-nums text-ink-mute">
                        {formatCurrency(line.collected)} of {formatCurrency(line.billed)} · {rate}%
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Meter value={rate} tone={rate >= 90 ? 'green' : rate >= 75 ? 'yellow' : 'orange'} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead title="Received today" sub="Two payments so far" icon={CreditCard} tone="green" />
            <CardPad className="pt-0">
              <p className="text-[1.75rem] font-semibold leading-none tabular-nums text-ink">
                {formatCurrency(recentPayments.slice(0, 2).reduce((total, payment) => total + payment.amount, 0))}
              </p>
              <p className="mt-1 text-[0.75rem] text-ink-mute">Mobile money and bank transfer</p>
              <ul className="mt-3 space-y-2">
                {recentPayments.slice(0, 2).map(payment => (
                  <li key={payment.id} className="flex items-center justify-between gap-3 rounded-xl bg-canvas px-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.8125rem] font-medium text-ink">{payment.pupil}</span>
                      <span className="block truncate text-[0.6875rem] text-ink-mute">{payment.receivedBy}</span>
                    </span>
                    <span className="shrink-0 text-[0.8125rem] font-semibold tabular-nums text-green-deep">
                      {formatCurrency(payment.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardPad>
          </Card>

          <Card tone="yellow">
            <CardPad>
              <p className="text-[0.8125rem] leading-relaxed text-ink">
                The parent app carries the same balance this screen does, line by line. When you
                record a payment here, the family&apos;s figure drops before they put the phone down.
              </p>
            </CardPad>
          </Card>

          <Card>
            <CardHead title="How payments arrive" icon={Banknote} tone="purple" />
            <ul className="px-4 pb-4 sm:px-5">
              {[
                { method: 'Mobile money', share: 62 },
                { method: 'Bank transfer', share: 26 },
                { method: 'Cash at the office', share: 12 },
              ].map(row => (
                <li key={row.method} className="py-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[0.8125rem] text-ink">{row.method}</span>
                    <span className="text-[0.75rem] tabular-nums text-ink-mute">{row.share}%</span>
                  </div>
                  <div className="mt-1.5">
                    <Meter value={row.share} tone="purple" />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open?.name ?? 'Pupil'}>
        {open ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={open.name} size="lg" tone="yellow" />
              <div>
                <p className="text-[1rem] font-semibold text-ink">{open.name}</p>
                <p className="text-[0.8125rem] text-ink-mute">{open.className} · {open.admissionNo}</p>
                <div className="mt-1.5">
                  <Badge tone={open.feeBalance ? 'orange' : 'green'}>
                    {open.feeBalance ? 'Balance outstanding' : 'All clear'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-tint-yellow px-4 py-3">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-yellow-deep">Balance</p>
              <p className="mt-1 text-[1.75rem] font-semibold leading-none tabular-nums text-ink">
                {formatCurrency(open.feeBalance)}
              </p>
              <p className="mt-1 text-[0.75rem] text-ink-mute">Second term, 2025/2026</p>
            </div>

            <dl className="space-y-2 rounded-2xl bg-canvas px-4 py-3">
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Guardian</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">{open.guardianName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Phone</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">{open.guardianPhone}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              {mayEdit ? (
                <>
                  <Button icon={Banknote} onClick={() => undefined}>
                    Record a payment
                  </Button>
                  <Button icon={Bell} tone="plain" onClick={() => setReminded(1)}>
                    Send a reminder
                  </Button>
                </>
              ) : (
                <p className="text-[0.8125rem] text-ink-mute">
                  Your role can see the position. Recording a payment belongs to the bursary.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

export default FinanceScreen;
