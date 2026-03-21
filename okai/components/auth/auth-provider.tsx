"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, LogIn } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sync failed", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
      <AnimatePresence>
        {!loading && !user && (
          <AuthOverlay signInWithGoogle={signInWithGoogle} />
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}

function AuthOverlay({ signInWithGoogle }: { signInWithGoogle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          OPEN|KLASS AI requires verified clearance. Please authenticate to enter the interactive knowledge environment.
        </p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-3 w-full py-4 bg-white hover:bg-slate-200 text-black font-semibold rounded-xl transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Authenticate with Google
        </button>
      </motion.div>
    </motion.div>
  );
}
