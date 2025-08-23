import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const adminEmails = [
        'admin@reach-hk.org',
        'admin@reach.com',
        'admin@example.com',
        'reachbeyond600@gmail.com'
      ];
      
      const isAdminUser = adminEmails.includes(user.email?.toLowerCase() || '') || 
                         user.email?.toLowerCase().includes('admin');
      
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        await signOut(auth);
        throw new Error("Access denied. Admin privileges required.");
      }
    } catch (error: any) {
      throw new Error(error.message || "Authentication failed");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        const adminEmails = [
          'admin@reach-hk.org',
          'admin@reach.com',
          'admin@example.com',
          'reachbeyond600@gmail.com'
        ];
        
        const isAdminUser = adminEmails.includes(user.email?.toLowerCase() || '') || 
                           user.email?.toLowerCase().includes('admin');
        
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
