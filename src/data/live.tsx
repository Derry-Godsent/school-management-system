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

/**
 * An application as it arrives from the form on the website.
 *
 * It carries the same fields the console queue already displays, plus a
 * reference the family can quote and the address the form collected. It is
 * always born at stage New, because nobody has read it yet.
 */
export interface LiveApplication {
  id: string;
  reference: string;
  child: string;
  applyingFor: string;
  parent: string;
  phone: string;
  email: string;
  received: string;
  stage: 'New';
  note: string;
  fromWebsite: true;
  submittedAt: string;
}

/** What the website form hands over. Everything else is stamped here. */
export type ApplicationDraft = Pick<
  LiveApplication,
  'child' | 'applyingFor' | 'parent' | 'phone' | 'email' | 'note'
>;

interface LiveValue {
  sent: SentNotice[];
  publishNotice: (notice: Omit<SentNotice, 'id' | 'date' | 'sentAt'>) => SentNotice;
  /** Applications sent from the website, newest first. */
  applications: LiveApplication[];
  submitApplication: (draft: ApplicationDraft) => LiveApplication;
  /** Stage changes made in the console, by application id. */
  stageOf: Record<string, string>;
  moveApplication: (id: string, current: string) => string;
  reset: () => void;
}

const LiveContext = createContext<LiveValue>({
  sent: [],
  publishNotice: () => {
    throw new Error('The notice must be published inside the live provider.');
  },
  applications: [],
  submitApplication: () => {
    throw new Error('The application must be sent inside the live provider.');
  },
  stageOf: {},
  moveApplication: () => {
    throw new Error('The application must be moved inside the live provider.');
  },
  reset: () => {},
});

let counter = 0;
let appCounter = 0;

const STORE_KEY = 'maplegrove.live.notices';
const APP_KEY = 'maplegrove.live.applications';
const STAGE_KEY = 'maplegrove.live.stages';

/** The queue, oldest first, so the next application number follows it. */
const STAGE_ORDER = ['New', 'Interview', 'Offer', 'Enrolled'] as const;

/**
 * Applications are read from local storage, not session storage.
 *
 * A parent fills the form on one tab and the office opens the queue in another,
 * so the two have to agree. Session storage is per tab and would leave the new
 * tab empty, which is exactly the thing this feature exists to prevent. Local
 * storage is shared by every tab in the browser, which is the closest this
 * build gets to a server both sides can see.
 */
function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  const body = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, body);
  } catch {
    // A private window can refuse local storage. The tab still works with
    // session storage, and failing both only costs a refresh.
  }
  try {
    window.sessionStorage.setItem(key, body);
  } catch {
    // Nothing further to do.
  }
}

/** Read back what was sent, so a refresh during a pitch does not lose it. */
function readStore(): SentNotice[] {
  const parsed = readJson<SentNotice[]>(STORE_KEY);
  if (!Array.isArray(parsed)) return [];
  counter = parsed.length;
  return parsed;
}

function readApplications(): LiveApplication[] {
  const parsed = readJson<LiveApplication[]>(APP_KEY);
  if (!Array.isArray(parsed)) return [];
  appCounter = parsed.length;
  return parsed;
}

function readStages(): Record<string, string> {
  const parsed = readJson<Record<string, string>>(STAGE_KEY);
  return parsed && typeof parsed === 'object' ? parsed : {};
}

export function LiveProvider({ children }: { children: ReactNode }) {
  const [sent, setSent] = useState<SentNotice[]>(readStore);
  const [applications, setApplications] = useState<LiveApplication[]>(readApplications);
  const [stageOf, setStageOf] = useState<Record<string, string>>(readStages);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify(sent));
    } catch {
      // A private window can refuse storage. The demonstration still works
      // for as long as the tab is open, so this is not worth failing over.
    }
  }, [sent]);

  useEffect(() => {
    writeJson(APP_KEY, applications);
  }, [applications]);

  useEffect(() => {
    writeJson(STAGE_KEY, stageOf);
  }, [stageOf]);

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

  const submitApplication = useCallback((draft: ApplicationDraft) => {
    appCounter += 1;
    const stamp = new Date();
    const record: LiveApplication = {
      ...draft,
      id: `app-web-${appCounter}`,
      reference: `MG-${String(appCounter).padStart(4, '0')}`,
      received: stamp.toISOString().slice(0, 10),
      stage: 'New',
      fromWebsite: true,
      submittedAt: stamp.toISOString(),
    };
    setApplications(current => [record, ...current]);
    return record;
  }, []);

  /** Walks the pipeline one step. Enrolled is the end of it. */
  const moveApplication = useCallback((id: string, current: string) => {
    const at = STAGE_ORDER.indexOf(current as (typeof STAGE_ORDER)[number]);
    const next = STAGE_ORDER[Math.min(at + 1, STAGE_ORDER.length - 1)] ?? current;
    setStageOf(previous => ({ ...previous, [id]: next }));
    return next;
  }, []);

  const reset = useCallback(() => {
    setSent([]);
    setApplications([]);
    setStageOf({});
  }, []);

  const value = useMemo(
    () => ({ sent, publishNotice, applications, submitApplication, stageOf, moveApplication, reset }),
    [sent, publishNotice, applications, submitApplication, stageOf, moveApplication, reset]
  );

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
