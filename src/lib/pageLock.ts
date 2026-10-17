/**
 * One page lock, shared by every overlay in the project.
 *
 * Setting `overflow: hidden` on the page is not a lock. On iOS the page still
 * rubber bands behind the panel, and on the desktop the smooth scroller keeps
 * moving the document because it is not the element's overflow that drives it.
 * Lenis translates the page itself, so unless it is told to stop it will keep
 * answering the wheel while a drawer is open. That is what made the background
 * scroll under the menu.
 *
 * This module does the three things that actually stop a page:
 *
 *   1. tells the smooth scroller to stop, and starts it again afterwards,
 *   2. fixes the body in place at the current offset, which is the only method
 *      that holds on iOS, and puts the reader back where they were,
 *   3. counts the locks, so two overlays closing in either order cannot leave
 *      the page frozen.
 *
 * The overlays themselves live in three places that do not import each other,
 * so the instance is registered here rather than passed down.
 */

interface SmoothScroller {
  stop: () => void;
  start: () => void;
  scrollTo?: (target: number, options?: { immediate?: boolean }) => void;
}

let scroller: SmoothScroller | null = null;
let depth = 0;

interface SavedPage {
  y: number;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
  htmlOverflow: string;
}

let saved: SavedPage | null = null;

/** Called by the smooth scroller when it starts, and with null when it stops. */
export function registerSmoothScroll(instance: SmoothScroller | null) {
  scroller = instance;
}

export function lockPage() {
  if (typeof document === 'undefined') return;
  depth += 1;
  if (depth > 1 || saved) return;

  const html = document.documentElement;
  const body = document.body;
  const y = window.scrollY || html.scrollTop || 0;

  saved = {
    y,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
    htmlOverflow: html.style.overflow,
  };

  // The bar that disappears when the page stops scrolling would shift the
  // layout sideways by its width, so the gap is held open.
  const scrollbar = window.innerWidth - html.clientWidth;

  body.style.position = 'fixed';
  body.style.top = `-${y}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
  html.style.overflow = 'hidden';
  html.classList.add('overlay-open');

  scroller?.stop();
}

export function unlockPage() {
  if (typeof document === 'undefined') return;
  depth = Math.max(0, depth - 1);
  if (depth > 0 || !saved) return;

  const html = document.documentElement;
  const body = document.body;
  const restore = saved;
  saved = null;

  body.style.position = restore.bodyPosition;
  body.style.top = restore.bodyTop;
  body.style.left = restore.bodyLeft;
  body.style.right = restore.bodyRight;
  body.style.width = restore.bodyWidth;
  body.style.overflow = restore.bodyOverflow;
  body.style.paddingRight = restore.bodyPaddingRight;
  html.style.overflow = restore.htmlOverflow;
  html.classList.remove('overlay-open');

  scroller?.start();

  // Put the reader back exactly where they were before the overlay opened.
  window.scrollTo(0, restore.y);
  scroller?.scrollTo?.(restore.y, { immediate: true });
}

/**
 * The page changed while an overlay held it still. The reader should arrive at
 * the top of the new page, not back at the offset of the old one.
 */
export function resetLockedScroll() {
  if (saved) saved.y = 0;
}

/** For the rare case of a full page change while something is still open. */
export function releasePageLock() {
  if (!saved) return;
  depth = 1;
  unlockPage();
}
