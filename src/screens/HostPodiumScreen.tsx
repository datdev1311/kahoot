import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, RotateCcw, Trophy } from "lucide-react";
import type { Screen, Player } from "@/lib/types";
import { AVATARS } from "@/lib/avatars";
import { podiumConfetti } from "@/lib/confetti";
import { playSound } from "@/lib/sound";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
  data: { players: Player[]; questions: any[] };
}

export function HostPodiumScreen({ onNavigate, data }: Props) {
  const { players } = data;
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3, 8);

  useEffect(() => {
    playSound("finish");
    podiumConfetti();
  }, []);

  const podiumOrder = [1, 0, 2]; // visual order: 2nd, 1st, 3rd
  const heights = ["h-32", "h-48", "h-24"];
  const podiumColors = ["bg-slate-300", "bg-gradient-to-t from-yellow-500 to-yellow-400", "bg-orange-400"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 flex flex-col items-center p-4 md:p-6 no-select overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl md:text-5xl text-white font-extrabold mb-2 text-center flex items-center gap-3"
      >
        <Trophy size={40} className="text-yellow-300" /> Tổng Kết Đấu Trường
      </motion.h1>
      <p className="text-white/70 mb-8">Xin chúc mừng các nhà vô địch!</p>

      {/* Podium */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-2 md:gap-4 mb-8">
          {podiumOrder.map((rankIdx, visualPos) => {
            const p = top3[rankIdx];
            if (!p) return <div key={visualPos} className={heights[visualPos]} />;
            const av = AVATARS.find((a) => a.id === p.avatarId)!;
            const isFirst = rankIdx === 0;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: visualPos * 0.3, type: "spring", stiffness: 100 }}
                className="flex flex-col items-center"
              >
                {/* Avatar + medal */}
                <div className={`relative mb-2 ${isFirst ? "-mt-8" : ""}`}>
                  {isFirst && <div className="text-4xl absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">👑</div>}
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${av.color} flex items-center justify-center text-3xl md:text-4xl shadow-xl border-4 ${isFirst ? "border-yellow-300" : "border-white"}`}>
                    {av.emoji}
                  </div>
                </div>
                <span className="text-white font-bold text-sm md:text-lg mb-1">{p.name}</span>
                <span className="text-yellow-300 font-display font-extrabold text-lg md:text-2xl mb-2">{p.score}</span>
                {/* Podium block */}
                <div className={`${podiumColors[visualPos]} ${heights[visualPos]} w-20 md:w-28 rounded-t-2xl flex items-start justify-center pt-3 shadow-lg`}>
                  <span className={`font-display font-extrabold text-2xl ${isFirst ? "text-white" : "text-slate-700"}`}>
                    {rankIdx + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Rest of rankings */}
      {rest.length > 0 && (
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 w-full max-w-md mb-6">
          <div className="space-y-2">
            {rest.map((p, i) => {
              const av = AVATARS.find((a) => a.id === p.avatarId)!;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="flex items-center gap-3 bg-white/10 rounded-xl p-2"
                >
                  <span className="text-white font-bold w-6 text-center">{i + 4}</span>
                  <div className={`w-8 h-8 rounded-full ${av.color} flex items-center justify-center text-lg`}>{av.emoji}</div>
                  <span className="text-white font-semibold flex-1 text-sm">{p.name}</span>
                  <span className="text-yellow-300 font-bold">{p.score}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("host-setup")}
          className="flex-1 bg-white/20 backdrop-blur-sm text-white font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} /> Chơi lại
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("home")}
          className="flex-1 bg-white text-slate-700 font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
        >
          <Home size={20} /> Trang chủ
        </motion.button>
      </div>
    </div>
  );
}
