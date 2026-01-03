'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt);
        setCurrentUserState(user);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUserState(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

