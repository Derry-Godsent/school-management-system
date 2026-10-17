import { useMemo, useState } from 'react';
import { BadgeCheck, Mail, Pencil, Phone, ShieldCheck, UserCog, UserPlus } from 'lucide-react';
import { roles, staffRoster } from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import {
  Avatar, Badge, Button, Card, CardHead, Drawer, Kpi, PageHead, SearchField, Segmented, Table, Td, Tr,
} from '../ui';

/**
 * Staff.
 *
 * Two questions sit behind this screen: who works here, and what are they
 * allowed to touch? The list answers the first. The permissions panel answers
 * the second by reading the same table the navigation is filtered with, so
 * what a director sees here is what the system actually enforces.
 */

const FILTERS = ['Everyone', 'Teaching', 'Office', 'On leave'] as const;

export function StaffScreen() {
  const { auth } = useStaffAuth();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Everyone');
  const [openId, setOpenId] = useState<string | null>(null);

  if (!auth) return null;

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return staffRoster.filter(person => {
      if (filter === 'Teaching' && !person.role.includes('Teacher')) return false;
      if (filter === 'Office' && !['School Administrator', 'Finance Officer', 'School Director'].includes(person.role)) return false;
      if (filter === 'On leave' && person.status !== 'On leave') return false;
      if (!needle) return true;
      return person.name.toLowerCase().includes(needle) || person.role.toLowerCase().includes(needle);
    });
  }, [query, filter]);

  const open = staffRoster.find(person => person.id === openId) ?? null;
  const teaching = staffRoster.filter(person => person.role.includes('Teacher')).length;

  return (
    <div className="space-y-5">
      <PageHead
        title="Staff"
        sub={`${staffRoster.length} people, ${teaching} of them teaching`}
        actions={<Button icon={UserPlus} onClick={() => undefined}>Add a staff member</Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={UserCog} tone="orange" label="On the staff" value={staffRoster.length} note="In this demonstration" />
        <Kpi icon={BadgeCheck} tone="green" label="In school" value={staffRoster.filter(person => person.status === 'In school').length} note="Signed in or on site" />
        <Kpi icon={ShieldCheck} tone="purple" label="Roles in use" value={roles.length} note="From director to subject teacher" />
        <Kpi icon={Mail} tone="yellow" label="On leave" value={staffRoster.filter(person => person.status === 'On leave').length} note="Cover noted on the timetable" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <SearchField value={query} onChange={setQuery} placeholder="Search a name or a role" />
          <Segmented options={FILTERS} value={filter} onChange={setFilter} label="Filter staff" />
        </div>
        <Table head={['Name', 'Role', 'Department', 'Classes', 'Status', '']}>
          {rows.map(person => (
            <Tr key={person.id}>
              <Td label="Name" strong>
                <span className="flex items-center gap-2.5">
                  <Avatar name={person.name} size="sm" />
                  {person.name}
                </span>
              </Td>
              <Td label="Role">{person.role}</Td>
              <Td label="Department">{person.department}</Td>
              <Td label="Classes">{person.classes}</Td>
              <Td label="Status">
                <Badge tone={person.status === 'In school' ? 'green' : person.status === 'On leave' ? 'yellow' : 'plain'}>
                  {person.status}
                </Badge>
              </Td>
              <Td align="right">
                <Button tone="plain" onClick={() => setOpenId(person.id)}>
                  Open
                </Button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* What each role may touch.                                           */}
      {/* ------------------------------------------------------------------ */}
      <Card>
        <CardHead
          title="Who may do what"
          sub="The same table the console uses to draw itself"
          icon={ShieldCheck}
          tone="purple"
          action={<Button to="/admin/access" tone="plain">The full matrix</Button>}
        />
        <ul>
          {roles.map(role => (
            <li key={role.id} className="flex flex-col gap-1 border-t border-rule px-4 py-3 first:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-2.5">
                <Avatar name={role.name} size="sm" tone={role.tone} />
                <div>
                  <p className="text-[0.8125rem] font-medium text-ink">{role.title}</p>
                  <p className="text-[0.6875rem] text-ink-mute">{role.name}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:justify-end">
                {role.focuses.map(focus => (
                  <Badge key={focus} tone="plain">{focus}</Badge>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open?.name ?? 'Staff member'}>
        {open ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={open.name} size="lg" tone="orange" />
              <div>
                <p className="text-[1rem] font-semibold text-ink">{open.name}</p>
                <p className="text-[0.8125rem] text-ink-mute">{open.role}</p>
                <div className="mt-1.5">
                  <Badge tone={open.status === 'In school' ? 'green' : 'yellow'}>{open.status}</Badge>
                </div>
              </div>
            </div>

            <dl className="space-y-2 rounded-2xl bg-canvas px-4 py-3">
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Department</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">{open.department}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Classes</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">{open.classes}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[0.75rem] text-ink-mute">Email</dt>
                <dd className="truncate text-[0.8125rem] font-medium text-ink">{open.email}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${open.phone.replace(/\s/g, '')}`}
                className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-gold px-4 text-[0.8125rem] font-semibold text-ink"
              >
                <Phone size={15} aria-hidden="true" /> Call
              </a>
              <a
                href={`mailto:${open.email}`}
                className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-canvas px-4 text-[0.8125rem] font-semibold text-ink"
              >
                <Mail size={15} aria-hidden="true" /> Email
              </a>
              <Button tone="plain" icon={Pencil} onClick={() => undefined}>
                Edit record
              </Button>
            </div>

            <p className="text-[0.75rem] leading-relaxed text-ink-mute">
              Removing a staff member takes away their sign in the same minute. Their records stay
              in the audit trail.
            </p>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

export default StaffScreen;
