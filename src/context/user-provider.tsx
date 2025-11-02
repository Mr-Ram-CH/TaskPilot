'use client';

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import type { User, UserRole } from '@/lib/definitions';
import { auth } from '@/lib/firebase';
import { addUser, findUserByEmail, updateUser } from '@/lib/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface UserContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<User>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in, see if we have them in our 'DB'
        let appUser = await findUserByEmail(fbUser.email!);
        if (appUser) {
          setUser(appUser);
        } else {
          // This case can happen if a user was created in Firebase but not in our app's user list.
           const defaultAvatar = PlaceHolderImages.find(p => p.id === 'default-avatar')?.imageUrl ?? '';
           const newUser: User = {
             id: fbUser.uid,
             name: fbUser.displayName || 'New User',
             email: fbUser.email!,
             role: 'User',
             avatar: defaultAvatar,
           };
           await addUser(newUser);
           setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setIsLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const fbUser = userCredential.user;
        let appUser = await findUserByEmail(fbUser.email!);

        if (!appUser) {
          throw new Error('User not found in our system, please sign up.');
        }

        // If user's role in our DB doesn't match what they selected, update it.
        // In a real app, you might have stricter rules for role changes.
        if (appUser.role !== role) {
          appUser.role = role;
          await updateUser(appUser);
        }

        setUser(appUser);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fbUser = userCredential.user;

      const defaultAvatar =
        PlaceHolderImages.find((p) => p.id === 'default-avatar')?.imageUrl ??
        '';

      const newUser: User = {
        id: fbUser.uid,
        name,
        email,
        // New signups are always 'User' role by default for this app
        role: 'User',
        avatar: defaultAvatar,
      };

      await addUser(newUser);
      setUser(newUser);
      return newUser;
    },
    []
  );

  return (
    <UserContext.Provider
      value={{ user, firebaseUser, isLoading, login, logout, signup }}
    >
      {children}
    </UserContext.Provider>
  );
}
