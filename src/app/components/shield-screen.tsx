import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useXp, EMERGENCY_UNLOCK_COST } from "./xp-context";
import { useTheme } from "./theme-context";

/* ─── Mindfulness Quotes ─── */
const LIFE_TIPS = [
  "Notice the temperature of the air on your skin before you scroll.",
  "Take three slow breaths. If you still want to open this app, it will still be here.",
  "What were you doing before you picked up your phone? Go finish that first.",
  "Your future self is watching. Make them proud.",
  "The next 15 minutes of your life are worth more than any feed.",
  "Close your eyes. Count to ten. Then decide if this is what you really want.",
  "Every moment of resistance builds the person you're becoming.",
  "This craving will pass in 90 seconds. You can wait 90 seconds.",
  "Ask yourself: am I opening this out of boredom, or intention?",
  "The scroll never ends. But this moment does.",
  "You don't need to know what everyone else is doing right now.",
  "Put the phone down. Look around. Name five things you can see.",
  "Stillness is not wasted time. It is where clarity lives.",
  "What would you do right now if this phone didn't exist?",
  "You've already proven you can resist. One more minute won't hurt.",
];

export function ShieldScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get("app") || "unknown";
  const appName = searchParams.get("name") || "This App";
  const { xp, emergencyUnlock } = useXp();
  const { colors, isLegendary } = useTheme();

  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockFailed, setUnlockFailed] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");

  // Pick a random quote on mount
  const quote = useMemo(
    () => LIFE_TIPS[Math.floor(Math.random() * LIFE_TIPS.length)],
    []
  );

  const canAfford = xp >= EMERGENCY_UNLOCK_COST;

  // Breathing cycle
  useEffect(() => {
    const phases: Array<{ phase: "in" | "hold" | "out"; duration: number }> = [
      { phase: "in", duration: 4000 },
      { phase: "hold", duration: 2000 },
      { phase: "out", duration: 4000 },
    ];
    let currentIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const cycle = () => {
      setBreathPhase(phases[currentIndex].phase);
      timeout = setTimeout(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        cycle();
      }, phases[currentIndex].duration);
    };

    cycle();
    return () => clearTimeout(timeout);
  }, []);

  const handleReturnToLife = () => {
    navigate("/");
  };

  const handleEmergencyUnlock = () => {
    if (!canAfford) {
      setUnlockFailed(true);
      setTimeout(() => setUnlockFailed(false), 2000);
      return;
    }
    setIsUnlocking(true);
    // Small delay for the animation
    setTimeout(() => {
      const success = emergencyUnlock(appId);
      if (success) {
        // Simulate "opening" the app — navigate back to home
        setTimeout(() => navigate("/"), 800);
      } else {
        setIsUnlocking(false);
        setUnlockFailed(true);
        setTimeout(() => setUnlockFailed(false), 2000);
      }
    }, 600);
  };

  // Sage green / sand gradient colors
  const gradientBg = isLegendary
    ? "radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.08) 0%, rgba(14,14,13,0.95) 50%, rgba(14,14,13,1) 100%)"
    : "radial-gradient(ellipse at 30% 20%, rgba(180,195,160,0.25) 0%, rgba(220,215,200,0.3) 40%, rgba(247,246,243,0.9) 100%)";

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-8 select-none relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isUnlocking ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Soft blurred gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: gradientBg,
          filter: "blur(0px)",
        }}
      />

      {/* Floating ambient orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          top: "10%",
          left: "-10%",
          background: isLegendary
            ? "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(160,180,140,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, 10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          bottom: "15%",
          right: "-5%",
          background: isLegendary
            ? "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(210,200,170,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, -15, 0],
          y: [0, -8, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[340px]">
        {/* Top — app name being blocked */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "8px",
              color: isLegendary ? colors.goldAccent : "#b4b0a6",
              fontWeight: 300,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
            }}
          >
            Shield Active
          </span>
          <span
            className="mt-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "16px",
              color: colors.textMuted,
              fontWeight: 400,
              fontStyle: "italic",
            }}
          >
            {appName}
          </span>
        </motion.div>

        {/* Breathing indicator */}
        <motion.div
          className="mb-10 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            className="rounded-full"
            style={{
              backgroundColor: isLegendary
                ? "rgba(201,168,76,0.12)"
                : "rgba(160,180,140,0.15)",
              border: `0.5px solid ${
                isLegendary
                  ? "rgba(201,168,76,0.2)"
                  : "rgba(160,180,140,0.25)"
              }`,
            }}
            animate={{
              width: breathPhase === "in" ? 48 : breathPhase === "hold" ? 48 : 32,
              height: breathPhase === "in" ? 48 : breathPhase === "hold" ? 48 : 32,
              opacity: breathPhase === "hold" ? 0.8 : 0.5,
            }}
            transition={{ duration: breathPhase === "hold" ? 0.3 : 3.5, ease: "easeInOut" }}
          />
          <span
            className="mt-3"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "8px",
              color: isLegendary ? colors.goldAccent + "80" : "#c8c5be",
              fontWeight: 300,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            {breathPhase === "in" ? "Breathe in" : breathPhase === "hold" ? "Hold" : "Breathe out"}
          </span>
        </motion.div>

        {/* Life Tip card */}
        <motion.div
          className="w-full px-6 py-8 mb-12"
          style={{
            backgroundColor: isLegendary
              ? "rgba(26, 26, 24, 0.8)"
              : "rgba(255, 255, 255, 0.75)",
            borderRadius: "4px",
            border: `0.5px solid ${
              isLegendary ? "rgba(201,168,76,0.15)" : "rgba(0,0,0,0.04)"
            }`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        >
          <span
            className="block mb-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "8px",
              color: isLegendary ? colors.goldAccent : "#b4b0a6",
              fontWeight: 400,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
          >
            Life Tip
          </span>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px",
              color: colors.textPrimary,
              fontWeight: 400,
              lineHeight: 1.6,
              letterSpacing: "0.01em",
              margin: 0,
            }}
          >
            {quote}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col items-center gap-6 w-full"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {/* Return to Life — primary, solid button */}
          <motion.button
            className="w-full cursor-pointer py-4 px-6"
            style={{
              backgroundColor: isLegendary ? "#1e1b14" : "#4a4a47",
              color: isLegendary ? colors.goldAccent : "#f7f6f3",
              fontFamily: "'Playfair Display', serif",
              fontSize: "15px",
              fontWeight: 400,
              letterSpacing: "0.06em",
              borderRadius: "3px",
              border: isLegendary
                ? `0.5px solid ${colors.goldAccent}30`
                : "0.5px solid rgba(74,74,71,0.8)",
            }}
            whileTap={{ scale: 0.98, opacity: 0.8 }}
            whileHover={{ opacity: 0.9 }}
            onClick={handleReturnToLife}
          >
            Return to Life
          </motion.button>

          {/* Emergency Unlock — tiny, transparent, de-emphasized */}
          <motion.button
            className="bg-transparent border-none cursor-pointer px-4 py-2 relative"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "10px",
              color: canAfford
                ? (isLegendary ? colors.goldAccent + "70" : "#b8b5ad")
                : (isLegendary ? colors.goldAccent + "30" : "#ddd9d2"),
              fontWeight: 300,
              letterSpacing: "0.1em",
              opacity: canAfford ? 1 : 0.5,
            }}
            whileTap={canAfford ? { scale: 0.95, opacity: 0.5 } : {}}
            onClick={handleEmergencyUnlock}
          >
            Unlock for {EMERGENCY_UNLOCK_COST} XP
            {/* Insufficient XP feedback */}
            <AnimatePresence>
              {unlockFailed && (
                <motion.span
                  className="absolute -bottom-5 left-0 right-0 text-center"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "8px",
                    color: "#c06050",
                    fontWeight: 300,
                    letterSpacing: "0.1em",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Not enough XP ({xp}/{EMERGENCY_UNLOCK_COST})
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* XP balance — very subtle, at the bottom */}
        <motion.div
          className="mt-10 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "8px",
              color: isLegendary ? colors.goldAccent + "50" : "#d0cdc7",
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {xp} XP remaining
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "8px",
              color: isLegendary ? colors.goldAccent + "30" : "#e0ddd7",
              fontWeight: 300,
            }}
          >
            ·
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "8px",
              color: isLegendary ? colors.goldAccent + "50" : "#d0cdc7",
              fontWeight: 300,
              letterSpacing: "0.15em",
            }}
          >
            15 min access
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
