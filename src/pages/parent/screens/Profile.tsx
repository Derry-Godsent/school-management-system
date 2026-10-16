import { Link } from 'react-router-dom';
import { LogOut, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { school, students } from '../../../data';
import { classInfo, wardAverage, wardStanding } from '../../../data/portal';
import { useParentAuth } from '../AuthContext';
import { useWard } from '../PortalShell';
import { Avatar, Badge, Eyebrow, SectionHead } from '../ui';

/**
 * Account.
 *
 * The guardian, the children, the school's contact details, and the way out.
 * A parent with more than one child needs one place where they can see all of
 * them at once, so that is the middle of this page.
 */
export function ProfileScreen() {
  const { auth, logout } = useParentAuth();
  const { guardian, wards, childId, setChildId } = useWard();

  return (
    <div className="space-y-10">
      <section>
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{guardian?.name}</h1>
        <p className="mt-2 text-[0.9375rem] text-ink-mute">
          Signed in as {auth?.email}. This address is the one the school writes to.
        </p>
      </section>

      <section className="bg-paper px-4 py-5">
        <SectionHead eyebrow="Your details" title="What the school holds" />
        <dl className="border-t border-rule">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2.5">
            <dt className="text-[0.8125rem] text-ink-mute">Name</dt>
            <dd className="text-[0.875rem] font-medium text-ink">{guardian?.name}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2.5">
            <dt className="text-[0.8125rem] text-ink-mute">Email</dt>
            <dd className="text-[0.875rem] font-medium text-ink">{guardian?.email}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2.5">
            <dt className="text-[0.8125rem] text-ink-mute">Phone</dt>
            <dd className="text-[0.875rem] font-medium text-ink">{guardian?.phone}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
            <dt className="text-[0.8125rem] text-ink-mute">Relationship</dt>
            <dd className="text-[0.875rem] font-medium text-ink">{guardian?.relation}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-mute">
          To change any of this, tell the school office. A name or a number is only changed on the
          school's own record when the office has confirmed it with you.
        </p>
      </section>

      <section>
        <SectionHead
          eyebrow="Your children"
          title={`${wards.length} ${wards.length === 1 ? 'child' : 'children'} at the school`}
          note="Choose one to open their pages, or read the summary of each below."
        />
        <ul className="space-y-3">
          {wards.map(ward => {
            const profile = students.find(student => student.id === ward.id);
            const standing = wardStanding(ward.id);
            const klass = classInfo[ward.classId];
            return (
              <li key={ward.id} className="bg-paper px-4 py-4">
                <div className="flex items-start gap-4">
                  <Avatar name={ward.name} size="lg" tone={ward.id === childId ? 'orange' : undefined} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg text-ink">{ward.name}</p>
                      {ward.id === childId ? <Badge tone="ink">Open now</Badge> : null}
                    </div>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-mute">
                      {ward.className} · {ward.house} House · {profile?.studentId}
                    </p>
                    <p className="mt-1.5 text-[0.875rem] text-ink-mute">
                      Average {wardAverage(ward.id).toFixed(1)}, {standing.rank} of {standing.size} in class
                      {klass ? `, form teacher ${klass.formTeacher.name}` : ''}
                    </p>
                    <button
                      type="button"
                      onClick={() => setChildId(ward.id)}
                      disabled={ward.id === childId}
                      className={`mt-3 px-3.5 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ${
                        ward.id === childId
                          ? 'bg-cream text-ink-mute'
                          : 'bg-ink text-paper'
                      }`}
                    >
                      {ward.id === childId ? 'Already open' : 'Open this child'}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bg-paper px-4 py-5">
        <SectionHead eyebrow="The school" title="How to reach it" />
        <div className="space-y-3">
          <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink">
            <Phone size={17} className="text-gold-deep" aria-hidden="true" />
            {school.phone}
          </a>
          <a href={`tel:${school.phoneAlt.replace(/\s/g, '')}`} className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink">
            <Phone size={17} className="text-gold-deep" aria-hidden="true" />
            {school.phoneAlt}
          </a>
          <a href={`mailto:${school.email}`} className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink">
            <Mail size={17} className="text-gold-deep" aria-hidden="true" />
            {school.email}
          </a>
          <p className="flex items-start gap-3 text-[0.9375rem] text-ink">
            <MapPin size={17} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
            {school.address}
          </p>
        </div>
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">
          The office is open Monday to Friday, 7:30am to 4:30pm, and Saturday morning until noon.
        </p>
      </section>

      <section className="bg-ink px-4 py-5">
        <Eyebrow tone="yellow">Done for now?</Eyebrow>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-paper">
          Signing out closes this session on this device. Nothing is deleted, and everything is here
          when you come back.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-4 inline-flex items-center gap-2 bg-gold px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink"
        >
          <LogOut size={14} aria-hidden="true" />
          Sign out
        </button>
        <Link
          to="/admin"
          className="ml-3 inline-flex items-center gap-2 border border-paper px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-paper"
        >
          <ShieldCheck size={14} aria-hidden="true" />
          School Admin
        </Link>
      </section>
    </div>
  );
}

export default ProfileScreen;
