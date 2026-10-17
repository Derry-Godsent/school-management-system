import { Link } from 'react-router-dom';
import { LogOut, Mail, MapPin, Phone, ShieldCheck, UserCircle, Users } from 'lucide-react';
import { school } from '../../../data';
import { classInfo, wardAverage, wardStanding } from '../../../data/portal';
import { useParentAuth } from '../AuthContext';
import { useWard } from '../PortalShell';
import { Avatar, Card, CardPad, Chip, IconChip, ScreenTitle, StatCard } from '../ui';

export function ProfileScreen() {
  const { auth, logout } = useParentAuth();
  const { guardian, wards, childId, setChildId } = useWard();

  return (
    <div className="space-y-5">
      <ScreenTitle title="Account" sub={auth?.email} />

      <Card>
        <CardPad>
          <div className="flex items-center gap-3.5">
            <Avatar name={guardian?.name ?? 'Parent'} size="lg" tone="orange" />
            <div className="min-w-0">
              <p className="truncate text-[1.0625rem] font-semibold text-ink">{guardian?.name}</p>
              <p className="mt-0.5 truncate text-[0.8125rem] text-ink-mute">{guardian?.phone}</p>
            </div>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <Chip tone="green" icon={Users}>
              {wards.length} {wards.length === 1 ? 'child' : 'children'} at the school
            </Chip>
            <Chip tone="plain">{guardian?.relation}</Chip>
          </div>
        </CardPad>
      </Card>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
        <StatCard icon={Users} label="Children" value={wards.length} note="At this school" tone="green" />
        <StatCard icon={UserCircle} label="Sign in" value="Parent" note={auth?.email.split('@')[0]} tone="purple" />
        <StatCard icon={ShieldCheck} label="Portal" value="Demo" note="Sample records" tone="yellow" />
      </div>

      {/* Each child as a card that can be opened. */}
      <div className="grid gap-3 sm:grid-cols-2">
        {wards.map(ward => {
          const standing = wardStanding(ward.id);
          const klass = classInfo[ward.classId];
          const open = ward.id === childId;
          return (
            <Card key={ward.id} variant={open ? 'tint' : 'plain'} tone="orange">
              <CardPad>
                <div className="flex items-center gap-3.5">
                  <Avatar name={ward.name} size="md" tone={open ? 'orange' : undefined} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[1.0625rem] font-semibold text-ink">{ward.name}</p>
                    <p className="mt-0.5 truncate text-[0.8125rem] text-ink-mute">
                      {ward.className} · {ward.house} House
                    </p>
                  </div>
                  {open ? <Chip tone="green">Showing</Chip> : null}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-paper px-2.5 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-ink-mute">Average</p>
                    <p className="mt-1 text-[1.0625rem] font-semibold leading-none tabular-nums text-ink">
                      {wardAverage(ward.id).toFixed(1)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-paper px-2.5 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-ink-mute">Position</p>
                    <p className="mt-1 text-[1.0625rem] font-semibold leading-none tabular-nums text-ink">
                      {standing.rank}/{standing.size}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-paper px-2.5 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-ink-mute">Teacher</p>
                    <p className="mt-1 truncate text-[0.75rem] font-medium leading-tight text-ink">
                      {klass?.formTeacher.name.replace(/^(Mr\.|Madam)\s+/, '')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChildId(ward.id)}
                  disabled={open}
                  className={`mt-3 min-h-[2.75rem] w-full rounded-full text-[0.75rem] font-semibold ${
                    open ? 'bg-canvas text-ink-mute' : 'bg-gold text-ink'
                  }`}
                >
                  {open ? 'Showing now' : 'Open this child'}
                </button>
              </CardPad>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardPad>
          <div className="mb-3 flex items-center gap-2.5">
            <IconChip icon={Phone} tone="purple" size="sm" />
            <h2 className="text-[0.9375rem] font-semibold text-ink">Reach the school</h2>
          </div>
          <ul className="space-y-2">
            <li>
              <a
                href={`tel:${school.phone.replace(/\s/g, '')}`}
                className="flex min-h-[3rem] items-center gap-3 rounded-2xl bg-canvas px-3.5 text-[0.875rem] font-medium text-ink"
              >
                <Phone size={16} className="shrink-0 text-gold-deep" aria-hidden="true" />
                {school.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${school.email}`}
                className="flex min-h-[3rem] items-center gap-3 rounded-2xl bg-canvas px-3.5 text-[0.875rem] font-medium text-ink"
              >
                <Mail size={16} className="shrink-0 text-gold-deep" aria-hidden="true" />
                {school.email}
              </a>
            </li>
            <li className="flex items-start gap-3 rounded-2xl bg-canvas px-3.5 py-3 text-[0.875rem] text-ink">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
              {school.address}
            </li>
          </ul>
          <p className="mt-3 text-[0.75rem] text-ink-mute">
            Office open Monday to Friday, 7:30am to 4:30pm. Saturday until noon.
          </p>
        </CardPad>
      </Card>

      <Card>
        <CardPad>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-gold px-4 text-[0.75rem] font-semibold text-ink"
            >
              <LogOut size={14} aria-hidden="true" /> Sign out
            </button>
            <Link
              to="/admin"
              className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-canvas px-4 text-[0.75rem] font-semibold text-ink"
            >
              <ShieldCheck size={14} aria-hidden="true" /> School Admin
            </Link>
            <Link
              to="/"
              className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-canvas px-4 text-[0.75rem] font-semibold text-ink"
            >
              School website
            </Link>
          </div>
        </CardPad>
      </Card>
    </div>
  );
}

export default ProfileScreen;
