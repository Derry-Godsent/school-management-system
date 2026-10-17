import { useMemo, useState } from 'react';
import { CalendarCheck, GraduationCap, Phone, Search, UserPlus, Users, Wallet } from 'lucide-react';
import { formatCurrency } from '../../../data';
import {
  DEMO_TODAY, can, classesInScope, pupilsInScope, scopeFor, type PupilRecord, type RoleId,
} from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Avatar, Badge, Button, Card, CardPad, Drawer, Kpi, Meter, PageHead, SearchField, Segmented, Table, Td, Tr,
} from '../ui';

/**
 * The roll.
 *
 * Every pupil the school holds, in one table, with the few things a member of
 * staff needs before a conversation: who teaches them, how they are doing, how
 * often they are in, and whether the family still owes the school money.
 *
 * The money column is only drawn for a role that is allowed to see money at
 * all, and the drawer shows only the panels the role owns. That is the whole
 * permission model in one place, and a director can see it work by switching
 * role in the corner.
 */

const CLASSES = ['All classes'] as const;

export function StudentsScreen() {
  const { auth } = useStaffAuth();
  const [query, setQuery] = useState('');
  const [klass, setKlass] = useState<string>('All classes');
  const [openId, setOpenId] = useState<string | null>(null);

  if (!auth) return null;
  const seesMoney = can(auth.role, 'finance');
  const seesMarks = can(auth.role, 'academics');
  const mayEdit = can(auth.role, 'students', 'edit');
  const scope = scopeFor(auth.role);
  const inScope = pupilsInScope(auth.role);
  const myClasses = classesInScope(auth.role);
  const classFilters = ['All classes', ...myClasses.map(klass => klass.name)] as const;

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inScope.filter(pupil => {
      if (klass !== 'All classes' && pupil.className !== klass) return false;
      if (!needle) return true;
      return (
        pupil.name.toLowerCase().includes(needle) ||
        pupil.admissionNo.toLowerCase().includes(needle) ||
        pupil.guardianName.toLowerCase().includes(needle)
      );
    });
  }, [query, klass, inScope]);

  const open: PupilRecord | null = inScope.find(pupil => pupil.id === openId) ?? null;
  const owing = inScope.filter(pupil => pupil.feeBalance > 0);

  return (
    <div className="space-y-5">
      <PageHead
        title="Pupils"
        sub={
          scope.kind === 'school'
            ? `${inScope.length} on roll · ${inScope.filter(pupil => pupil.ward).length} in the demonstration family`
            : `${inScope.length} in ${scope.label}, the pupils you are assigned`
        }
        actions={
          mayEdit ? (
            <Button icon={UserPlus} onClick={() => undefined}>
              Admit a pupil
            </Button>
          ) : (
            <Badge tone="plain">Read only for your role</Badge>
          )
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Users} tone="purple" label="On roll" value={inScope.length} note={scope.kind === 'school' ? 'Two classes' : scope.label} />
        <Kpi icon={CalendarCheck} tone="green" label="In today" value={inScope.length - 6} note="Six are away or late" />
        {seesMarks ? (
          <Kpi
            icon={GraduationCap}
            tone="orange"
            label="Class average"
            value={
              Math.round((inScope.reduce((total, pupil) => total + pupil.average, 0) / Math.max(1, inScope.length)) * 10) / 10
            }
            note="Read from every subject"
          />
        ) : null}
        {seesMoney ? (
          <Kpi
            icon={Wallet}
            tone="yellow"
            label="Owing fees"
            value={owing.length}
            note={`${formatCurrency(owing.reduce((total, pupil) => total + pupil.feeBalance, 0))} in total`}
          />
        ) : null}
      </div>

      <Card>
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <SearchField value={query} onChange={setQuery} placeholder="Search a name or an admission number" />
          {myClasses.length > 1 ? (
            <Segmented options={classFilters} value={klass} onChange={setKlass} label="Filter by class" />
          ) : (
            <p className="text-[0.75rem] font-medium text-ink-mute">{scope.label} is your class.</p>
          )}
        </div>

        <Table head={['Pupil', 'Admission no', 'Class', 'Guardian', seesMarks ? 'Average' : 'Attendance', seesMoney ? 'Balance' : '', '']}>
          {rows.map(pupil => (
            <Tr key={`${pupil.classId}-${pupil.id}`}>
              <Td label="Pupil" strong>
                <span className="flex items-center gap-2.5">
                  <Avatar name={pupil.name} size="sm" tone={pupil.ward ? 'orange' : undefined} />
                  <span className="min-w-0">
                    <span className="block truncate">{pupil.name}</span>
                    {pupil.ward ? <span className="block text-[0.625rem] font-medium text-gold-deep">Demonstration family</span> : null}
                  </span>
                </span>
              </Td>
              <Td label="Admission no">{pupil.admissionNo}</Td>
              <Td label="Class">{pupil.className}</Td>
              <Td label="Guardian">{pupil.guardianName}</Td>
              {seesMarks ? (
                <Td label="Average">
                  <span className="tabular-nums">{pupil.average.toFixed(1)}</span>
                  <span className="ml-1 text-[0.6875rem] text-ink-mute">#{pupil.rank}</span>
                </Td>
              ) : null}
              {!seesMarks ? <Td label="Attendance">{pupil.attendance}%</Td> : null}
              {seesMoney ? (
                <Td label="Balance">
                  <span className={pupil.feeBalance ? 'font-semibold tabular-nums text-gold-deep' : 'tabular-nums text-green-deep'}>
                    {pupil.feeBalance ? formatCurrency(pupil.feeBalance) : 'Clear'}
                  </span>
                </Td>
              ) : null}
              <Td align="right">
                <Button tone="plain" onClick={() => setOpenId(pupil.id)}>
                  Open
                </Button>
              </Td>
            </Tr>
          ))}
          {!rows.length ? (
            <Tr>
              <Td>
                <span className="block py-4 text-center text-ink-mute">Nobody matches that search.</span>
              </Td>
            </Tr>
          ) : null}
        </Table>
        <p className="border-t border-rule px-4 py-3 text-[0.75rem] text-ink-mute sm:px-5">
          {rows.length} of {inScope.length} shown
        </p>
      </Card>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open?.name ?? 'Pupil'} wide>
        {open ? <PupilRecordView pupil={open} role={auth.role} /> : null}
      </Drawer>
    </div>
  );
}

/**
 * One pupil, as much of them as this role is allowed to see. A bursar gets the
 * money and the guardian. A subject teacher gets the marks. Neither gets both
 * unless their role does.
 */
function PupilRecordView({ pupil, role }: { pupil: PupilRecord; role: RoleId }) {
  const seesMarks = can(role, 'academics');
  const seesMoney = can(role, 'finance');
  const seesRegister = can(role, 'attendance');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar name={pupil.name} size="lg" tone="orange" />
        <div className="min-w-0">
          <p className="truncate text-[1.0625rem] font-semibold text-ink">{pupil.name}</p>
          <p className="text-[0.8125rem] text-ink-mute">
            {pupil.className} · {pupil.house} House · {pupil.admissionNo}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge tone="plain">{pupil.gender}</Badge>
            {pupil.duty ? <Badge tone="purple">{pupil.duty}</Badge> : null}
            {pupil.ward ? <Badge tone="orange">In the parent app</Badge> : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {seesMarks ? (
          <div className="rounded-2xl bg-tint-purple px-4 py-3">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-purple-deep">Average</p>
            <p className="mt-1 text-[1.5rem] font-semibold leading-none tabular-nums text-ink">{pupil.average.toFixed(1)}</p>
            <p className="mt-1 text-[0.6875rem] text-ink-mute">
              {pupil.rank} of {pupil.size} in the class
            </p>
          </div>
        ) : null}
        {seesRegister ? (
          <div className="rounded-2xl bg-tint-green px-4 py-3">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-green-deep">Attendance</p>
            <p className="mt-1 text-[1.5rem] font-semibold leading-none tabular-nums text-ink">{pupil.attendance}%</p>
            <p className="mt-1 text-[0.6875rem] text-ink-mute">This term</p>
          </div>
        ) : null}
        {seesMoney ? (
          <div className={`rounded-2xl px-4 py-3 ${pupil.feeBalance ? 'bg-tint-yellow' : 'bg-tint-green'}`}>
            <p className={`text-[0.625rem] font-semibold uppercase tracking-[0.1em] ${pupil.feeBalance ? 'text-yellow-deep' : 'text-green-deep'}`}>
              Fees
            </p>
            <p className="mt-1 text-[1.125rem] font-semibold leading-tight tabular-nums text-ink">
              {pupil.feeBalance ? formatCurrency(pupil.feeBalance) : 'All clear'}
            </p>
            <p className="mt-1 text-[0.6875rem] text-ink-mute">
              {pupil.feeBalance ? 'Still owing this term' : 'Nothing outstanding'}
            </p>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl bg-canvas px-4 py-3">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Guardian</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[0.875rem] font-medium text-ink">{pupil.guardianName}</p>
            <p className="text-[0.75rem] text-ink-mute">{pupil.guardianPhone}</p>
          </div>
          <a
            href={`tel:${pupil.guardianPhone.replace(/\s/g, '')}`}
            className="inline-flex min-h-[2.5rem] shrink-0 items-center gap-2 rounded-full bg-paper px-3.5 text-[0.75rem] font-semibold text-ink"
          >
            <Phone size={14} aria-hidden="true" />
            Call
          </a>
        </div>
      </div>

      {!seesMoney ? (
        <p className="rounded-2xl bg-tint-green px-4 py-3 text-[0.8125rem] leading-relaxed text-ink">
          Fees are handled by the bursary and are not shown to your role. What you see here is
          what the work says about the pupil.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button to="/admin/academics" tone="purple" icon={GraduationCap}>
          Results
        </Button>
        {seesMoney ? (
          <Button to="/admin/finance" tone="yellow" icon={Wallet}>
            Fee record
          </Button>
        ) : null}
        <Button to="/admin/attendance" tone="plain" icon={CalendarCheck}>
          Register
        </Button>
      </div>

      <p className="text-[0.75rem] text-ink-mute">Record as at {DEMO_TODAY}</p>
    </div>
  );
}

export default StudentsScreen;
