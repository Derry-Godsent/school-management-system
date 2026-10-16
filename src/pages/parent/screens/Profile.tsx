import { Link } from 'react-router-dom';
import { LogOut, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { school } from '../../../data';
import { classInfo, wardAverage, wardStanding } from '../../../data/portal';
import { useParentAuth } from '../AuthContext';
import { useWard } from '../PortalShell';
import { Avatar, Card, CardBody, CardHead, Chip, StatTile } from '../ui';

export function ProfileScreen() {
  const { auth, logout } = useParentAuth();
  const { guardian, wards, childId, setChildId } = useWard();

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink">Account</h1>
        <p className="mt-1 text-[0.8125rem] text-ink-mute">{auth?.email}</p>
      </div>

      {/* The guardian, once, as one quiet card. */}
      <Card shape="top" tone="orange">
        <CardBody>
          <div className="flex items-center gap-4">
            <Avatar name={guardian?.name ?? 'Parent'} size="lg" tone="ink" />
            <div className="min-w-0">
              <p className="font-display text-lg text-ink">{guardian?.name}</p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-mute">{guardian?.phone}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Chip tone="orange">{wards.length} {wards.length === 1 ? 'child' : 'children'} at the school</Chip>
            <Chip tone="plain">{guardian?.relation}</Chip>
          </div>
          <p className="mt-3 text-[0.75rem] text-ink-mute">
            To change a name or number, tell the school office.
          </p>
        </CardBody>
      </Card>

      {/* The children, each as a card that can be opened. */}
      <div className="grid gap-4 sm:grid-cols-2">
        {wards.map(ward => {
          const standing = wardStanding(ward.id);
          const klass = classInfo[ward.classId];
          const open = ward.id === childId;
          return (
            <Card key={ward.id} shape={open ? 'left' : 'bare'} tone={open ? 'orange' : 'plain'}>
              <CardBody>
                <div className="flex items-center gap-3.5">
                  <Avatar name={ward.name} size="lg" tone={open ? 'orange' : undefined} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-ink">{ward.name}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
                      {ward.className} · {ward.house} House
                    </p>
                  </div>
                  {open ? <Chip tone="orange" solid>Open</Chip> : null}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-cream px-2.5 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Average</p>
                    <p className="mt-0.5 font-display text-lg leading-none text-ink">{wardAverage(ward.id).toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg bg-cream px-2.5 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Position</p>
                    <p className="mt-0.5 font-display text-lg leading-none text-ink">{standing.rank}/{standing.size}</p>
                  </div>
                  <div className="rounded-lg bg-cream px-2.5 py-2">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Teacher</p>
                    <p className="mt-0.5 truncate text-[0.75rem] font-medium leading-tight text-ink">
                      {klass?.formTeacher.name.replace(/^(Mr\.|Madam)\s+/, '')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChildId(ward.id)}
                  disabled={open}
                  className={`mt-3 w-full rounded-lg px-3.5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] ${
                    open ? 'bg-cream text-ink-mute' : 'bg-ink text-paper'
                  }`}
                >
                  {open ? 'Showing now' : 'Open this child'}
                </button>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatTile label="Children" value={wards.length} note="At this school" tone="green" />
        <StatTile label="Sign in" value="Parent" note={auth?.email.split('@')[0]} tone="purple" />
        <StatTile label="Portal" value="Demo" note="Sample records" tone="yellow" />
      </div>

      {/* The school, and the way out. */}
      <Card shape="top" tone="purple">
        <CardBody>
          <CardHead eyebrow="The school" title="How to reach it" />
          <div className="space-y-2.5">
            <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-[0.875rem] font-medium text-ink">
              <Phone size={16} className="text-purple-deep" aria-hidden="true" />
              {school.phone}
            </a>
            <a href={`mailto:${school.email}`} className="flex items-center gap-3 text-[0.875rem] font-medium text-ink">
              <Mail size={16} className="text-purple-deep" aria-hidden="true" />
              {school.email}
            </a>
            <p className="flex items-start gap-3 text-[0.875rem] text-ink">
              <MapPin size={16} className="mt-0.5 shrink-0 text-purple-deep" aria-hidden="true" />
              {school.address}
            </p>
          </div>
          <p className="mt-3 text-[0.75rem] text-ink-mute">
            Office open Monday to Friday, 7:30am to 4:30pm. Saturday until noon.
          </p>
        </CardBody>
      </Card>

      <Card shape="dark">
        <CardBody>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-yellow">Done for now</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-3.5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink"
            >
              <LogOut size={13} aria-hidden="true" /> Sign out
            </button>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-lg border border-paper px-3.5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-paper"
            >
              <ShieldCheck size={13} aria-hidden="true" /> School Admin
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ProfileScreen;
