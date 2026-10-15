import { Calendar } from 'lucide-react';
import { news } from '../../data';

export default function NewsPage() {
  const sorted = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <section className="pt-16 pb-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-gold-deep font-medium text-sm uppercase tracking-wide">
              News &amp; Updates
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mt-3">
              Latest from Maple Grove
            </h1>
          </div>
        </div>
      </section>
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sorted.map(item => (
              <article
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-rule last:border-b-0"
              >
                <div className="w-full sm:w-48 h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                  <Calendar size={24} className="text-ink-mute/60" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-gold-deep bg-orange-50 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <time dateTime={item.date} className="text-xs text-ink-mute/60">
                      {new Date(item.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3 className="text-lg font-semibold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-mute leading-relaxed">{item.content}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
