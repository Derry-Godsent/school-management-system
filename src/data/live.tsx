import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Notice } from './portal';

/**
 * The live edge between the console and the app.
 *
 * A real school system writes to a database and the parent app reads from it.
 * This showcase has no database, but it does have both sides running in the
 * same session, so it can do the honest version of the same thing: what the
 * office sends from the console is held here, and the parent app reads from
 * here first. Send a notice at the desk, open the phone, and it is in the feed.
 *
 * The shape is deliberately the shape a real service would have, so wiring this
 * to a server later is a change to one file and no screen changes at all.
 */
export interface SentNotice extends Notice {
  /** The console records who sent it and to how many families. */
  reach: number;
  sentAt: string;
}

interface LiveValue {
  sent: SentNotice[];
  publishNotice: (notice: Omit<SentNotice, 'id' | 'date' | 'sentAt'>) => SentNotice;
  reset: () => void;
}

const LiveContext = createContext<LiveValue>({
  sent: [],
  publishNotice: () => {
    throw new Error('The notice must be published inside the live provider.');
  },
  reset: () => {},
});

let counter = 0;

const STORE_KEY = 'maplegrove.live.notices';

/** Read back what was sent, so a refresh during a pitch does not lose it. */
function readStore(): SentNotice[] {
  try {
    const raw = window.sessionStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SentNotice[];
    counter = parsed.length;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function LiveProvider({ children }: { children: ReactNode }) {
  const [sent, setSent] = useState<SentNotice[]>(readStore);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify(sent));
    } catch {
      // A private window can refuse storage. The demonstration still works
      // for as long as the tab is open, so this is not worth failing over.
    }
  }, [sent]);

  const publishNotice = useCallback((notice: Omit<SentNotice, 'id' | 'date' | 'sentAt'>) => {
    counter += 1;
    const record: SentNotice = {
      ...notice,
      id: `live-notice-${counter}`,
      date: new Date().toISOString().slice(0, 10),
      sentAt: new Date().toISOString(),
    };
    setSent(current => [record, ...current]);
    return record;
  }, []);

  const reset = useCallback(() => setSent([]), []);

  const value = useMemo(() => ({ sent, publishNotice, reset }), [sent, publishNotice, reset]);

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export function useLive(): LiveValue {
  return useContext(LiveContext);
}

/**
 * A sent notice, expressed the way the parent feed expects: a class notice only
 * shows to that class, and everything else goes to the whole school.
 */
export function asParentNotice(notice: SentNotice): Notice {
  return {
    id: notice.id,
    title: notice.title,
    date: notice.date,
    from: notice.from,
    audience: notice.audience,
    classId: notice.classId,
    body: notice.body,
    pinned: true,
  };
}
