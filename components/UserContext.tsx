import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
  fullName: string;
  memberSince: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void; // new
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@user';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        if (stored) {
          setUser(JSON.parse(stored));
        }
      }
    };
    loadUser();
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  // Partial update
  const updateUserInfo = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      updateUser(updated);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser: updateUser, logout, updateUser: updateUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};