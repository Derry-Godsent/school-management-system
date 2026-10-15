import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface TypingAnimationProps {
  /** Words to type, pause on, delete, then move through. */
  words: string[];
  className?: string;
  /** Blinking caret while paused. */
  blinkCursor?: boolean;
  /** Milliseconds to hold a completed word. */
  pauseDelay?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  loop?: boolean;
  /** Rendered before the typed text, e.g. "We build ". */
  prefix?: string;
  cursorClassName?: string;
}

/**
 * TypingAnimation — types a word, holds it, deletes it, moves to the next.
 *
 * Uses a timeout chain rather than a single interval so the hold and delete
 * phases can differ. Reduced-motion users get the first word, static.
 */
export function TypingAnimation({
  words,
  className = '',
  blinkCursor = true,
  pauseDelay = 2000,
  typeSpeed = 65,
  deleteSpeed = 32,
  loop = true,
  prefix,
  cursorClassName = '',
}: TypingAnimationProps) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  const [display, setDisplay] = useState(allowed ? '' : (words[0] ?? ''));

  // Consumers pass `words` as an inline literal, so array identity changes on
  // every render. Keying the effect on the contents keeps it from restarting
  // (and resetting the text) on each pass.
  const wordsKey = words.join('\u0000');
  const wordsRef = useRef(words);
  wordsRef.current = words;

  // Progression lives in refs. The timeout chain reads `length` rather than the
  // `display` state it just set, which would otherwise be a stale closure and
  // stall the animation after a single character.
  const length = useRef(0);
  const wordIndex = useRef(0);
  const deleting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!allowed || words.length === 0) return;

    // Reset so a changed `words` array restarts cleanly.
    length.current = 0;
    wordIndex.current = 0;
    deleting.current = false;
    setDisplay('');

    const tick = () => {
      const list = wordsRef.current;
      const word = list[wordIndex.current] ?? '';

      if (!deleting.current) {
        length.current = Math.min(length.current + 1, word.length);
        setDisplay(word.slice(0, length.current));

        if (length.current >= word.length) {
          // Word complete — hold, then delete. Unless this is a one-shot run
          // that has finished its last word.
          if (!loop && wordIndex.current === list.length - 1) return;
          timer.current = setTimeout(() => {
            deleting.current = true;
            tick();
          }, pauseDelay);
          return;
        }
        timer.current = setTimeout(tick, typeSpeed);
      } else {
        length.current = Math.max(0, length.current - 1);
        setDisplay(word.slice(0, length.current));

        if (length.current === 0) {
          deleting.current = false;
          wordIndex.current = (wordIndex.current + 1) % list.length;
          timer.current = setTimeout(tick, typeSpeed * 3);
          return;
        }
        timer.current = setTimeout(tick, deleteSpeed);
      }
    };

    timer.current = setTimeout(tick, typeSpeed);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [allowed, wordsKey, typeSpeed, deleteSpeed, pauseDelay, loop]);

  return (
    <span className={cn('inline-flex items-baseline', className)}>
      {prefix ? <span>{prefix}</span> : null}
      <span>{display}</span>
      <span
        aria-hidden="true"
        className={cn(
          'inline-block w-[0.06em] self-stretch bg-gold ml-[0.08em]',
          blinkCursor && allowed ? 'animate-caret-blink' : '',
          cursorClassName
        )}
      />
    </span>
  );
}

export default TypingAnimation;
