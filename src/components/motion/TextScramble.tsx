import { useEffect, useState, useRef } from 'react';

const chars = '!<>-_\\/[]{}—=+*^?#';

export function TextScramble({ text, className = '', trigger = true }: { text: string; className?: string; trigger?: boolean }) {
  const [displayed, setDisplayed] = useState(text);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;

    let frame = 0;
    const queue: { from: string; to: string; start: number; end: number; cursor: number; char: string }[] = [];
    queue.push({ from: '', to: text, start: 0, end: text.length, cursor: 0, char: '' });

    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        const q = queue[i];
        if (q.cursor >= q.end) {
          complete++;
          output += q.to;
          continue;
        }
        output += '<span style="opacity:0.4">' + (q.char || chars[Math.floor(Math.random() * chars.length)]) + '</span>';
        if (frame - q.cursor >= 2) {
          q.cursor++;
          q.char = q.to[q.cursor - q.start] || '';
        }
      }

      setDisplayed(output);
      if (complete < queue.length) {
        frame++;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    cancelAnimationFrame(rafRef.current);
    frame = 0;
    rafRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafRef.current);
  }, [text, trigger]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: displayed }} />;
}

export function CharReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
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
    if (ref.current) observer.observe(ref.current);
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
