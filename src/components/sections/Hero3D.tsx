import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';
import { LightRays, TypingAnimation, InteractiveHoverButton, ShimmerButton } from '../magic';

const SLIDES = [
  {
    image: '/images/hero-campus.jpg',
    eyebrow: 'Established 2008',
    title: 'Maple Grove International School',
    text: 'Nurturing Excellence. Building Character. Transforming Futures.',
    to: '/about',
    cta: 'Our Story',
  },
  {
    image: '/images/classroom.jpg',
    eyebrow: 'Our Vision',
    title: "Kumasi's institution for holistic education",
    text: 'Blending Ghanaian values with global standards, from Pre-School through Junior High School.',
    to: '/academics',
    cta: 'Our Academics',
  },
  {
    image: '/images/campus-life.jpg',
    eyebrow: 'Campus Life',
    title: 'Where character is built',
    text: 'Cultural festivals, house sports, the cadet corps and clubs. Learning that reaches past the classroom.',
    to: '/campus-life',
    cta: 'Explore Campus',
  },
];

/**
 * Hero3D: the opening plane, built as three layers travelling at different
 * rates inside a shared perspective, with the copy block rotating toward the
 * pointer on desktop.
 *
 * On touch devices the pointer path is swapped for the scroll path, so the
 * same depth reads on a phone without needing a gyroscope permission prompt.
 * Only transforms animate.
 */
export function Hero3D() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const slide = SLIDES[index];

  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % SLIDES.length), 7500);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Layer travels: the photograph recedes and grows, the copy lifts and tilts.
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });
  const bgY = useTransform(smooth, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(smooth, [0, 1], [1, 1.12]);
  const bgRotateX = useTransform(smooth, [0, 1], [0, 7]);
  const copyY = useTransform(smooth, [0, 1], ['0%', '-42%']);
  const copyRotateX = useTransform(smooth, [0, 1], [0, -10]);
  const copyOpacity = useTransform(smooth, [0, 0.75], [1, 0]);
  const railOpacity = useTransform(smooth, [0, 0.4], [1, 0]);
  // Hoisted out of JSX: calling a hook inside a conditional render expression
  // would change the hook count between renders.
  const frameY = useTransform(smooth, [0, 1], ['0%', '10%']);

  // Pointer follow for the copy plane (desktop only).
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const tiltSpring = { stiffness: 120, damping: 20, mass: 0.5 };
  const smoothPX = useSpring(pointerX, tiltSpring);
  const smoothPY = useSpring(pointerY, tiltSpring);
  const pointerRotateY = useTransform(smoothPX, [0, 1], [-7, 7]);
  const pointerRotateX = useTransform(smoothPY, [0, 1], [5, -5]);

  const usePointer = allowed && tier.canHover && !tier.isTouch;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!usePointer || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative h-[88vh] min-h-[560px] overflow-hidden bg-ink"
      style={{ perspective: allowed ? 1200 : undefined }}
    >
      {/* Layer 1, photograph */}
      <motion.div
        className="absolute inset-0"
        style={allowed ? { y: bgY, scale: bgScale, rotateX: bgRotateX, transformOrigin: '50% 100%' } : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 scrim" />
      </motion.div>

      {/* Ambient light falling from above the fold */}
      <LightRays intensity={0.9} />

      {/* Layer 2, gold hairline frame, sitting between the photo and the copy */}
      {allowed && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-6 top-24 bottom-28 sm:inset-x-10 sm:top-28 sm:bottom-32 border border-gold/25 pointer-events-none"
          style={{ y: frameY }}
        />
      )}

      {/* Layer 3, copy, on its own plane */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            className="max-w-3xl"
            style={
              allowed
                ? {
                    y: copyY,
                    opacity: copyOpacity,
                    rotateX: usePointer ? pointerRotateX : copyRotateX,
                    rotateY: usePointer ? pointerRotateY : 0,
                    transformStyle: 'preserve-3d',
                  }
                : undefined
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-block bg-gold text-ink px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.2em] uppercase">
                  <TypingAnimation
                    words={['Established 2008', 'Kumasi, Ghana', 'Pre-School to JHS']}
                    pauseDelay={2600}
                    typeSpeed={58}
                    className="text-[0.6875rem]"
                    cursorClassName="bg-ink"
                  />
                </span>
                <h1 className="mt-6 font-display text-[2.15rem] leading-[1.08] sm:text-5xl lg:text-6xl font-bold text-paper">
                  {slide.title}
                </h1>
                <p className="mt-5 text-base sm:text-xl text-paper/85 leading-relaxed max-w-2xl">
                  {slide.text}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                  <InteractiveHoverButton
                    tone="gold"
                    onClick={() => navigate(slide.to)}
                    className="text-xs sm:text-sm"
                  >
                    {slide.cta}
                  </InteractiveHoverButton>
                  <ShimmerButton
                    onClick={() => navigate('/admissions')}
                    className="text-xs sm:text-sm"
                  >
                    Apply Now
                  </ShimmerButton>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Slide rail */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={allowed ? { opacity: railOpacity } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                className="group flex-1 py-5 text-left"
              >
                <span
                  className={`block h-0.5 transition-colors ${
                    i === index ? 'bg-gold' : 'bg-paper/25 group-hover:bg-paper/50'
                  }`}
                />
                <span
                  className={`hidden sm:block mt-3 text-[0.6875rem] tracking-[0.18em] uppercase transition-colors ${
                    i === index ? 'text-gold' : 'text-paper/45'
                  }`}
                >
                  {s.eyebrow}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero3D;
