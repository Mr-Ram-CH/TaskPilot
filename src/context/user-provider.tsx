'use client';

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { User, UserRole } from '@/lib/definitions';
import { findUserById, addUser } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage on initial load
    try {
      const storedUser = localStorage.getItem('taskpilot-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
            setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('taskpilot-user');
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (userId: string) => {
    setIsLoading(true);
    const appUser = await findUserById(userId);
    if (appUser) {
      setUser(appUser);
      try {
        localStorage.setItem('taskpilot-user', JSON.stringify(appUser));
      } catch (error) {
        console.error('Failed to save user to localStorage', error);
      }
    } else {
      setIsLoading(false);
      throw new Error('User not found.');
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('taskpilot-user');
    } catch (error) {
      console.error('Failed to remove user from localStorage', error);
    }
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string, role: UserRole) => {
      const defaultAvatar = PlaceHolderImages.find(p => p.id === 'default-avatar')?.imageUrl ?? '';
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        role,
        avatar: defaultAvatar,
      };
      
      await addUser(newUser);
      await login(newUser.id);
      return newUser;
    },
    [login]
  );

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
}
