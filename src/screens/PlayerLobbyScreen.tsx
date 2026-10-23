import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Clock } from "lucide-react";
import { AVATARS, randomAvatar } from "@/lib/avatars";
import type { Screen } from "@/lib/types";
import { playSound } from "@/lib/sound";
import { QUESTIONS, shuffleQuestions, getQuestionsBySubject } from "@/data/questions";
import { ANSWER_COLORS } from "@/lib/types";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
  data: { pin: string; name: string; avatarId: string };
}

// Simulate the host starting the game
export function PlayerLobbyScreen({ onNavigate, data }: Props) {
  const [waitTime, setWaitTime] = useState(0);
  const [otherPlayers] = useState(() =>
    Array.from({ length: 4 }).map((_, i) => {
      const av = randomAvatar();
      const names = ["Gia Huy", "Bảo Trân", "Đức Phát", "Mai Linh"];
      return { id: `other_${i}`, name: names[i], avatarId: av.id };
    })
  );

  useEffect(() => {
    const t = setInterval(() => setWaitTime((s) => s + 1), 1000);
    // Auto-start after 8 seconds (simulate host starting)
    const start = setTimeout(() => {
      playSound("start");
      // Use "Đấu trường tổng hợp" for demo since we don't know what the host picked
      const questions = shuffleQuestions(getQuestionsBySubject("Toán")).slice(0, 10);
      onNavigate("player-answer", { ...data, questions, players: [data, ...otherPlayers] });
    }, 8000);
    return () => {
      clearInterval(t);
      clearTimeout(start);
    };
  }, []);

  const av = AVATARS.find((a) => a.id === data.avatarId)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-blue-700 flex flex-col items-center justify-center p-6 no-select">
      <button onClick={() => onNavigate("player-join")} className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white font-semibold">
        <ArrowLeft size={20} /> Thoát
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-6">
        <div className={`w-24 h-24 rounded-full ${av.color} flex items-center justify-center text-5xl mx-auto mb-3 shadow-xl`}>
          {av.emoji}
        </div>
        <h2 className="font-display text-2xl text-white font-bold">{data.name}</h2>
        <p className="text-white/70 text-sm">Phòng: {data.pin}</p>
      </motion.div>

      <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock size={20} className="text-white animate-pulse" />
          <p className="text-white font-bold">Đang chờ quản trò bắt đầu...</p>
        </div>

        {/* Other players in lobby */}
        <div className="space-y-2 mb-4">
          {otherPlayers.map((p, i) => {
            const pav = AVATARS.find((a) => a.id === p.avatarId)!;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center gap-2 bg-white/10 rounded-xl p-2"
              >
                <div className={`w-8 h-8 rounded-full ${pav.color} flex items-center justify-center text-lg`}>{pav.emoji}</div>
                <span className="text-white text-sm font-semibold">{p.name}</span>
                <span className="text-green-300 text-xs ml-auto">● Sẵn sàng</span>
              </motion.div>
            );
          })}
        </div>

        <p className="text-white/50 text-xs text-center">Trò chơi sẽ bắt đầu tự động...</p>
      </div>
    </div>
  );
}
