import { useEffect, useRef } from 'react';

export function MouseSpotlightCSS() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2] pointer-events-none"
      style={{
        background: 'radial-gradient(800px circle at var(--x, -200px) var(--y, -200px), rgba(232, 93, 4, 0.045), transparent 60%)',
      }}
    />
  );
}
