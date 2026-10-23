import { motion } from "framer-motion";

interface Props {
  size?: number;
  duration?: number;
  label?: string;
}

export function CountdownCircle({ size = 120, duration = 20, label }: Props) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circumference }}
          transition={{ duration, ease: "linear" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {label && <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
}

interface TimerBarProps {
  duration: number;
  paused?: boolean;
}

export function TimerBar({ duration, paused = false }: TimerBarProps) {
  return (
    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full"
        initial={{ width: "100%" }}
        animate={{ width: paused ? "100%" : "0%" }}
        transition={{ duration, ease: "linear" }}
      />
    </div>
  );
}
