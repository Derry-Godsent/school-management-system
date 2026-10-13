import { useEffect, useState, useRef } from 'react';

interface CharRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function CharReveal({ text, className = '', delay = 0 }: CharRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-500"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0) rotateX(0)' : 'translateY(20px) rotateX(-90deg)',
            transitionDelay: `${i * 30}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
