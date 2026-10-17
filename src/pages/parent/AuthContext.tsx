import { createContext, useContext, useState, type ReactNode } from 'react';
import { demoUsers } from '../../data';

/**
 * Who is signed in.
 *
 * The portal is a showcase, so the accounts come from the demonstration list in
 * the data folder. Nothing here is a security boundary and nothing pretends to
 * be: a real rollout would replace `login` with a call to the school's own
 * service and keep the same shape, so no screen has to change.
 */
export interface ParentAuth {
  email: string;
  guardianId: string;
}

interface ParentAuthValue {
  auth: ParentAuth | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ParentAuthContext = createContext<ParentAuthValue>({
  auth: null,
  login: () => false,
  logout: () => {},
});

export function ParentAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<ParentAuth | null>(null);

  const login = (email: string, password: string) => {
    const user = demoUsers.find(
      account => account.email === email && account.password === password && account.role === 'parent'
    );
    if (user?.guardianId) {
      setAuth({ email: user.email, guardianId: user.guardianId });
      return true;
    }
    return false;
  };

  const logout = () => setAuth(null);

  return (
    <ParentAuthContext.Provider value={{ auth, login, logout }}>{children}</ParentAuthContext.Provider>
  );
}

export function useParentAuth(): ParentAuthValue {
  return useContext(ParentAuthContext);
}
