import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface AppToken {
  id: string;
  name: string;
  category: string;
  token: string; // simulated opaque token
}

interface VortexContextType {
  blockedApps: AppToken[];
  isFocusActive: boolean;
  addApp: (app: Omit<AppToken, "token">) => void;
  removeApp: (id: string) => void;
  toggleFocus: (active: boolean) => void;
  isShielded: (id: string) => boolean;
}

const VortexContext = createContext<VortexContextType | null>(null);

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "tok_";
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function VortexProvider({ children }: { children: ReactNode }) {
  const [blockedApps, setBlockedApps] = useState<AppToken[]>([
    { id: "instagram", name: "Instagram", category: "Social", token: generateToken() },
    { id: "twitter", name: "X (Twitter)", category: "Social", token: generateToken() },
    { id: "tiktok", name: "TikTok", category: "Entertainment", token: generateToken() },
  ]);
  const [isFocusActive, setIsFocusActive] = useState(false);

  const addApp = useCallback((app: Omit<AppToken, "token">) => {
    setBlockedApps((prev) => {
      if (prev.find((a) => a.id === app.id)) return prev;
      return [...prev, { ...app, token: generateToken() }];
    });
  }, []);

  const removeApp = useCallback((id: string) => {
    setBlockedApps((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleFocus = useCallback((active: boolean) => {
    setIsFocusActive(active);
  }, []);

  const isShielded = useCallback(
    (id: string) => isFocusActive && blockedApps.some((a) => a.id === id),
    [isFocusActive, blockedApps]
  );

  return (
    <VortexContext.Provider
      value={{ blockedApps, isFocusActive, addApp, removeApp, toggleFocus, isShielded }}
    >
      {children}
    </VortexContext.Provider>
  );
}

export function useVortex() {
  const context = useContext(VortexContext);
  if (!context) throw new Error("useVortex must be used within VortexProvider");
  return context;
}
