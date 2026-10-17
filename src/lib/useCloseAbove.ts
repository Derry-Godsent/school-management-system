import { useEffect, useRef } from 'react';

/**
 * Closes an overlay when the window grows past a breakpoint.
 *
 * The bug this exists for: a drawer was shown or hidden by a CSS breakpoint
 * while "open" and the page lock were JavaScript. Rotate a phone, widen a
 * window, or drag a browser across the breakpoint and the panel disappears
 * while the page stays frozen behind it, with no control left on screen to
 * close it. Only a refresh got it back.
 *
 * Now the state follows the layout: if the layout no longer has a drawer, the
 * drawer closes and gives the page back.
 */
export function useCloseAbove(query: string, onClose: () => void) {
  const latest = useRef(onClose);
  latest.current = onClose;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia(query);

    const handle = () => {
      if (media.matches) latest.current();
    };

    // A page can also load already past the breakpoint, so check once.
    handle();

    if (media.addEventListener) media.addEventListener('change', handle);
    else media.addListener?.(handle);

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', handle);
      else media.removeListener?.(handle);
    };
  }, [query]);
}
