import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Back and forward, the way a browser has them.
 *
 * A site with its own navigation still leaves people stranded once they have
 * clicked into a page: the only obvious way home is the logo, and the only way
 * to the last thing they read is the phone's back gesture. These two controls
 * use the real history stack, so back goes to the page you were actually on,
 * forward returns to the one you left, and neither guesses.
 *
 * React Router records its position on the history stack, which is what makes
 * this honest: the back button is only enabled when there is something behind
 * you, and forward only lights up after you have gone back.
 */
export function HistoryControls({
  tone = 'light',
  className = '',
}: {
  /** `light` sits on paper, `dark` on an ink surface. */
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [canBack, setCanBack] = useState(false);
  const [canForward, setCanForward] = useState(false);
  const furthest = useRef(0);

  useEffect(() => {
    const raw = (window.history.state as { idx?: number } | null)?.idx;
    const index = typeof raw === 'number' ? raw : 0;

    if (index > furthest.current) furthest.current = index;
    setCanBack(index > 0);
    setCanForward(index < furthest.current);

    // A fresh push onto the stack discards anything ahead of it, which is why
    // the browser's own forward button greys out after a normal click.
    if (index >= furthest.current) setCanForward(false);
  }, [location.key, location.pathname]);

  const base =
    tone === 'light'
      ? 'border-rule bg-paper text-ink hover:border-gold-deep hover:text-gold-deep'
      : 'border-white bg-ink text-paper hover:border-gold';
  const disabled = 'cursor-not-allowed border-transparent bg-transparent text-ink-mute';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        disabled={!canBack}
        aria-label="Go back to the previous page"
        title="Back"
        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
          canBack ? base : disabled
        }`}
      >
        <ArrowLeft size={17} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => navigate(1)}
        disabled={!canForward}
        aria-label="Go forward to the page you came from"
        title="Forward"
        className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
          canForward ? base : disabled
        }`}
      >
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

export default HistoryControls;
