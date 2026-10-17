import { Banknote, CheckCircle2, CreditCard, Phone, Receipt, Smartphone, Wallet } from 'lucide-react';
import { formatCurrency } from '../../../data';
import { formatDate, formatLongDate, paymentChannels } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Card, CardPad, Chip, IconChip, Meter, Rule, ScreenTitle, StatCard } from '../ui';

export function FeesScreen() {
  const { child, profile, klass, fees } = useWard();

  if (!child || !profile || !klass) return null;

  const paid = fees.charged > 0 ? Math.round((fees.paid / fees.charged) * 100) : 0;
  const clear = fees.balance <= 0;

  return (
    <div className="space-y-5">
      <ScreenTitle title="Fees" sub={`${child.name} · ${klass.name} · Second Term`} />

      {/* The one figure that matters, on the one saturated card a screen gets. */}
      {clear ? (
        <Card variant="tint" tone="green">
          <CardPad>
            <div className="flex items-center gap-3.5">
              <IconChip icon={CheckCircle2} tone="green" size="lg" />
              <div>
                <Chip tone="green">Nothing owing</Chip>
                <p className="mt-1.5 text-[1.75rem] font-semibold leading-none text-ink">All clear</p>
              </div>
            </div>
            <div className="mt-4">
              <Meter value={fees.paid} max={fees.charged} tone="green" />
            </div>
            <p className="mt-2.5 text-[0.8125rem] text-ink-mute">
              {formatCurrency(fees.paid)} paid of {formatCurrency(fees.charged)}. Next term is billed about two
              weeks before it opens.
            </p>
          </CardPad>
        </Card>
      ) : (
        <Card variant="tint" tone="yellow">
          <CardPad>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Chip tone="yellow">Balance to pay</Chip>
                <p className="mt-2 text-[2rem] font-semibold leading-none tabular-nums text-ink">
                  {formatCurrency(fees.balance)}
                </p>
              </div>
              <Chip tone="plain">Due {formatDate(profile.fees.nextDue.date)}</Chip>
            </div>
            <div className="mt-4">
              <Meter value={fees.paid} max={fees.charged} tone="yellow" />
            </div>
            <p className="mt-2.5 text-[0.8125rem] text-ink-mute">
              {paid}% of this term&apos;s bill has been paid.
            </p>
            <a
              href="tel:+233241234567"
              className="mt-3.5 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-gold px-4 text-[0.8125rem] font-semibold text-ink"
            >
              <Phone size={15} aria-hidden="true" /> Pay or ask about it
            </a>
          </CardPad>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
        <StatCard icon={Receipt} label="Billed" value={formatCurrency(fees.charged).replace('GHS ', '')} note="This term" tone="orange" />
        <StatCard icon={CheckCircle2} label="Paid" value={formatCurrency(fees.paid).replace('GHS ', '')} note={`${paid}% of the bill`} tone="green" />
        <StatCard
          icon={Wallet}
          label="Balance"
          value={clear ? '0' : formatCurrency(fees.balance).replace('GHS ', '')}
          note={clear ? 'Settled' : 'Outstanding'}
          tone={clear ? 'plain' : 'purple'}
        />
      </div>

      {/* Line by line, as soft rows inside one card. */}
      <Card>
        <CardPad>
          <div className="mb-2 flex items-center gap-2.5">
            <IconChip icon={Receipt} tone="orange" size="sm" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">What the bill covers</h2>
          </div>
          <ul className="-mx-4">
            {profile.fees.lines.map((line, index) => {
              const balance = line.charged - line.paid;
              const settled = balance <= 0;
              return (
                <li key={line.category}>
                  {index > 0 ? <Rule /> : null}
                  <div className="px-4 py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-[0.875rem] font-medium text-ink">{line.category}</p>
                      <p className={`text-[0.8125rem] font-semibold tabular-nums ${settled ? 'text-green-deep' : 'text-gold-deep'}`}>
                        {settled ? 'Settled' : `${formatCurrency(balance)} left`}
                      </p>
                    </div>
                    <div className="mt-2">
                      <Meter value={line.paid} max={line.charged} tone={settled ? 'green' : 'orange'} />
                    </div>
                    <p className="mt-1.5 text-[0.75rem] tabular-nums text-ink-mute">
                      {formatCurrency(line.charged)} charged · {formatCurrency(line.paid)} paid
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardPad>
      </Card>

      {/* Payments, as soft rows. */}
      <Card>
        <CardPad>
          <div className="mb-2 flex items-center gap-2.5">
            <IconChip icon={CreditCard} tone="green" size="sm" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">
              {profile.fees.history.length} payments received
            </h2>
          </div>
          <ul className="space-y-2">
            {profile.fees.history.map(payment => (
              <li key={payment.reference} className="flex items-center gap-3 rounded-2xl bg-canvas px-3.5 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.875rem] font-medium text-ink">{payment.category}</span>
                  <span className="block truncate text-[0.75rem] text-ink-mute">
                    {formatLongDate(payment.date)} · {payment.method}
                  </span>
                </span>
                <span className="shrink-0 rounded-xl bg-tint-green px-2.5 py-1.5 text-[0.8125rem] font-semibold tabular-nums text-green-deep">
                  {formatCurrency(payment.amount).replace('GHS ', '')}
                </span>
              </li>
            ))}
          </ul>
        </CardPad>
      </Card>

      {/* How to pay. */}
      <Card>
        <CardPad>
          <div className="mb-2 flex items-center gap-2.5">
            <IconChip icon={Banknote} tone="purple" size="sm" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">How to pay</h2>
          </div>
          <ul className="space-y-2">
            {paymentChannels.map((channel, index) => {
              const Icon = index === 0 ? Smartphone : index === 1 ? CreditCard : Banknote;
              return (
                <li key={channel.label} className="flex items-start gap-3 rounded-2xl bg-canvas px-3.5 py-3">
                  <IconChip icon={Icon} tone="purple" size="sm" />
                  <span className="min-w-0">
                    <span className="block text-[0.8125rem] font-medium text-ink">{channel.label}</span>
                    <span className="mt-0.5 block text-[0.8125rem] text-ink">{channel.value}</span>
                    <span className="mt-0.5 block text-[0.75rem] text-ink-mute">{channel.note}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </CardPad>
      </Card>
    </div>
  );
}

export default FeesScreen;
