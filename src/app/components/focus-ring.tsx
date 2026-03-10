import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./theme-context";

/* ─── Breathing Modes ─── */
type BreathingMode = "idle" | "focus" | "urgent";

function useBreathingConfig(mode: BreathingMode, xpRatio: number) {
  return useMemo(() => {
    // Urgency increases as XP drops below 20%
    const urgency = xpRatio < 0.1 ? 1 : xpRatio < 0.2 ? 0.6 : 0;

    switch (mode) {
      case "focus":
        return {
          // Deep focus: slow, meditative breathing
          scaleCycle: [1, 1.025, 1],
          opacityCycle: [0.85, 1, 0.85],
          duration: 6,
          strokePulse: [0, 0.3, 0],
          ease: "easeInOut" as const,
          glowPulse: true,
        };
      case "urgent":
        return {
          // Low XP urgency: faster, jittery pulsing
          scaleCycle: [1, 1.008 + urgency * 0.015, 0.995, 1.01, 1],
          opacityCycle: [0.7, 1, 0.65, 0.95, 0.7],
          duration: 1.8 - urgency * 0.6,
          strokePulse: [0, 0.8, 0.2, 0.6, 0],
          ease: "easeInOut" as const,
          glowPulse: false,
        };
      case "idle":
      default:
        return {
          // Resting: gentle, almost imperceptible
          scaleCycle: [1, 1.012, 1],
          opacityCycle: [0.9, 1, 0.9],
          duration: 4,
          strokePulse: [0, 0.15, 0],
          ease: "easeInOut" as const,
          glowPulse: false,
        };
    }
  }, [mode, xpRatio < 0.1, xpRatio < 0.2]);
}

interface FocusRingProps {
  xp: number;
  maxXp: number;
  showStreak?: boolean;
  streakDays?: number;
  isLegendary?: boolean;
  earning?: boolean;
  mode?: BreathingMode;
}

export function FocusRing({
  xp,
  maxXp,
  showStreak = false,
  streakDays = 0,
  earning = false,
  mode = "idle",
}: FocusRingProps) {
  const { colors, isLegendary } = useTheme();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [prevXp, setPrevXp] = useState(xp);
  const [xpDelta, setXpDelta] = useState<number | null>(null);
  const progress = xp / maxXp;
  const radius = 72;
  const baseStroke = isLegendary ? 2 : 1.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - animatedProgress * circumference;

  const xpRatio = xp / maxXp;
  // Auto-escalate to urgent when XP is critically low (unless in focus mode)
  const effectiveMode = mode !== "focus" && xpRatio < 0.2 && xp > 0 ? "urgent" : mode;
  const breathing = useBreathingConfig(effectiveMode, xpRatio);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 300);
    return () => clearTimeout(timer);
  }, [progress]);

  // Detect XP changes for delta display
  useEffect(() => {
    if (xp !== prevXp) {
      const delta = xp - prevXp;
      setXpDelta(delta);
      setPrevXp(xp);
      const timeout = setTimeout(() => setXpDelta(null), 1500);
      return () => clearTimeout(timeout);
    }
  }, [xp, prevXp]);

  const isFull = xp >= maxXp;

  // Adaptive stroke width based on breathing phase — computed via CSS animation
  const strokeMin = baseStroke;
  const strokeMax = baseStroke + (effectiveMode === "urgent" ? 1.2 : effectiveMode === "focus" ? 0.5 : 0.3);

  const svgSize = radius * 2 + Math.ceil(strokeMax) * 2 + 8;
  const center = radius + Math.ceil(strokeMax) + 4;

  return (
    <div className="relative flex items-center justify-center">
      {/* Legendary glow effect — now pulses with breathing */}
      {isLegendary && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: radius * 2 + 24,
            height: radius * 2 + 24,
            boxShadow: colors.goldGlow as string,
          }}
          animate={
            breathing.glowPulse
              ? {
                  boxShadow: [
                    "0 0 30px rgba(201, 168, 76, 0.08)",
                    "0 0 50px rgba(201, 168, 76, 0.18)",
                    "0 0 30px rgba(201, 168, 76, 0.08)",
                  ],
                }
              : {}
          }
          transition={{
            duration: breathing.duration,
            repeat: Infinity,
            ease: breathing.ease,
          }}
        />
      )}

      {/* Breathing container — the whole ring scales gently */}
      <motion.div
        className="relative"
        animate={{
          scale: breathing.scaleCycle,
        }}
        transition={{
          duration: breathing.duration,
          repeat: Infinity,
          ease: breathing.ease,
        }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90"
        >
          {/* Background ring — fades with breathing */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.ringBg}
            strokeWidth={strokeMin}
            animate={{
              opacity: breathing.opacityCycle,
            }}
            transition={{
              duration: breathing.duration,
              repeat: Infinity,
              ease: breathing.ease,
            }}
          />

          {/* Progress ring — stroke width breathes */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isFull && isLegendary ? colors.goldAccent : colors.ringStroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: offset,
              strokeWidth: breathing.strokePulse.map(
                (t) => strokeMin + (strokeMax - strokeMin) * t
              ),
              opacity: breathing.opacityCycle,
            }}
            transition={{
              strokeDashoffset: { duration: 1.8, ease: "easeOut" },
              strokeWidth: {
                duration: breathing.duration,
                repeat: Infinity,
                ease: breathing.ease,
              },
              opacity: {
                duration: breathing.duration,
                repeat: Infinity,
                ease: breathing.ease,
              },
            }}
          />

          {/* Urgency shimmer particles — only in urgent mode */}
          {effectiveMode === "urgent" && animatedProgress > 0.05 && (
            <>
              <motion.circle
                cx={center}
                cy={center - radius}
                r={1.5}
                fill={isLegendary ? colors.goldAccent : "#c06050"}
                animate={{
                  opacity: [0, 0.8, 0, 0.5, 0],
                  r: [1, 2, 1, 1.5, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  transform: `rotate(${animatedProgress * 360}deg)`,
                }}
              />
              <motion.circle
                cx={center}
                cy={center - radius}
                r={1}
                fill={isLegendary ? colors.goldAccent : "#c06050"}
                animate={{
                  opacity: [0.5, 0, 0.7, 0],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  transform: `rotate(${animatedProgress * 360 * 0.7}deg)`,
                }}
              />
            </>
          )}

          {/* Legendary pulsing dot at progress tip — now syncs with breathing */}
          {isLegendary && animatedProgress > 0.05 && effectiveMode !== "urgent" && (
            <motion.circle
              cx={center}
              cy={center - radius}
              r={2.5}
              fill={colors.goldAccent}
              animate={{
                opacity: breathing.opacityCycle.map((o) => o * 0.6 + 0.2),
                r: breathing.strokePulse.map((t) => 2 + t * 1.5),
              }}
              transition={{
                duration: breathing.duration,
                repeat: Infinity,
                ease: breathing.ease,
              }}
              style={{
                transformOrigin: `${center}px ${center}px`,
                transform: `rotate(${animatedProgress * 360}deg)`,
              }}
            />
          )}
        </svg>
      </motion.div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Streak badge */}
        {showStreak && streakDays > 0 && (
          <motion.div
            className="flex items-center gap-1 mb-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "8px",
                color: isLegendary ? colors.goldAccent : colors.textFaint,
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {streakDays >= 3 ? "✦ " : ""}
              {streakDays} day streak
            </span>
          </motion.div>
        )}

        {/* Mode indicator — subtle text that changes with breathing mode */}
        <motion.span
          className="tracking-[0.25em] uppercase"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "9px",
            color: effectiveMode === "urgent"
              ? (isLegendary ? colors.goldAccent : "#c06050")
              : isLegendary
              ? colors.goldAccent
              : colors.textMuted,
            fontWeight: 300,
            letterSpacing: "0.3em",
          }}
          animate={
            effectiveMode === "urgent"
              ? { opacity: [0.6, 1, 0.6] }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {effectiveMode === "urgent" ? "Low XP" : "Focus XP"}
        </motion.span>

        {/* XP number with delta animation */}
        <div className="relative">
          <motion.span
            className="mt-1 block"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px",
              color: effectiveMode === "urgent"
                ? (isLegendary ? colors.goldAccent : colors.textPrimary)
                : colors.textPrimary,
              fontWeight: 400,
              textAlign: "center",
            }}
            animate={
              xpDelta
                ? { scale: [1, 1.05, 1] }
                : effectiveMode === "urgent"
                ? { opacity: [0.8, 1, 0.8] }
                : {}
            }
            transition={
              xpDelta
                ? { duration: 0.4 }
                : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {xp}
          </motion.span>

          {/* Delta popup */}
          <AnimatePresence>
            {xpDelta !== null && (
              <motion.span
                className="absolute -right-8 top-0"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  color: xpDelta > 0
                    ? (isLegendary ? colors.goldAccent : "#8a9a75")
                    : "#c06050",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: -4 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
              >
                {xpDelta > 0 ? `+${xpDelta}` : xpDelta}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "9px",
            color: colors.textFaint,
            fontWeight: 300,
          }}
        >
          / {maxXp}
        </span>

        {/* Passive earning indicator — syncs with breathing rhythm */}
        {earning && (
          <motion.div
            className="flex items-center gap-1.5 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: 3,
                height: 3,
                backgroundColor: isLegendary ? colors.goldAccent : "#8a9a75",
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: breathing.duration * 0.5,
                repeat: Infinity,
                ease: breathing.ease,
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "7px",
                color: isLegendary ? colors.goldAccent : "#8a9a75",
                fontWeight: 300,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Earning
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}