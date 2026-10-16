import { CheckCircle2, Download, Phone } from 'lucide-react';
import { formatCurrency } from '../../../data';
import { formatLongDate, paymentChannels } from '../../../data/portal';
import { useWard } from '../PortalShell';
import { Badge, Eyebrow, Meter, SectionHead, Stat } from '../ui';

/**
 * Fees.
 *
 * Three numbers and nothing else at the top: what was billed, what has been
 * paid, and what is left. A parent opening this screen wants the third one, so
 * it is the largest thing on the page, and the line by line breakdown sits
 * underneath for when they want to check it.
 */
export function FeesScreen() {
  const { child, profile, klass, fees } = useWard();

  if (!child || !profile || !klass) return null;

  const paid = fees.charged > 0 ? Math.round((fees.paid / fees.charged) * 100) : 0;
  const clear = fees.balance <= 0;

  return (
    <div className="space-y-10">
      <section>
        <Eyebrow>Fees</Eyebrow>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          {child.name} · {klass.name}
        </h1>
        <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-mute">
          Second Term, 2025/2026. Every payment the office records appears here, usually the same day
          it is made.
        </p>
      </section>

      {/* ------------------------------------------------------------- the three numbers */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Billed this term" value={formatCurrency(fees.charged)} note="Tuition, feeding, transport and the rest" />
        <Stat label="Paid so far" value={formatCurrency(fees.paid)} note={`${paid}% of the bill`} tone="green" />
        <Stat
          label={clear ? 'Nothing owing' : 'Balance to pay'}
          value={clear ? 'All clear' : formatCurrency(fees.balance)}
          note={clear ? 'Thank you, the account is settled' : `Due by ${formatLongDate(profile.fees.nextDue.date)}`}
          tone={clear ? 'green' : 'orange'}
        />
      </section>

      <section className="bg-paper px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">
            Progress on this term's bill
          </p>
          {clear ? (
            <Badge tone="green">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={12} aria-hidden="true" /> Fully paid
              </span>
            </Badge>
          ) : (
            <Badge tone="orange">{formatCurrency(fees.balance)} outstanding</Badge>
          )}
        </div>
        <div className="mt-3">
          <Meter value={fees.paid} max={fees.charged} tone={clear ? 'green' : 'orange'} />
        </div>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-mute">
          {clear
            ? 'Nothing further is owing for this term. Next term is billed about two weeks before it opens.'
            : profile.fees.nextDue.note}
        </p>
      </section>

      {/* ------------------------------------------------------------- the breakdown */}
      <section>
        <SectionHead
          eyebrow="Line by line"
          title="What the bill is made of"
          note="Each line shows what was charged, what has been paid against it, and what is left."
        />
        <ul className="bg-paper">
          {profile.fees.lines.map(line => {
            const balance = line.charged - line.paid;
            return (
              <li key={line.category} className="border-b border-rule px-4 py-4 last:border-b-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[0.9375rem] font-medium text-ink">{line.category}</p>
                  <p className={`text-[0.9375rem] font-medium ${balance > 0 ? 'text-gold-deep' : 'text-green-deep'}`}>
                    {balance > 0 ? `${formatCurrency(balance)} left` : 'Settled'}
                  </p>
                </div>
                <div className="mt-2">
                  <Meter value={line.paid} max={line.charged} tone={balance > 0 ? 'orange' : 'green'} />
                </div>
                <p className="mt-2 text-[0.8125rem] text-ink-mute">
                  Charged {formatCurrency(line.charged)}, paid {formatCurrency(line.paid)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------------- the history */}
      <section>
        <SectionHead
          eyebrow="Payments received"
          title="Where the money went"
          action={
            <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">
              <Download size={14} aria-hidden="true" /> Receipt at the office
            </span>
          }
        />
        <ul className="bg-paper">
          {profile.fees.history.map(payment => (
            <li key={payment.reference} className="flex flex-wrap items-start justify-between gap-3 border-b border-rule px-4 py-3.5 last:border-b-0">
              <div className="min-w-0">
                <p className="text-[0.875rem] font-medium text-ink">{payment.category}</p>
                <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
                  {formatLongDate(payment.date)} · {payment.method}
                </p>
                <p className="mt-0.5 text-[0.75rem] text-ink-mute">Reference {payment.reference}</p>
              </div>
              <p className="font-display text-lg text-ink">{formatCurrency(payment.amount)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------- how to pay */}
      <section>
        <SectionHead eyebrow="How to pay" title="Ways to settle a balance" note="The office issues a receipt for every payment, and it appears here within a day." />
        <ul className="grid gap-px bg-rule sm:grid-cols-3">
          {paymentChannels.map(channel => (
            <li key={channel.label} className="bg-paper px-4 py-4">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                {channel.label}
              </p>
              <p className="mt-2 text-[0.9375rem] font-medium text-ink">{channel.value}</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-mute">{channel.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-mute">
          Something on this page that does not match your receipt? The accounts office can check the
          ledger with you.
        </p>
        <a
          href="tel:+233241234567"
          className="mt-3 inline-flex items-center gap-2 bg-ink px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
        >
          <Phone size={14} aria-hidden="true" />
          Call the accounts office
        </a>
      </section>
    </div>
  );
}

export default FeesScreen;
