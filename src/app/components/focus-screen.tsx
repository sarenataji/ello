import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useVortex } from "./vortex-context";
import { useXp } from "./xp-context";
import { useTheme } from "./theme-context";
import { FocusRing } from "./focus-ring";
import { ShieldCheck } from "lucide-react";

const FOCUS_DURATION = 25 * 60; // 25 minutes

export function FocusScreen() {
  const navigate = useNavigate();
  const { blockedApps, toggleFocus } = useVortex();
  const { xp, maxXp, streakDays, awardFocusBonus, isPassiveEarning } = useXp();
  const { colors, isLegendary } = useTheme();
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [shieldAnimated, setShieldAnimated] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [entered, setEntered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bonusAwarded = useRef(false);

  // Activate shield on mount, start timer after entrance animation
  useEffect(() => {
    toggleFocus(true);
    // Stagger: entrance animations play first, then shield animates, then timer starts
    const entranceTimer = setTimeout(() => setEntered(true), 400);
    const shieldTimer = setTimeout(() => {
      setShieldAnimated(true);
      setIsRunning(true);
    }, 1200);
    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(shieldTimer);
    };
  }, [toggleFocus]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // Award focus bonus when timer completes
  useEffect(() => {
    if (timeLeft === 0 && !bonusAwarded.current) {
      bonusAwarded.current = true;
      awardFocusBonus();
      setShowBonus(true);
      setTimeout(() => setShowBonus(false), 3000);
    }
  }, [timeLeft, awardFocusBonus]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / FOCUS_DURATION;

  const radius = 110;
  const stroke = isLegendary ? 1.5 : 1;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  const handleEnd = useCallback(() => {
    setIsEnding(true);
    setIsRunning(false);
    toggleFocus(false);
    // Reverse spatial transition — elements slide back
    setTimeout(() => navigate("/"), 600);
  }, [navigate, toggleFocus]);

  const completionPercent = Math.round(progress * 100);

  // Spatial entrance spring config
  const entranceSpring = { type: "spring" as const, damping: 28, stiffness: 200 };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-8 select-none relative overflow-hidden"
      style={{ backgroundColor: colors.bg, transition: "background-color 0.8s ease" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isEnding ? 0 : 1 }}
      transition={{ duration: isEnding ? 0.5 : 0.3 }}
    >
      {/* Subtle top label — slides down from above */}
      <motion.div
        className="absolute top-14 left-0 right-0 flex flex-col items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: isEnding ? 0 : 1,
          y: isEnding ? -30 : 0,
        }}
        transition={{
          ...entranceSpring,
          delay: isEnding ? 0 : 0.2,
          opacity: { duration: isEnding ? 0.3 : 0.6, delay: isEnding ? 0 : 0.3 },
        }}
      >
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
          Focus Challenge
        </span>
        <motion.span
          className="mt-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "14px",
            color: colors.textMuted,
            fontWeight: 400,
            fontStyle: "italic",
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: isEnding ? 0 : 1,
            x: isEnding ? -20 : 0,
          }}
          transition={{
            duration: isEnding ? 0.3 : 0.6,
            delay: isEnding ? 0 : 0.5,
            ease: "easeOut",
          }}
        >
          Deep Work Session
        </motion.span>
      </motion.div>

      {/* Shield activation banner — slides in from right */}
      <AnimatePresence>
        {blockedApps.length > 0 && (
          <motion.div
            className="absolute top-28 left-6 right-6 flex items-center justify-center gap-2 py-2.5"
            style={{
              backgroundColor: colors.shieldBg,
              borderRadius: "3px",
              border: `0.5px solid ${colors.shieldBorder}`,
            }}
            initial={{ opacity: 0, x: 60 }}
            animate={{
              opacity: shieldAnimated ? (isEnding ? 0 : 1) : 0,
              x: shieldAnimated ? (isEnding ? -40 : 0) : 60,
            }}
            transition={{
              duration: 0.8,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <ShieldCheck size={11} color={colors.shieldActive} strokeWidth={1.2} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                color: colors.shieldText,
                fontWeight: 400,
                letterSpacing: "0.1em",
              }}
            >
              {blockedApps.length} vortex app{blockedApps.length !== 1 ? "s" : ""} shielded
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "8px",
                color: colors.shieldActive,
                fontWeight: 300,
                letterSpacing: "0.05em",
                opacity: 0.7,
              }}
            >
              · tokens sent
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main timer area — scales in from the center, as if the ring is "expanding" */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: isEnding ? 0.85 : 1,
          opacity: isEnding ? 0 : 1,
        }}
        transition={{
          ...entranceSpring,
          delay: isEnding ? 0.05 : 0.1,
          opacity: { duration: isEnding ? 0.4 : 0.8 },
        }}
      >
        {/* Legendary glow */}
        {isLegendary && (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: radius * 2 + 24,
              height: radius * 2 + 24,
            }}
            animate={{
              boxShadow: [
                "0 0 30px rgba(201, 168, 76, 0.08)",
                "0 0 50px rgba(201, 168, 76, 0.18)",
                "0 0 30px rgba(201, 168, 76, 0.08)",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Breathing progress ring container */}
        <motion.svg
          width={radius * 2 + 24}
          height={radius * 2 + 24}
          className="absolute transform -rotate-90"
          animate={{
            scale: isRunning ? [1, 1.015, 1] : 1,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Background ring */}
          <motion.circle
            cx={radius + 12}
            cy={radius + 12}
            r={radius}
            fill="none"
            stroke={colors.ringBg}
            strokeWidth={stroke}
            animate={{
              opacity: isRunning ? [0.85, 1, 0.85] : 1,
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Progress ring — stroke width breathes during focus */}
          <motion.circle
            cx={radius + 12}
            cy={radius + 12}
            r={radius}
            fill="none"
            stroke={isLegendary ? colors.goldAccent : colors.ringStroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: offset,
              strokeWidth: isRunning
                ? [stroke, stroke + 0.4, stroke]
                : stroke,
              opacity: isRunning ? [0.85, 1, 0.85] : 1,
            }}
            transition={{
              strokeDashoffset: { duration: 0.5, ease: "linear" },
              strokeWidth: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </motion.svg>

        {/* Timer display — slides up into position */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{
            y: isEnding ? 20 : 0,
            opacity: isEnding ? 0 : 1,
          }}
          transition={{
            ...entranceSpring,
            delay: isEnding ? 0.08 : 0.25,
            opacity: { duration: isEnding ? 0.3 : 0.6, delay: isEnding ? 0.05 : 0.3 },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${minutes}:${seconds}`}
              initial={{ opacity: 0.7, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.5, y: -2 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "64px",
                color: colors.textPrimary,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {minutes.toString().padStart(2, "0")}
              <motion.span
                style={{ color: colors.textFaint }}
                animate={{
                  opacity: isRunning ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                :
              </motion.span>
              {seconds.toString().padStart(2, "0")}
            </motion.span>
          </AnimatePresence>

          <motion.span
            className="mt-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "9px",
              color: colors.textFaint,
              fontWeight: 300,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isEnding ? 0 : 1 }}
            transition={{ delay: isEnding ? 0 : 0.6, duration: 0.5 }}
          >
            {timeLeft === 0 ? "Complete" : `${completionPercent}% Complete`}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Mini Focus Ring — shows XP state during the session */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: entered && !isEnding ? 1 : 0,
          scale: isEnding ? 0.8 : 1,
          y: isEnding ? 20 : 0,
        }}
        transition={{
          duration: isEnding ? 0.3 : 0.8,
          delay: isEnding ? 0 : 0.8,
          ease: "easeOut",
        }}
        style={{ transform: "scale(0.55)", marginTop: "-20px" }}
      >
        <FocusRing
          xp={xp}
          maxXp={maxXp}
          streakDays={streakDays}
          isLegendary={isLegendary}
          earning={isPassiveEarning && xp < maxXp}
          mode="focus"
        />
      </motion.div>

      {/* Focus bonus notification */}
      <AnimatePresence>
        {showBonus && (
          <motion.div
            className="absolute flex items-center gap-2 px-4 py-2.5"
            style={{
              top: "42%",
              backgroundColor: isLegendary ? colors.bgAccent : "#eef0eb",
              borderRadius: "3px",
              border: `0.5px solid ${isLegendary ? colors.goldAccent + "40" : "#d4dbc9"}`,
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                color: isLegendary ? colors.goldAccent : "#6a7a5a",
                fontWeight: 400,
                letterSpacing: "0.1em",
              }}
            >
              +50 XP Focus Bonus
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing indicator — slides in from the left */}
      <motion.div
        className="mt-8 flex items-center gap-3"
        initial={{ opacity: 0, x: -30 }}
        animate={{
          opacity: isEnding ? 0 : 1,
          x: isEnding ? 30 : 0,
        }}
        transition={{
          duration: isEnding ? 0.3 : 0.6,
          delay: isEnding ? 0 : 0.9,
          ease: "easeOut",
        }}
      >
        <motion.div
          className="rounded-full"
          style={{
            width: 4,
            height: 4,
            backgroundColor: colors.textFaint,
          }}
          animate={{
            opacity: isRunning ? [0.3, 1, 0.3] : 0.3,
            scale: isRunning ? [1, 1.3, 1] : 1,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            color: colors.textFaint,
            fontWeight: 300,
            letterSpacing: "0.15em",
          }}
        >
          {timeLeft === 0 ? "Session complete" : "Stay present"}
        </span>
      </motion.div>

      {/* Shielded apps list at bottom — each chip slides in from right with stagger */}
      {blockedApps.length > 0 && (
        <motion.div
          className="absolute bottom-28 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: shieldAnimated && !isEnding ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="flex items-center gap-3 flex-wrap justify-center px-8">
            {blockedApps.slice(0, 5).map((app, index) => (
              <motion.span
                key={app.id}
                className="px-2.5 py-1"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "8px",
                  color: colors.shieldActive,
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                  backgroundColor: colors.shieldBg,
                  borderRadius: "2px",
                  border: `0.5px solid ${colors.shieldBorder}`,
                }}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{
                  opacity: shieldAnimated && !isEnding ? 1 : 0,
                  x: isEnding ? -20 : 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: isEnding ? 0 : 0.8 + index * 0.08,
                  ease: "easeOut",
                }}
              >
                {app.name}
              </motion.span>
            ))}
            {blockedApps.length > 5 && (
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "8px",
                  color: colors.textFaint,
                  fontWeight: 300,
                }}
              >
                +{blockedApps.length - 5} more
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* End Session button — slides up from below */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: isEnding ? 0 : 1,
          y: isEnding ? 30 : 0,
        }}
        transition={{
          ...entranceSpring,
          delay: isEnding ? 0 : 0.7,
          opacity: { duration: isEnding ? 0.3 : 0.6, delay: isEnding ? 0 : 0.8 },
        }}
      >
        <motion.button
          className="bg-transparent cursor-pointer px-8 py-3"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: colors.textMuted,
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            border: `0.5px solid ${colors.borderAccent}`,
            borderRadius: "2px",
          }}
          whileHover={{
            borderColor: colors.ringStroke,
            color: colors.textSecondary,
          }}
          whileTap={{ scale: 0.98, opacity: 0.6 }}
          onClick={handleEnd}
        >
          End Session
        </motion.button>
      </motion.div>
    </motion.div>
  );
}