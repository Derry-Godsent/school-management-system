import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface DepthImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Wrapper aspect, e.g. "4/5" or "16/10". */
  aspect?: string;
  /** 3D rotation as the image crosses the viewport, in degrees. */
  rotate?: number;
  /** Scale overscan so the parallax never exposes an edge. */
  zoom?: number;
}

/**
 * DepthImage — an image that drifts and tilts on a perspective plane as it
 * moves through the viewport, so photography reads as depth rather than a flat
 * rectangle.
 *
 * The inner <img> is over-scaled so the parallax translation can never reveal
 * an empty edge, and only `transform` is animated.
 */
export function DepthImage({
  src,
  alt,
  className = '',
  aspect = '4/5',
  rotate = 7,
  zoom = 1.14,
}: DepthImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], ['-6%', '6%']);
  const rotateX = useTransform(smooth, [0, 1], [rotate, -rotate]);

  if (!allowed) {
    return (
      <div className={className} style={{ aspectRatio: aspect }}>
        <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ aspectRatio: aspect, perspective: 1100, overflow: 'hidden' }}
    >
      <motion.div
        className="w-full h-full"
        style={{ rotateX, transformStyle: 'preserve-3d' }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
          style={{ y, scale: zoom }}
        />
      </motion.div>
    </div>
  );
}

export default DepthImage;
