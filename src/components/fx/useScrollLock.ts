import { useEffect } from 'react';
import { lockPage, unlockPage } from '../../lib/pageLock';

/**
 * Holds the page still while an overlay is open.
 *
 * The work is done in one shared module, because three overlays in this project
 * live in three parts of the app and all of them have to agree with the smooth
 * scroller. This hook is only the React lifetime: lock on mount, release on
 * unmount, and no chance of two closers unlocking a page a third still holds.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockPage();
    return () => unlockPage();
  }, [locked]);
}
