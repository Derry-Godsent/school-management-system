import { departments } from '../../data';

const DEPARTMENT_DESCRIPTIONS: Record<string, string> = {
  'early-years':
    'Our Early Years programme creates a safe, stimulating environment where children aged 3 to 5 develop social, emotional, physical and cognitive skills through a blend of play-based learning and structured activities. We follow the GES Early Years curriculum framework.',
  primary:
    'The Primary programme builds strong foundations in literacy, numeracy, science, creative arts and social studies. Students follow the Ghana Education Service curriculum enriched with Cambridge Primary elements in Mathematics, Science and English.',
  jhs: 'Our JHS programme provides rigorous academic preparation for the BECE while offering Cambridge Enrichment for students who wish to pursue international benchmarks. Students choose between the Ghanaian Core and Cambridge Enrichment streams.',
};

const DEPARTMENT_VISUALS = [
  { emoji: '🧒', gradient: 'from-orange-100 to-orange-200' },
  { emoji: '📖', gradient: 'from-blue-100 to-blue-200' },
  { emoji: '🎓', gradient: 'from-green-100 to-green-200' },
];

export default function AcademicsPage() {
  return (
    <div>
      <section className="pt-16 pb-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-gold-deep font-medium text-sm uppercase tracking-wide">
              Academics
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mt-3">
              Our Academic Programmes
            </h1>
            <p className="text-lg text-ink-mute mt-4 leading-relaxed">
              We offer a blended curriculum that combines the Ghanaian national curriculum with
              Cambridge international standards, giving students a strong local foundation with
              global perspective.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {departments.map((dept, i) => {
            const visual = DEPARTMENT_VISUALS[i % DEPARTMENT_VISUALS.length];
            return (
              <div key={dept.id} className="grid lg:grid-cols-2 gap-12 items-start">
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <h3 className="text-2xl font-bold text-ink mb-4">{dept.name}</h3>
                  <p className="text-ink-mute leading-relaxed mb-6">
                    {DEPARTMENT_DESCRIPTIONS[dept.id]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dept.levels.map(level => (
                      <span
                        key={level}
                        className="px-3 py-1.5 bg-cream text-sm text-ink-mute"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className={`overflow-hidden h-64 bg-gradient-to-br ${visual.gradient} flex items-center justify-center ${
                    i % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <span className="text-5xl" aria-hidden="true">
                    {visual.emoji}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cambridge Stream */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-4">Cambridge Enrichment Stream</h2>
            <p className="text-ink-mute leading-relaxed">
              For students who wish to benchmark their learning internationally, our Cambridge
              Enrichment stream offers Cambridge Progression Tests and additional support in
              English, Mathematics and Science.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Cambridge Primary',
                desc: 'International benchmarks for Primary 4 to 6 in core subjects.',
              },
              {
                title: 'Progression Tests',
                desc: 'Annual assessments that measure student performance against global standards.',
              },
              {
                title: 'Certificate Pathway',
                desc: 'Preparation for Cambridge Lower Secondary and IGCSE qualifications.',
              },
            ].map(item => (
              <div key={item.title} className="p-6 bg-paper">
                <h4 className="font-semibold text-ink mb-2">{item.title}</h4>
                <p className="text-sm text-ink-mute">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
