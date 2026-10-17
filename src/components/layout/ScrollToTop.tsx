import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resetLockedScroll } from '../../lib/pageLock';

/**
 * ScrollToTop - Scrolls to top whenever the route changes.
 * Ensures every page starts from the top.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // A page held still by an open overlay cannot actually be scrolled yet, so
    // the next position is recorded instead of performed.
    resetLockedScroll();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
