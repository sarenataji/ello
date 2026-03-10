import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { FocusRing } from "./focus-ring";
import { useVortex } from "./vortex-context";
import { useXp } from "./xp-context";
import { useTheme } from "./theme-context";
import { ShieldCheck, ShieldOff, Settings } from "lucide-react";

const essentialApps = ["Phone", "Messages", "Maps", "Notes", "Camera"];

export function HomeScreen() {
  const navigate = useNavigate();
  const { blockedApps, isFocusActive } = useVortex();
  const { xp, maxXp, streakDays, isLegendary, isPassiveEarning, isAppUnlocked } = useXp();
  const { colors } = useTheme();
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Spatial transition: animate elements out, then navigate
  const handleNavigate = useCallback((target: string) => {
    setIsLeaving(true);
    setLeaveTarget(target);
    // Wait for exit animations to play, then navigate
    setTimeout(() => navigate(target), 500);
  }, [navigate]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-between px-8 py-12 select-none relative overflow-hidden"
      style={{ backgroundColor: colors.bg, transition: "background-color 0.8s ease" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Legendary badge — top left */}
      {isLegendary && (
        <motion.div
          className="absolute top-14 left-6 flex items-center gap-1.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: isLeaving ? 0 : 1,
            x: isLeaving ? -30 : 0,
          }}
          transition={{ delay: isLeaving ? 0 : 0.8, duration: 0.6 }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "8px",
              color: colors.goldAccent,
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            ✦ Legendary
          </span>
        </motion.div>
      )}

      {/* Gatekeeper button — top right */}
      <motion.button
        className="absolute top-14 right-6 bg-transparent border-none cursor-pointer p-2 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLeaving ? 0 : 1,
          x: isLeaving ? 20 : 0,
        }}
        transition={{ delay: isLeaving ? 0 : 1, duration: isLeaving ? 0.3 : 0.6 }}
        whileTap={{ scale: 0.9, opacity: 0.5 }}
        onClick={() => handleNavigate("/gatekeeper")}
      >
        {isFocusActive ? (
          <ShieldCheck size={14} color={colors.shieldActive} strokeWidth={1} />
        ) : (
          <Settings size={14} color={colors.textFaint} strokeWidth={1} />
        )}
      </motion.button>

      {/* Time & Date — slides up and fades when leaving for focus */}
      <motion.div
        className="flex flex-col items-center pt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isLeaving ? 0 : 1,
          y: isLeaving ? -40 : 0,
          scale: isLeaving ? 0.95 : 1,
        }}
        transition={{
          duration: isLeaving ? 0.4 : 0.8,
          ease: "easeOut",
          delay: isLeaving ? 0.05 : 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "42px",
            color: colors.textPrimary,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            transition: "color 0.8s ease",
          }}
        >
          {displayHours}:{minutes}{" "}
          <span
            style={{
              fontSize: "16px",
              color: colors.textMuted,
              transition: "color 0.8s ease",
            }}
          >
            {period}
          </span>
        </span>
        <span
          className="mt-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: colors.textFaint,
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            transition: "color 0.8s ease",
          }}
        >
          {dayNames[now.getDay()]}, {monthNames[now.getMonth()]} {now.getDate()}
        </span>
      </motion.div>

      {/* Focus Ring — scales up and stays when entering focus, fades otherwise */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isLeaving && leaveTarget === "/focus" ? 0 : 1,
          scale: isLeaving && leaveTarget === "/focus" ? 1.15 : 1,
          y: isLeaving && leaveTarget === "/focus" ? -20 : 0,
        }}
        transition={{
          duration: isLeaving ? 0.5 : 1,
          delay: isLeaving ? 0.1 : 0.3,
          ease: "easeOut",
        }}
      >
        <FocusRing
          xp={xp}
          maxXp={maxXp}
          showStreak
          streakDays={streakDays}
          isLegendary={isLegendary}
          earning={isPassiveEarning && xp < maxXp}
          mode={isFocusActive ? "focus" : "idle"}
        />
      </motion.div>

      {/* Essential Apps — each app name slides out with staggered delay */}
      <motion.div
        className="flex flex-col items-center gap-7 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLeaving ? 0 : 1 }}
        transition={{ duration: isLeaving ? 0.3 : 0.8, delay: isLeaving ? 0 : 0.5 }}
      >
        {essentialApps.map((app, index) => (
          <motion.button
            key={app}
            className="bg-transparent border-none cursor-pointer px-6 py-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px",
              color: colors.textSecondary,
              fontWeight: 400,
              letterSpacing: "0.04em",
              transition: "color 0.8s ease",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: isLeaving ? 0 : 1,
              y: isLeaving ? 20 : 0,
              x: isLeaving && leaveTarget === "/focus" ? -60 - index * 15 : 0,
              filter: isLeaving ? "blur(4px)" : "blur(0px)",
            }}
            transition={{
              duration: isLeaving ? 0.35 : 0.5,
              delay: isLeaving ? index * 0.04 : 0.6 + index * 0.08,
              ease: isLeaving ? [0.4, 0, 1, 1] : "easeOut",
            }}
            whileTap={{ scale: 0.97, opacity: 0.6 }}
            onClick={() => {}}
          >
            {app}
          </motion.button>
        ))}

        {/* Thin separator */}
        <motion.div
          className="w-8 my-1"
          style={{
            height: "0.5px",
            backgroundColor: colors.borderDefault,
            transition: "background-color 0.8s ease",
          }}
          animate={{
            opacity: isLeaving ? 0 : 1,
            scaleX: isLeaving ? 0 : 1,
          }}
          transition={{ duration: isLeaving ? 0.25 : 0.5, delay: isLeaving ? 0.15 : 0.8 }}
        />

        {/* Shield status indicator */}
        {blockedApps.length > 0 && (
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isLeaving ? 0 : 1,
              y: isLeaving ? 15 : 0,
            }}
            transition={{
              delay: isLeaving ? 0.1 : 0.9,
              duration: isLeaving ? 0.25 : 0.5,
            }}
          >
            <div className="flex items-center gap-2">
              {isFocusActive ? (
                <ShieldCheck size={10} color={colors.shieldActive} strokeWidth={1.2} />
              ) : (
                <ShieldOff size={10} color={colors.textFaint} strokeWidth={1.2} />
              )}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "9px",
                  color: isFocusActive ? colors.shieldActive : colors.textFaint,
                  fontWeight: 300,
                  letterSpacing: "0.15em",
                }}
              >
                {blockedApps.length} app{blockedApps.length !== 1 ? "s" : ""}{" "}
                {isFocusActive ? "shielded" : "ready to shield"}
              </span>
            </div>

            {/* Blocked app names — tapping triggers Shield interception when focus is active */}
            {isFocusActive && (
              <div className="flex items-center gap-3 flex-wrap justify-center mt-1">
                {blockedApps.map((app) => {
                  const unlocked = isAppUnlocked(app.id);
                  return (
                    <motion.button
                      key={app.id}
                      className="bg-transparent border-none cursor-pointer px-2 py-0.5"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "9px",
                        color: unlocked
                          ? (isLegendary ? colors.goldAccent : "#baa840")
                          : colors.textFaint,
                        fontWeight: 300,
                        letterSpacing: "0.08em",
                        opacity: unlocked ? 0.7 : 1,
                      }}
                      whileTap={{ scale: 0.95, opacity: 0.5 }}
                      onClick={() => {
                        if (!unlocked) {
                          navigate(`/shield?app=${app.id}&name=${encodeURIComponent(app.name)}`);
                        }
                      }}
                    >
                      {app.name}
                      {unlocked && (
                        <span style={{ fontSize: "7px", marginLeft: 3, opacity: 0.6 }}>
                          (open)
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Focus Challenge Entry — last to exit, with emphasis */}
        <motion.button
          className="bg-transparent border-none cursor-pointer px-6 py-1"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            color: isLegendary ? colors.goldAccent : colors.textFaint,
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            transition: "color 0.8s ease",
          }}
          animate={{
            opacity: isLeaving && leaveTarget === "/focus" ? 0 : 1,
            y: isLeaving && leaveTarget === "/focus" ? -10 : 0,
            scale: isLeaving && leaveTarget === "/focus" ? 1.1 : 1,
          }}
          transition={{
            duration: isLeaving ? 0.3 : 0.5,
            delay: isLeaving ? 0.2 : 0.9,
          }}
          whileTap={{ scale: 0.97, opacity: 0.5 }}
          onClick={() => handleNavigate("/focus")}
        >
          Begin Focus
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
