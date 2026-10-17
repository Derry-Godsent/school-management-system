import { createContext, useContext, useState, type ReactNode } from 'react';
import { roles, type Role, type RoleId } from '../../data/admin';

/**
 * Who is signed in, and what that person may do.
 *
 * The console is a showcase, so the accounts come from the role table in the
 * data folder. Nothing here is a security boundary and nothing pretends to be:
 * a real rollout would swap `login` for a call to the school's own service and
 * keep this same shape, so no screen has to change.
 */
export interface StaffAuth {
  role: RoleId;
  name: string;
  title: string;
  email: string;
}

interface StaffAuthValue {
  auth: StaffAuth | null;
  login: (email: string, password: string) => Role | null;
  signInAs: (role: Role) => void;
  logout: () => void;
}

const StaffAuthContext = createContext<StaffAuthValue>({
  auth: null,
  login: () => null,
  signInAs: () => {},
  logout: () => {},
});

function toAuth(role: Role): StaffAuth {
  return { role: role.id, name: role.name, title: role.title, email: role.email };
}

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StaffAuth | null>(null);

  const login = (email: string, password: string): Role | null => {
    const match = roles.find(
      person => person.email.toLowerCase() === email.trim().toLowerCase() && person.password === password
    );
    if (!match) return null;
    setAuth(toAuth(match));
    return match;
  };

  const signInAs = (role: Role) => setAuth(toAuth(role));
  const logout = () => setAuth(null);

  return (
    <StaffAuthContext.Provider value={{ auth, login, signInAs, logout }}>{children}</StaffAuthContext.Provider>
  );
}

export function useStaffAuth(): StaffAuthValue {
  return useContext(StaffAuthContext);
}
