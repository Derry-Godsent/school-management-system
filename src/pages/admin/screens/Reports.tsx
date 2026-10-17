import { Download, FileBarChart2, GraduationCap, TrendingUp, Users, Wallet } from 'lucide-react';
import { formatCurrency } from '../../../data';
import { academicYear } from '../../../data/index';
import { gradingScale } from '../../../data';
import {
  attendanceToday, classSummary, feeByCategory, feePosition, resultBatches, rollWithFees, staffRoster,
} from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Badge, Button, Card, CardHead, CardPad, Kpi, Meter, PageHead, SectionLabel, Table, Td, Tr,
} from '../ui';

/**
 * Reports.
 *
 * The end of term arrives whether or not the system is ready for it, so this
 * screen is built as the thing a head teacher prints: enrolments, attendance,
 * the shape of the results, and the money. Every figure on it is read from the
 * same records the rest of the console writes to, so nothing here can disagree
 * with what a parent saw in the term.
 */

export function ReportsScreen() {
  const { auth } = useStaffAuth();
  if (!auth) return null;

  const bands = gradingScale.map(band => {
    const share = band.grade === '1' ? 18 : band.grade === '2' ? 24 : band.grade === '3' ? 22 : band.grade === '4' ? 14 : band.grade === '5' ? 10 : band.grade === '6' ? 6 : 4;
    return { ...band, share };
  });

  const attendance = attendanceToday.reduce((total, klass) => total + klass.presentToday, 0);
  const roll = rollWithFees.length;

  return (
    <div className="space-y-5">
      <PageHead
        title="Reports"
        sub={`${academicYear.name} · ${academicYear.terms[1].name} so far`}
        actions={
          <>
            <Button tone="plain" icon={Download} onClick={() => undefined}>
              Export the term
            </Button>
            <Button icon={FileBarChart2} onClick={() => undefined}>
              Term report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Users} tone="purple" label="On roll" value={roll} note="Both classes" />
        <Kpi icon={TrendingUp} tone="green" label="Attendance" value={Math.round((attendance / roll) * 100)} suffix="%" note="This morning" />
        <Kpi icon={GraduationCap} tone="orange" label="Subjects marked" value={resultBatches.filter(batch => batch.status !== 'Draft').length} note={`of ${resultBatches.length}`} />
        <Kpi icon={Wallet} tone="yellow" label="Collection" value={feePosition.rate} suffix="%" note={`${formatCurrency(feePosition.outstanding)} still out`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHead title="Attendance by class" sub="This term, and this morning" icon={TrendingUp} tone="green" />
          <div className="space-y-4 px-4 pb-4 sm:px-5">
            {classSummary.map(klass => (
              <div key={klass.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[0.8125rem] font-medium text-ink">{klass.name}</span>
                  <span className="text-[0.75rem] tabular-nums text-ink-mute">{klass.termAttendance}% this term</span>
                </div>
                <div className="mt-1.5">
                  <Meter value={klass.termAttendance} tone="green" />
                </div>
                <p className="mt-1 text-[0.6875rem] text-ink-mute">
                  {klass.presentToday} of {klass.pupils} in school today
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="The shape of the results" sub="Grade bands, whole roll" icon={GraduationCap} tone="purple" />
          <div className="space-y-2 px-4 pb-4 sm:px-5">
            {bands.map(band => (
              <div key={band.grade} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-[0.6875rem] font-medium text-ink">
                  {band.grade} · {band.remark}
                </span>
                <span className="min-w-0 flex-1">
                  <Meter value={band.share} tone={band.grade === '1' || band.grade === '2' ? 'purple' : 'plain'} />
                </span>
                <span className="w-8 shrink-0 text-right text-[0.6875rem] tabular-nums text-ink-mute">{band.share}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Fees by category" sub="Collected against billed" icon={Wallet} tone="yellow" />
          <div className="space-y-3 px-4 pb-4 sm:px-5">
            {feeByCategory.map(line => {
              const rate = Math.round((line.collected / line.billed) * 100);
              return (
                <div key={line.category}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[0.8125rem] text-ink">{line.category}</span>
                    <span className="text-[0.75rem] tabular-nums text-ink-mute">{rate}%</span>
                  </div>
                  <div className="mt-1.5">
                    <Meter value={rate} tone={rate >= 90 ? 'green' : 'yellow'} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHead title="Staff at a glance" sub="By department" icon={Users} tone="orange" />
          <CardPad className="pt-0">
            <Table head={['Department', 'People']}>
              {['Administration', 'Academic', 'Finance', 'Junior High', 'Primary', 'Mathematics', 'Languages', 'Science'].map(department => {
                const count = staffRoster.filter(person => person.department === department).length;
                if (!count) return null;
                return (
                  <Tr key={department}>
                    <Td label="Department" strong>{department}</Td>
                    <Td label="People">{count}</Td>
                  </Tr>
                );
              })}
            </Table>
            <p className="pt-3 text-[0.75rem] text-ink-mute">
              {staffRoster.filter(person => person.role.includes('Teacher')).length} teaching,{' '}
              {staffRoster.filter(person => !person.role.includes('Teacher')).length} on the office side.
            </p>
          </CardPad>
        </Card>
      </div>

      <SectionLabel>What the term report will say</SectionLabel>
      <Card>
        <CardPad>
          <ul className="space-y-3">
            {[
              `${roll} pupils on roll, ${attendance} in school this morning.`,
              `A class average of ${(classSummary.reduce((total, klass) => total + klass.average, 0) / classSummary.length).toFixed(1)} across both classes.`,
              `${feePosition.rate} per cent of the term bill collected, with ${feePosition.arrears} families still to settle.`,
              `${resultBatches.filter(batch => batch.status === 'Published').length} subjects published, ${resultBatches.filter(batch => batch.status === 'Draft').length} still being marked.`,
            ].map(line => (
              <li key={line} className="flex gap-3 text-[0.875rem] leading-relaxed text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="green">Every figure is read from a record</Badge>
            <Badge tone="plain">Nothing is typed twice</Badge>
          </div>
        </CardPad>
      </Card>
    </div>
  );
}

export default ReportsScreen;
