import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal: renders children into document.body.
 *
 * Needed because an ancestor with `backdrop-filter` (our blurred sticky nav)
 * becomes the containing block for `position: fixed` descendants. Anything
 * fixed and full-screen rendered inside it is clipped to the nav's box, which
 * is what made the mobile menu appear behind the page.
 */
export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(children, document.body);
}
