export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-16 pb-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-gold-deep font-medium text-sm uppercase tracking-wide">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mt-3">Our Story</h1>
            <p className="text-lg text-ink-mute mt-4 leading-relaxed">
              Founded in 2008, Maple Grove International School has grown from a small kindergarten
              into one of Kumasi&apos;s most respected private educational institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 bg-cream">
              <h3 className="text-xl font-bold text-ink mb-4">Our Mission</h3>
              <p className="text-ink-mute leading-relaxed">
                To provide a holistic, quality education that develops the intellectual, moral,
                social and physical potential of every child, preparing them to become responsible
                citizens and future leaders.
              </p>
            </div>
            <div className="p-8 bg-cream">
              <h3 className="text-xl font-bold text-ink mb-4">Our Vision</h3>
              <p className="text-ink-mute leading-relaxed">
                To be the leading private school in the Ashanti Region, recognised for academic
                excellence, character development and innovative teaching that prepares children
                for a rapidly changing world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-ink mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Excellence', desc: 'We pursue the highest standards in everything we do.' },
              { title: 'Integrity', desc: 'We act with honesty, fairness and transparency.' },
              { title: 'Respect', desc: 'We value every individual and celebrate diversity.' },
              {
                title: 'Innovation',
                desc: 'We embrace new ideas and creative approaches to learning.',
              },
            ].map(value => (
              <div key={value.title} className="p-6 bg-paper">
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-4">
                  <span className="text-gold-deep font-bold text-sm">{value.title[0]}</span>
                </div>
                <h4 className="font-semibold text-ink mb-2">{value.title}</h4>
                <p className="text-sm text-ink-mute">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-ink mb-10">Leadership</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Mr. Kwame Asante',
                title: 'School Director / Proprietor',
                bio: 'An educationist with over 20 years of experience in private school management.',
              },
              {
                name: 'Mrs. Esi Boateng',
                title: 'Headteacher',
                bio: 'A qualified teacher with an MEd from KNUST and 15 years of classroom and leadership experience.',
              },
              {
                name: 'Mrs. Abena Mensah',
                title: 'Head of Administration',
                bio: 'Manages the school\u2019s operations, finance and parent relations with precision and care.',
              },
            ].map(person => (
              <div key={person.name} className="text-center">
                <div className="w-24 h-24 bg-rule mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-ink">
                    {person.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </span>
                </div>
                <h4 className="font-semibold text-ink">{person.name}</h4>
                <p className="text-sm text-gold-deep mb-2">{person.title}</p>
                <p className="text-sm text-ink-mute">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
