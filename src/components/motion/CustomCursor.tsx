import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailId = useRef(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only disable on pure touch devices without fine pointer (mouse/trackpad)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    setIsTouch(!hasFinePointer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Add trail particle
      trailId.current += 1;
      setTrail(prev => [...prev.slice(-8), { x: e.clientX, y: e.clientY, id: trailId.current }]);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      {/* Trail */}
      {trail.map((point, i) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[9998] rounded-full mix-blend-difference"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: 6,
            height: 6,
            backgroundColor: '#E85D04',
          }}
        />
      ))}

      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
          width: isHovering ? 48 : 8,
          height: isHovering ? 48 : 8,
          backgroundColor: isHovering ? 'transparent' : '#ffffff',
          border: isHovering ? '2px solid #E85D04' : 'none',
          transition: 'width 0.3s, height 0.3s, background-color 0.3s, border 0.3s',
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border border-white/30"
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          width: isHovering ? 64 : 32,
          height: isHovering ? 64 : 32,
          transition: 'width 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      />
    </>
  );
}
