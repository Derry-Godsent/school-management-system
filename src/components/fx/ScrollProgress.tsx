import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgress: a thin gold bar pinned to the top of the viewport that
 * fills as the page is read. Pure transform (scaleX), so it costs nothing.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[300] h-[3px] bg-gold origin-left pointer-events-none"
    />
  );
}

export default ScrollProgress;
