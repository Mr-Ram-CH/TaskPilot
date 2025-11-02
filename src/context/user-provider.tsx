'use client';

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { User } from '@/lib/definitions';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { findUserById, addUser } from '@/lib/actions';


interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'User' | 'Project Manager') => Promise<FirebaseUser>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUser = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // First, try to find the user in our "database" (the in-memory store)
      let appUser = await findUserById(firebaseUser.uid);
      
      if (appUser) {
        // If user exists, update state
        setUser(appUser);
      }
      
      // If the user is authenticated with Firebase but not in our DB,
      // it means they've just signed up or are logging in for the first time.
      // The signup/login logic will handle adding them to the DB.
      
      try {
        localStorage.setItem('taskpilot-user', JSON.stringify(appUser));
      } catch (error) {
        console.error('Failed to save user to localStorage', error);
      }
    } else {
      // If no Firebase user, clear our state and storage
      setUser(null);
      try {
        localStorage.removeItem('taskpilot-user');
      } catch (error) {
        console.error('Failed to remove user from localStorage', error);
      }
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    // Check local storage first for a quicker UI update
    try {
      const storedUser = localStorage.getItem('taskpilot-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('taskpilot-user');
    }
  
    // Then, set up the Firebase auth state listener to keep it in sync
    const unsubscribe = auth.onAuthStateChanged(syncUser);
  
    // On initial load, if there's no user in localStorage, we might still be waiting
    // for Firebase to confirm auth state, so we set loading to true.
    if (!user) {
        setIsLoading(true);
    }

    return () => unsubscribe();
  }, [syncUser, user]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(userCredential.user);
      return userCredential.user;
    },
    [syncUser]
  );

  const logout = useCallback(async () => {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    await syncUser(null);
  }, [syncUser]);

  const signup = useCallback(
    async (email: string, password: string, name: string, role: 'User' | 'Project Manager') => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create a corresponding user in our application's "database"
      const newUser: User = {
        id: firebaseUser.uid,
        name,
        role,
        avatar: 'https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhdHRlcm58ZW58MHx8fHwxNzYyMDEzNzg0fDA&ixlib=rb-4.1.0&q=80&w=1080', // Default avatar
      };
      await addUser(newUser);
      await syncUser(firebaseUser);

      return firebaseUser;
    },
    [syncUser]
  );

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
}
