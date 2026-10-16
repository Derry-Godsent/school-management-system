import { CheckCircle2, Phone } from 'lucide-react';
import { formatCurrency } from '../../../data';
import { formatDate, formatLongDate, paymentChannels } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Card, CardBody, CardHead, Chip, Meter, StatTile } from '../ui';

export function FeesScreen() {
  const { child, profile, klass, fees } = useWard();

  if (!child || !profile || !klass) return null;

  const paid = fees.charged > 0 ? Math.round((fees.paid / fees.charged) * 100) : 0;
  const clear = fees.balance <= 0;

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink">Fees</h1>
        <p className="mt-1 text-[0.8125rem] text-ink-mute">
          {child.name} · {klass.name} · Second Term
        </p>
      </div>

      {/* The one number that matters gets the biggest, brightest card. */}
      {clear ? (
        <Card tone="green" shape="solid">
          <CardBody>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green">
                <CheckCircle2 size={24} className="text-ink" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-green-deep">
                  Nothing owing
                </p>
                <p className="mt-1 font-display text-2xl text-ink">All clear</p>
              </div>
            </div>
            <p className="mt-3 text-[0.8125rem] text-ink-mute">
              Next term is billed about two weeks before it opens.
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card tone="yellow" shape="solid">
          <CardBody>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-yellow-deep">
                  Balance to pay
                </p>
                <p className="mt-1 font-display text-[2.25rem] leading-none text-ink">
                  {formatCurrency(fees.balance)}
                </p>
              </div>
              <Chip tone="ink" solid>
                Due {formatDate(profile.fees.nextDue.date)}
              </Chip>
            </div>
            <div className="mt-4">
              <Meter value={fees.paid} max={fees.charged} tone="ink" />
            </div>
            <p className="mt-2 text-[0.8125rem] text-ink-mute">
              {paid}% of this term's bill has been paid.
            </p>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatTile label="Billed" value={formatCurrency(fees.charged).replace('GHS ', '')} note="This term" tone="orange" />
        <StatTile label="Paid" value={formatCurrency(fees.paid).replace('GHS ', '')} note={`${paid}% of the bill`} tone="green" />
        <StatTile
          label="Balance"
          value={clear ? '0' : formatCurrency(fees.balance).replace('GHS ', '')}
          note={clear ? 'Settled' : 'Outstanding'}
          tone={clear ? 'plain' : 'purple'}
        />
      </div>

      {/* Line by line, each line its own little card. */}
      <Card shape="top" tone="orange">
        <CardBody>
          <CardHead eyebrow="Line by line" title="What the bill covers" />
          <ul className="space-y-2.5">
            {profile.fees.lines.map(line => {
              const balance = line.charged - line.paid;
              const settled = balance <= 0;
              return (
                <li key={line.category} className={`rounded-xl px-3.5 py-3 ${settled ? 'bg-tint-green' : 'bg-tint-orange'}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-[0.875rem] font-medium text-ink">{line.category}</p>
                    <p className={`text-[0.8125rem] font-semibold ${settled ? 'text-green-deep' : 'text-gold-deep'}`}>
                      {settled ? 'Settled' : `${formatCurrency(balance)} left`}
                    </p>
                  </div>
                  <div className="mt-2">
                    <Meter value={line.paid} max={line.charged} tone={settled ? 'green' : 'orange'} />
                  </div>
                  <p className="mt-1.5 text-[0.75rem] text-ink-mute">
                    {formatCurrency(line.charged)} charged · {formatCurrency(line.paid)} paid
                  </p>
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>

      {/* Payments received. */}
      <Card shape="top" tone="green">
        <CardBody>
          <CardHead eyebrow="Payments received" title={`${profile.fees.history.length} payments this term`} />
          <ul className="space-y-2">
            {profile.fees.history.map(payment => (
              <li key={payment.reference} className="flex items-center justify-between gap-3 rounded-xl bg-cream px-3.5 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-[0.8125rem] font-medium text-ink">{payment.category}</span>
                  <span className="block text-[0.75rem] text-ink-mute">
                    {formatLongDate(payment.date)} · {payment.method}
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-green px-2 py-1 text-[0.75rem] font-bold text-ink">
                  {formatCurrency(payment.amount).replace('GHS ', '')}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* How to pay, as three small cards. */}
      <Card shape="top" tone="purple">
        <CardBody>
          <CardHead eyebrow="How to pay" title="Three ways" />
          <ul className="grid gap-2.5 sm:grid-cols-3">
            {paymentChannels.map(channel => (
              <li key={channel.label} className="rounded-xl bg-tint-purple px-3.5 py-3">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-purple-deep">
                  {channel.label}
                </p>
                <p className="mt-1.5 text-[0.875rem] font-medium text-ink">{channel.value}</p>
                <p className="mt-1 text-[0.75rem] leading-snug text-ink-mute">{channel.note}</p>
              </li>
            ))}
          </ul>
          <a
            href="tel:+233241234567"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-paper"
          >
            <Phone size={13} aria-hidden="true" /> Accounts office
          </a>
        </CardBody>
      </Card>
    </div>
  );
}

export default FeesScreen;
