import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useVortex, type AppToken } from "./vortex-context";
import { useXp, UNLOCK_COST } from "./xp-context";
import { useTheme } from "./theme-context";
import { ShieldCheck, ShieldOff, ChevronLeft, Plus, X, Unlock, Lock } from "lucide-react";

// Simulated app catalog
const APP_CATALOG = [
  { id: "instagram", name: "Instagram", category: "Social" },
  { id: "twitter", name: "X (Twitter)", category: "Social" },
  { id: "tiktok", name: "TikTok", category: "Entertainment" },
  { id: "youtube", name: "YouTube", category: "Entertainment" },
  { id: "facebook", name: "Facebook", category: "Social" },
  { id: "snapchat", name: "Snapchat", category: "Social" },
  { id: "reddit", name: "Reddit", category: "News" },
  { id: "netflix", name: "Netflix", category: "Entertainment" },
  { id: "threads", name: "Threads", category: "Social" },
  { id: "discord", name: "Discord", category: "Social" },
  { id: "twitch", name: "Twitch", category: "Entertainment" },
  { id: "pinterest", name: "Pinterest", category: "Lifestyle" },
  { id: "linkedin", name: "LinkedIn", category: "Productivity" },
  { id: "whatsapp", name: "WhatsApp", category: "Social" },
  { id: "telegram", name: "Telegram", category: "Social" },
  { id: "safari", name: "Safari", category: "Utilities" },
  { id: "chrome", name: "Chrome", category: "Utilities" },
  { id: "spotify", name: "Spotify", category: "Entertainment" },
];

export function GatekeeperScreen() {
  const navigate = useNavigate();
  const { blockedApps, isFocusActive, addApp, removeApp } = useVortex();
  const { xp, burnXp, isAppUnlocked } = useXp();
  const { colors, isLegendary } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

  const availableApps = APP_CATALOG.filter(
    (app) => !blockedApps.find((b) => b.id === app.id)
  );
  const categories = [...new Set(availableApps.map((a) => a.category))];

  return (
    <div
      className="min-h-screen flex flex-col select-none relative"
      style={{ backgroundColor: colors.bg, transition: "background-color 0.8s ease" }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between px-6 pt-14 pb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          className="bg-transparent border-none cursor-pointer p-2 -ml-2"
          whileTap={{ scale: 0.9, opacity: 0.5 }}
          onClick={() => navigate("/")}
        >
          <ChevronLeft size={18} color={colors.textMuted} strokeWidth={1} />
        </motion.button>

        <div className="flex flex-col items-center">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "9px",
              color: colors.textFaint,
              fontWeight: 300,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
          >
            Gatekeeper
          </span>
          <span
            className="mt-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px",
              color: colors.textPrimary,
              fontWeight: 400,
            }}
          >
            Vortex Apps
          </span>
        </div>

        {/* XP balance indicator */}
        <div className="flex flex-col items-end">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "14px",
              color: isLegendary ? colors.goldAccent : colors.textPrimary,
              fontWeight: 400,
            }}
          >
            {xp}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "7px",
              color: colors.textFaint,
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            XP
          </span>
        </div>
      </motion.div>

      {/* Shield Status Banner */}
      <motion.div
        className="mx-6 mb-6 flex items-center gap-3 px-5 py-4"
        style={{
          backgroundColor: isFocusActive ? colors.shieldBg : colors.bgSubtle,
          borderRadius: "3px",
          border: `0.5px solid ${isFocusActive ? colors.shieldBorder : colors.borderDefault}`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {isFocusActive ? (
          <ShieldCheck size={14} color={colors.shieldActive} strokeWidth={1.2} />
        ) : (
          <ShieldOff size={14} color={colors.textMuted} strokeWidth={1.2} />
        )}
        <div className="flex flex-col">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "10px",
              color: isFocusActive ? colors.shieldText : colors.textSecondary,
              fontWeight: 400,
              letterSpacing: "0.1em",
            }}
          >
            {isFocusActive ? "Shield Active" : "Shield Inactive"}
          </span>
          <span
            className="mt-0.5"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "9px",
              color: isFocusActive ? colors.shieldActive : colors.textFaint,
              fontWeight: 300,
              letterSpacing: "0.05em",
              opacity: 0.8,
            }}
          >
            {isFocusActive
              ? `${blockedApps.length} apps blocked · Spend ${UNLOCK_COST} XP to unlock`
              : "Start a Focus session to activate shielding"}
          </span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        className="mx-6 mb-5"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "10px",
          color: colors.textMuted,
          fontWeight: 300,
          letterSpacing: "0.05em",
          lineHeight: 1.7,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Select apps that pull you into the vortex. During Focus sessions, these
        apps are shielded. You may temporarily unlock one by burning {UNLOCK_COST} XP.
      </motion.p>

      {/* Blocked Apps List */}
      <motion.div
        className="flex-1 px-6 overflow-y-auto pb-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "9px",
              color: colors.textFaint,
              fontWeight: 300,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Authorized Tokens ({blockedApps.length})
          </span>
          <motion.button
            className="bg-transparent border-none cursor-pointer flex items-center gap-1.5 p-1"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "9px",
              color: colors.textMuted,
              fontWeight: 300,
              letterSpacing: "0.2em",
            }}
            whileTap={{ scale: 0.95, opacity: 0.5 }}
            onClick={() => setShowPicker(true)}
          >
            <Plus size={12} color={colors.textMuted} strokeWidth={1.2} />
            <span style={{ textTransform: "uppercase" }}>Add</span>
          </motion.button>
        </div>

        {/* Token cards */}
        <AnimatePresence mode="popLayout">
          {blockedApps.map((app, index) => (
            <TokenCard
              key={app.id}
              app={app}
              index={index}
              isExpanded={expandedToken === app.id}
              isFocusActive={isFocusActive}
              isUnlocked={isAppUnlocked(app.id)}
              canAffordUnlock={xp >= UNLOCK_COST}
              colors={colors}
              isLegendary={isLegendary}
              onToggleExpand={() =>
                setExpandedToken(expandedToken === app.id ? null : app.id)
              }
              onRemove={() => removeApp(app.id)}
              onUnlock={() => burnXp(app.id)}
            />
          ))}
        </AnimatePresence>

        {blockedApps.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ShieldOff size={24} color={colors.borderDefault} strokeWidth={0.8} />
            <span
              className="mt-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                color: colors.textFaint,
                fontWeight: 300,
                letterSpacing: "0.1em",
              }}
            >
              No vortex apps selected
            </span>
            <span
              className="mt-1"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                color: colors.borderDefault,
                fontWeight: 300,
                letterSpacing: "0.05em",
              }}
            >
              Tap + Add to choose apps to shield
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Activity Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <ActivityPicker
            availableApps={availableApps}
            categories={categories}
            colors={colors}
            isLegendary={isLegendary}
            onSelect={(app) => addApp(app)}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Token Card ─── */
function TokenCard({
  app,
  index,
  isExpanded,
  isFocusActive,
  isUnlocked,
  canAffordUnlock,
  colors,
  isLegendary,
  onToggleExpand,
  onRemove,
  onUnlock,
}: {
  app: AppToken;
  index: number;
  isExpanded: boolean;
  isFocusActive: boolean;
  isUnlocked: boolean;
  canAffordUnlock: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
  isLegendary: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onUnlock: () => void;
}) {
  const [countdown, setCountdown] = useState("");

  // Show remaining unlock time
  useEffect(() => {
    if (!isUnlocked) {
      setCountdown("");
      return;
    }
    const timer = setInterval(() => {
      // The unlock expiry is managed in context; we just show a general indicator
      setCountdown("unlocked");
    }, 1000);
    return () => clearInterval(timer);
  }, [isUnlocked]);

  return (
    <motion.div
      className="mb-3 cursor-pointer"
      style={{
        backgroundColor: colors.bgCard,
        borderRadius: "3px",
        border: `0.5px solid ${
          isUnlocked
            ? (isLegendary ? colors.goldAccent + "60" : "#dbc980")
            : isFocusActive
            ? colors.shieldBorder
            : colors.borderDefault
        }`,
        overflow: "hidden",
        transition: "border-color 0.3s ease",
      }}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onToggleExpand}
    >
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          {/* Shield indicator */}
          <div
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: "2px",
              backgroundColor: isUnlocked
                ? (isLegendary ? colors.goldAccent + "15" : "#faf5e4")
                : isFocusActive
                ? colors.shieldBg
                : colors.bg,
              border: `0.5px solid ${
                isUnlocked
                  ? (isLegendary ? colors.goldAccent + "40" : "#e0d5a0")
                  : isFocusActive
                  ? colors.shieldBorder
                  : colors.borderDefault
              }`,
              transition: "all 0.3s ease",
            }}
          >
            {isUnlocked ? (
              <Unlock size={12} color={isLegendary ? colors.goldAccent : "#baa840"} strokeWidth={1.2} />
            ) : isFocusActive ? (
              <ShieldCheck size={12} color={colors.shieldActive} strokeWidth={1.2} />
            ) : (
              <ShieldOff size={12} color={colors.textFaint} strokeWidth={1.2} />
            )}
          </div>

          <div className="flex flex-col">
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "14px",
                color: colors.textPrimary,
                fontWeight: 400,
              }}
            >
              {app.name}
            </span>
            <span
              className="mt-0.5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                color: isUnlocked ? (isLegendary ? colors.goldAccent : "#baa840") : colors.textFaint,
                fontWeight: 300,
                letterSpacing: "0.1em",
              }}
            >
              {isUnlocked ? "Temporarily unlocked" : app.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unlock button — visible only during focus, if not already unlocked */}
          {isFocusActive && !isUnlocked && (
            <motion.button
              className="flex items-center gap-1 bg-transparent border-none cursor-pointer px-2 py-1.5"
              style={{
                borderRadius: "2px",
                border: `0.5px solid ${canAffordUnlock ? (isLegendary ? colors.goldAccent + "60" : "#d4dbc9") : colors.borderDefault}`,
                opacity: canAffordUnlock ? 1 : 0.4,
              }}
              whileTap={canAffordUnlock ? { scale: 0.92 } : {}}
              onClick={(e) => {
                e.stopPropagation();
                if (canAffordUnlock) onUnlock();
              }}
            >
              <Lock size={9} color={canAffordUnlock ? (isLegendary ? colors.goldAccent : "#8a9a75") : colors.textFaint} strokeWidth={1.2} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "8px",
                  color: canAffordUnlock ? (isLegendary ? colors.goldAccent : "#8a9a75") : colors.textFaint,
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                -{UNLOCK_COST} XP
              </span>
            </motion.button>
          )}

          <motion.button
            className="bg-transparent border-none cursor-pointer p-1.5"
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X size={13} color={colors.borderDefault} strokeWidth={1.2} />
          </motion.button>
        </div>
      </div>

      {/* Expanded token details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-3.5 pt-1"
              style={{ borderTop: `0.5px solid ${colors.bgSubtle}` }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "8px",
                  color: colors.textFaint,
                  fontWeight: 300,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Activity Token
              </span>
              <div
                className="px-3 py-2"
                style={{
                  backgroundColor: colors.bgAccent,
                  borderRadius: "2px",
                  border: `0.5px solid ${colors.bgSubtle}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    fontSize: "9px",
                    color: colors.textMuted,
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    wordBreak: "break-all",
                  }}
                >
                  {app.token}
                </span>
              </div>
              <span
                className="mt-2 block"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "8px",
                  color: colors.textFaint,
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                }}
              >
                {isUnlocked
                  ? "→ Shield bypassed · XP burned · 5 min window"
                  : isFocusActive
                  ? "→ Sent to ManagedSettingsStore · Shield active"
                  : "→ Stored locally · Shield activates during Focus"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Activity Picker ─── */
function ActivityPicker({
  availableApps,
  categories,
  colors,
  isLegendary,
  onSelect,
  onClose,
}: {
  availableApps: { id: string; name: string; category: string }[];
  categories: string[];
  colors: ReturnType<typeof useTheme>["colors"];
  isLegendary: boolean;
  onSelect: (app: { id: string; name: string; category: string }) => void;
  onClose: () => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleApp = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const confirmSelection = () => {
    availableApps
      .filter((a) => selectedIds.has(a.id))
      .forEach((app) => onSelect(app));
    onClose();
  };

  const checkColor = isLegendary ? colors.goldAccent : "#8a9a75";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: colors.backdrop }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative w-full max-w-[430px] flex flex-col"
        style={{
          backgroundColor: colors.bg,
          borderRadius: "8px 8px 0 0",
          maxHeight: "75vh",
          borderTop: `0.5px solid ${colors.borderDefault}`,
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div
            style={{
              width: 28,
              height: 2,
              backgroundColor: colors.borderDefault,
              borderRadius: 1,
            }}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <motion.button
            className="bg-transparent border-none cursor-pointer"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              color: colors.textMuted,
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
            whileTap={{ opacity: 0.5 }}
            onClick={onClose}
          >
            Cancel
          </motion.button>

          <div className="flex flex-col items-center">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                color: colors.textFaint,
                fontWeight: 300,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              Activity Picker
            </span>
            <span
              className="mt-0.5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "15px",
                color: colors.textPrimary,
                fontWeight: 400,
              }}
            >
              Select Apps
            </span>
          </div>

          <motion.button
            className="bg-transparent border-none cursor-pointer"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              color: selectedIds.size > 0 ? checkColor : colors.textFaint,
              fontWeight: 400,
              letterSpacing: "0.05em",
            }}
            whileTap={{ scale: 0.95, opacity: 0.5 }}
            onClick={confirmSelection}
          >
            Done{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </motion.button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-6 pb-10"
          style={{ overscrollBehavior: "contain" }}
        >
          {categories.map((category) => {
            const apps = availableApps.filter((a) => a.category === category);
            if (apps.length === 0) return null;

            return (
              <div key={category} className="mb-5">
                <span
                  className="block mb-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "8px",
                    color: colors.textFaint,
                    fontWeight: 300,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  {category}
                </span>

                {apps.map((app) => {
                  const isSelected = selectedIds.has(app.id);
                  return (
                    <motion.button
                      key={app.id}
                      className="w-full flex items-center gap-3 bg-transparent border-none cursor-pointer px-4 py-3 mb-1"
                      style={{
                        backgroundColor: isSelected ? colors.bgCard : "transparent",
                        borderRadius: "3px",
                        border: isSelected
                          ? `0.5px solid ${isLegendary ? colors.goldAccent + "40" : colors.shieldBorder}`
                          : "0.5px solid transparent",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleApp(app.id)}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "2px",
                          border: `0.5px solid ${isSelected ? checkColor : colors.borderDefault}`,
                          backgroundColor: isSelected
                            ? (isLegendary ? colors.goldAccent + "15" : colors.shieldBg)
                            : "transparent",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          >
                            <svg width={10} height={8} viewBox="0 0 10 8" fill="none">
                              <path
                                d="M1 3.5L3.5 6L9 1"
                                stroke={checkColor}
                                strokeWidth={1}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "13px",
                          color: isSelected ? colors.textPrimary : colors.textMuted,
                          fontWeight: 400,
                        }}
                      >
                        {app.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}