import React, { createContext, useContext, useEffect, useState } from "react";
import { account } from "../src/appwrite/config";

interface User {
  fullName: string;
  email: string;
  memberSince: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await account.get();

      setUser({
        fullName: currentUser.name,
        email: currentUser.email,
        memberSince: new Date(currentUser.$createdAt).toLocaleDateString(),
      });
    } catch {
      setUser(null);
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUser } : prevUser));
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
    } catch {}

    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}