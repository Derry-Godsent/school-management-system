import { galleryAlbums } from '../../data';
import { Reveal3D } from '../../components/fx';
import { PixelImage } from '../../components/magic';

// Stand-in imagery until real school photographs are added under /public.
const ALBUM_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1544717305-2782549b6386?w=600&q=80',
    alt: 'Students performing a traditional cultural dance',
  },
  {
    src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80',
    alt: 'Students studying together during a lesson',
  },
  {
    src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    alt: 'Science laboratory equipment on a workbench',
  },
  {
    src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    alt: 'Children taking part in a running race',
  },
  {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    alt: 'Graduating students celebrating in caps and gowns',
  },
];

export default function GalleryPage() {
  return (
    <div>
      <section className="pt-16 pb-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-gold-deep font-medium text-sm uppercase tracking-wide">
              Gallery
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mt-3">
              School Life in Pictures
            </h1>
            <p className="text-lg text-ink-mute mt-4">
              Moments that capture the spirit of Maple Grove.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryAlbums.map((album, i) => {
              const image = ALBUM_IMAGES[i % ALBUM_IMAGES.length];
              return (
                <Reveal3D
                  key={album.id}
                  delay={(i % 3) * 0.1}
                  y={52}
                  rotate={i % 2 === 0 ? 16 : 10}
                  axis={i % 2 === 0 ? 'x' : 'y'}
                >
                <div className="group cursor-pointer">
                  <PixelImage src={image.src} alt={image.alt} aspect="4/3" rows={4} cols={6} />
                  <div className="mt-3">
                    <h3 className="font-medium text-ink">{album.title}</h3>
                    <p className="text-sm text-ink-mute/80 mt-0.5">
                      {album.imageCount} photos •{' '}
                      {new Date(album.date).toLocaleDateString('en-GB', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                </Reveal3D>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
