import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'messaging_app_users';
const SESSION_KEY = 'messaging_app_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { password: string; name: string }> => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];
    
    if (!userRecord) {
      return { error: 'No account found with this email' };
    }
    
    if (userRecord.password !== password) {
      return { error: 'Incorrect password' };
    }

    const loggedInUser: User = {
      id: email.toLowerCase(),
      email: email.toLowerCase(),
      name: userRecord.name,
    };

    setUser(loggedInUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
    return {};
  };

  const register = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    const users = getUsers();
    const emailLower = email.toLowerCase();
    
    if (users[emailLower]) {
      return { error: 'An account with this email already exists' };
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    users[emailLower] = { password, name };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const newUser: User = {
      id: emailLower,
      email: emailLower,
      name,
    };

    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
