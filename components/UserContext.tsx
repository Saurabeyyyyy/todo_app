import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { account } from "../src/appwrite/config";

interface User {
  fullName: string;
  email: string;
  memberSince: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  login: (email: string, password: string) => Promise<User>;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const devSessionResetState = globalThis as typeof globalThis & {
  __appwriteDevSessionResetDone__?: boolean;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshPromiseRef = useRef<Promise<User | null> | null>(null);

  const refreshUser = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const request = (async () => {
      try {
        if (__DEV__) {
          console.log("Checking Appwrite session.");
        }

        const currentUser = await account.get();
        if (__DEV__) {
          console.log("Session exists:", currentUser);
        }

        const nextUser = {
          id: currentUser.$id,
          fullName: currentUser.name,
          email: currentUser.email,
          memberSince: new Date(currentUser.$createdAt).toLocaleDateString(),
        };

        setUser(nextUser);
        return nextUser;
      } catch (error) {
        if (__DEV__) {
          console.log("No session found.");
          console.log("Session check error:", error);
        }
        setUser(null);
        return null;
      } finally {
        setLoading(false);
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = request;
    return request;
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (__DEV__ && !devSessionResetState.__appwriteDevSessionResetDone__) {
        devSessionResetState.__appwriteDevSessionResetDone__ = true;

        try {
          console.log("Development mode: clearing existing Appwrite session once on startup.");
          console.log("deleteSession started.");
          await account.deleteSession("current");
          console.log("deleteSession successful.");
        } catch (error) {
          if (__DEV__) {
            console.error("deleteSession failed:", error);
          }
        } finally {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      await refreshUser();
    };

    bootstrapAuth();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    if (__DEV__) {
      console.log("Login started.");
    }

    await account.createEmailPasswordSession(email, password);

    if (__DEV__) {
      console.log("createEmailPasswordSession successful.");
    }

    const currentUser = await refreshUser();

    if (!currentUser) {
      throw new Error("Login completed but the Appwrite session could not be restored.");
    }

    return currentUser;
  }, [refreshUser]);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUser } : prevUser));
  }, []);

  const logout = useCallback(async () => {
    try {
      if (__DEV__) {
        console.log("deleteSession started.");
      }

      await account.deleteSession("current");

      if (__DEV__) {
        console.log("deleteSession successful.");
      }

      setUser(null);
      setLoading(false);
      return true;
    } catch (error: any) {
      if (__DEV__) {
        console.error("deleteSession failed:", error);
      }

      Alert.alert("Error", error.message || "Failed to log out.");
      setUser(null);
      setLoading(false);
      return false;
    }
  }, []);


  return (
    <UserContext.Provider value={{ user, loading, setUser, updateUser, login, refreshUser, logout }}>
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