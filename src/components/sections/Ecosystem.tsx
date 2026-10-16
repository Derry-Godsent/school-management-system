import { useRef } from 'react';
import { GraduationCap, Users, Wallet, Bell, ShieldCheck, MessageSquare, Home } from 'lucide-react';
import {
  AnimatedBeam,
  AnimatedGauge,
  BeamNode,
  DeviceFrame,
  DiaTextReveal,
  Floating3DParticles,
} from '../magic';
import { Reveal3D, ScrollStage, SectionEdge } from '../fx';
import { ROLES } from '../magic/EcosystemPortals';

/**
 * Ecosystem: the one section of the site that argues for the product rather
 * than the school. It shows the four portals wired together and the parent
 * experience rendered on a phone, so a school owner can see what they would
 * actually be buying.
 */
export function Ecosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centreRef = useRef<HTMLDivElement>(null);
  const parentsRef = useRef<HTMLDivElement>(null);
  const teachersRef = useRef<HTMLDivElement>(null);
  const financeRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollStage className="bg-ink" tilt="up" depth={0.9}>
      <section className="relative overflow-hidden bg-ink">
        <SectionEdge from="cream" to="ink" direction="right" />
        <Floating3DParticles quantity={110} opacity={0.5} depth={0.9} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* ---- Left: the copy and the wiring diagram ---- */}
          <div>
            <Reveal3D y={36}>
              <span className="eyebrow">One system</span>
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-paper sm:text-4xl">
                One place for the marks, the fees and the notices
              </h2>
              <p className="mt-6 leading-relaxed text-paper/70">
                The school already keeps every record it needs. The trouble is where they
                are kept. Marks sit in a teacher&apos;s book. Fees sit in the office ledger.
                Notices go up on a board. So parents have to ask for each one.
              </p>
              <p className="mt-4 leading-relaxed text-paper/70">
                With the portal, each thing is entered once. Parents then open their phone
                and see it for themselves. No queue at the office, and no waiting until the
                end of term to find out how their child is doing.
              </p>
            </Reveal3D>

            <div
              ref={containerRef}
              className="relative mt-12 h-[300px] w-full overflow-hidden"
            >
              <div className="flex h-full flex-col justify-between py-2">
                <div className="flex items-start justify-between">
                  <BeamNode nodeRef={parentsRef} label="Parents" delay={0}>
                    <Users size={18} className="text-ink" />
                  </BeamNode>
                  <BeamNode nodeRef={teachersRef} label="Teachers" delay={0.6}>
                    <GraduationCap size={18} className="text-ink" />
                  </BeamNode>
                </div>

                <div className="flex items-center justify-center">
                  <BeamNode nodeRef={centreRef} label="Maple Grove" emphasis delay={0.3}>
                    <Home size={22} className="text-ink" />
                  </BeamNode>
                </div>

                <div className="flex items-end justify-between">
                  <BeamNode nodeRef={financeRef} label="Finance" delay={0.9}>
                    <Wallet size={18} className="text-ink" />
                  </BeamNode>
                  <BeamNode nodeRef={adminRef} label="Administration" delay={1.2}>
                    <ShieldCheck size={18} className="text-ink" />
                  </BeamNode>
                </div>
              </div>

              <AnimatedBeam
                containerRef={containerRef}
                fromRef={parentsRef}
                toRef={centreRef}
                curvature={-60}
                duration={3.4}
                delay={0}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={teachersRef}
                toRef={centreRef}
                curvature={-30}
                duration={3.4}
                delay={0.5}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={financeRef}
                toRef={centreRef}
                curvature={50}
                duration={3.4}
                delay={1}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={adminRef}
                toRef={centreRef}
                curvature={26}
                duration={3.4}
                delay={1.4}
                reverse
              />
            </div>

            <div className="mt-10 grid gap-10 border-t border-paper/15 pt-10 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12">
              <AnimatedGauge
                value={100}
                label="BECE Pass Rate"
                sublabel="Parents see this as soon as it is entered"
              />
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {ROLES.map(role => (
                  <li key={role} className="flex items-center gap-3 text-sm text-paper/70">
                    <span className="h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- Right: the parent experience on a phone ---- */}
          <Reveal3D axis="y" rotate={12} className="lg:pl-8">
            <p className="mb-6 text-center text-[0.6875rem] uppercase tracking-[0.22em] text-gold lg:text-left">
              Parent Portal:{' '}
              <DiaTextReveal
                text={[
                  'on the phone they already carry',
                  'marks, fees and notices',
                  'nothing to install',
                ]}
                interval={2400}
                repeatDelay={1200}
              />
            </p>

            <DeviceFrame>
              <div className="bg-cream p-4">
                {/* Mini portal header */}
                <div className="flex items-center justify-between border-b border-rule pb-3">
                  <div>
                    <p className="font-display text-sm font-bold text-ink">Good morning</p>
                    <p className="text-[0.625rem] text-ink-mute">Mrs. Yaa Boateng</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center bg-ink">
                    <span className="font-display text-[0.625rem] font-bold text-paper">YB</span>
                  </span>
                </div>

                {/* Ward */}
                <div className="mt-3 bg-ink p-3">
                  <p className="font-display text-sm text-paper">Adwoa Boateng</p>
                  <p className="text-[0.625rem] text-paper/70">JHS 2 • MG/2024/014</p>
                </div>

                {/* Quick figures */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Average', value: '82%' },
                    { label: 'Attendance', value: '96%' },
                  ].map(stat => (
                    <div key={stat.label} className="border-t-2 border-gold pt-2">
                      <p className="text-[0.625rem] uppercase tracking-[0.14em] text-ink-mute">
                        {stat.label}
                      </p>
                      <p className="font-display text-lg font-bold text-ink">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Fee balance */}
                <div className="mt-3 border border-rule p-3">
                  <div className="flex items-center gap-2">
                    <Wallet size={13} className="text-gold-deep" />
                    <p className="text-[0.625rem] uppercase tracking-[0.14em] text-ink-mute">
                      Balance
                    </p>
                  </div>
                  <p className="mt-1 font-display text-base font-bold text-ink">GH₵ 1,240</p>
                  <div className="mt-2 h-1 w-full bg-rule">
                    <div className="h-1 w-3/4 bg-gold" />
                  </div>
                  <p className="mt-1 text-[0.625rem] text-ink-mute">75% settled</p>
                </div>

                {/* Results */}
                <p className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-gold-deep">
                  Recent results
                </p>
                <ul className="mt-2 divide-y divide-rule border-t border-rule">
                  {[
                    ['Integrated Science', 'A1'],
                    ['Mathematics', 'B2'],
                    ['English Language', 'A1'],
                    ['Social Studies', 'B3'],
                  ].map(([subject, grade]) => (
                    <li key={subject} className="flex items-center justify-between py-2">
                      <span className="text-[0.6875rem] text-ink-mute">{subject}</span>
                      <span className="font-display text-[0.6875rem] font-bold text-ink">
                        {grade}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Announcements */}
                <p className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-gold-deep">
                  Notices
                </p>
                <div className="mt-2 space-y-2">
                  {[
                    { icon: Bell, text: 'PTC this Saturday, 9am' },
                    { icon: MessageSquare, text: 'Science exhibition photos added' },
                  ].map(item => (
                    <div key={item.text} className="flex items-start gap-2">
                      <item.icon size={12} className="mt-0.5 shrink-0 text-gold-deep" />
                      <span className="text-[0.6875rem] leading-snug text-ink-mute">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </DeviceFrame>
          </Reveal3D>
        </div>
      </div>
      </section>
    </ScrollStage>
  );
}

export default Ecosystem;
