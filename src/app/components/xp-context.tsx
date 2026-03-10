import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

/* ─── Constants ─── */
const MAX_XP = 500;
const PASSIVE_XP_AMOUNT = 10;
// Accelerated for demo: earn every 15s instead of every 30min
const PASSIVE_INTERVAL_MS = 15_000;
const UNLOCK_COST = 50; // XP cost to temporarily unlock a vortex app
const UNLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes unlock window
const FOCUS_COMPLETE_BONUS = 50;
const STREAK_THRESHOLD = 3; // consecutive days to unlock Legendary
const EMERGENCY_UNLOCK_COST = 100; // XP cost via Shield interception
const EMERGENCY_UNLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/* ─── Types ─── */
interface DayRecord {
  date: string; // YYYY-MM-DD
  peakXp: number;
  completed: boolean; // hit MAX_XP
}

interface UnlockedApp {
  id: string;
  expiresAt: number; // timestamp
}

interface XpContextType {
  xp: number;
  maxXp: number;
  streakDays: number;
  isLegendary: boolean;
  isPassiveEarning: boolean;
  unlockedApps: UnlockedApp[];
  history: DayRecord[];
  addXp: (amount: number) => void;
  burnXp: (appId: string) => boolean;
  emergencyUnlock: (appId: string) => boolean;
  isAppUnlocked: (appId: string) => boolean;
  awardFocusBonus: () => void;
  togglePassiveEarning: (active: boolean) => void;
  resetDaily: () => void;
}

const XpContext = createContext<XpContextType | null>(null);

/* ─── Helpers ─── */
function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function calculateStreak(history: DayRecord[]): number {
  if (history.length === 0) return 0;

  // Sort descending by date
  const sorted = [...history]
    .filter((d) => d.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedKey = expected.toISOString().slice(0, 10);

    if (sorted[i]?.date === expectedKey) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/* ─── Provider ─── */
export function XpProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(() => loadFromStorage("detox_xp", 140));
  const [history, setHistory] = useState<DayRecord[]>(() =>
    loadFromStorage("detox_history", [])
  );
  const [unlockedApps, setUnlockedApps] = useState<UnlockedApp[]>([]);
  const [isPassiveEarning, setIsPassiveEarning] = useState(true);
  const passiveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const streakDays = calculateStreak(history);
  const isLegendary = streakDays >= STREAK_THRESHOLD;

  // Persist XP
  useEffect(() => {
    saveToStorage("detox_xp", xp);

    // Update today's record
    const key = todayKey();
    setHistory((prev) => {
      const existing = prev.find((d) => d.date === key);
      const completed = xp >= MAX_XP;
      let updated: DayRecord[];

      if (existing) {
        updated = prev.map((d) =>
          d.date === key
            ? { ...d, peakXp: Math.max(d.peakXp, xp), completed: completed || d.completed }
            : d
        );
      } else {
        updated = [...prev, { date: key, peakXp: xp, completed }];
      }

      // Keep last 30 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffKey = cutoff.toISOString().slice(0, 10);
      updated = updated.filter((d) => d.date >= cutoffKey);

      saveToStorage("detox_history", updated);
      return updated;
    });
  }, [xp]);

  // Passive earning engine
  useEffect(() => {
    if (isPassiveEarning) {
      passiveRef.current = setInterval(() => {
        setXp((prev) => Math.min(prev + PASSIVE_XP_AMOUNT, MAX_XP));
      }, PASSIVE_INTERVAL_MS);
    }

    return () => {
      if (passiveRef.current) clearInterval(passiveRef.current);
    };
  }, [isPassiveEarning]);

  // Clean up expired unlocks
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setUnlockedApps((prev) => prev.filter((u) => u.expiresAt > now));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const addXp = useCallback((amount: number) => {
    setXp((prev) => Math.min(prev + amount, MAX_XP));
  }, []);

  const burnXp = useCallback(
    (appId: string): boolean => {
      if (xp < UNLOCK_COST) return false;

      setXp((prev) => Math.max(prev - UNLOCK_COST, 0));
      setUnlockedApps((prev) => [
        ...prev.filter((u) => u.id !== appId),
        { id: appId, expiresAt: Date.now() + UNLOCK_DURATION_MS },
      ]);
      return true;
    },
    [xp]
  );

  const emergencyUnlock = useCallback(
    (appId: string): boolean => {
      if (xp < EMERGENCY_UNLOCK_COST) return false;

      setXp((prev) => Math.max(prev - EMERGENCY_UNLOCK_COST, 0));
      setUnlockedApps((prev) => [
        ...prev.filter((u) => u.id !== appId),
        { id: appId, expiresAt: Date.now() + EMERGENCY_UNLOCK_DURATION_MS },
      ]);
      return true;
    },
    [xp]
  );

  const isAppUnlocked = useCallback(
    (appId: string) => {
      const now = Date.now();
      return unlockedApps.some((u) => u.id === appId && u.expiresAt > now);
    },
    [unlockedApps]
  );

  const awardFocusBonus = useCallback(() => {
    setXp((prev) => Math.min(prev + FOCUS_COMPLETE_BONUS, MAX_XP));
  }, []);

  const togglePassiveEarning = useCallback((active: boolean) => {
    setIsPassiveEarning(active);
  }, []);

  const resetDaily = useCallback(() => {
    setXp(0);
  }, []);

  return (
    <XpContext.Provider
      value={{
        xp,
        maxXp: MAX_XP,
        streakDays,
        isLegendary,
        isPassiveEarning,
        unlockedApps,
        history,
        addXp,
        burnXp,
        emergencyUnlock,
        isAppUnlocked,
        awardFocusBonus,
        togglePassiveEarning,
        resetDaily,
      }}
    >
      {children}
    </XpContext.Provider>
  );
}

export function useXp() {
  const ctx = useContext(XpContext);
  if (!ctx) throw new Error("useXp must be used within XpProvider");
  return ctx;
}

export { UNLOCK_COST, MAX_XP, EMERGENCY_UNLOCK_COST };