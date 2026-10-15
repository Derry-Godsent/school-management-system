import { useEffect } from 'react';

/**
 * Locks background scrolling while a full-screen overlay is open.
 *
 * Marks <html> with `lenis-stopped` so Lenis halts too, then restores the
 * previous overflow values on close. Also compensates for scrollbar loss on
 * desktop so the page does not jump horizontally.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { documentElement: html, body } = document;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    html.classList.add('lenis-stopped');

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousPaddingRight;
      html.classList.remove('lenis-stopped');
    };
  }, [locked]);
}
