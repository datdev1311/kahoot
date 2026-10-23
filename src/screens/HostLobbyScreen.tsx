import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Play, Copy, Check, LogOut } from "lucide-react";
import type { Screen, Player } from "@/lib/types";
import { AVATARS } from "@/lib/avatars";
import { playSound } from "@/lib/sound";
import type { Question } from "@/data/questions";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
  data: { pin: string; subject: string; questions: Question[] };
}

function generateNPC(name: string): Player {
  const av = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  return {
    id: `npc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    avatarId: av.id,
    score: 0,
    streak: 0,
    lastCorrect: false,
    lastAnswerIndex: null,
    lastAnswerTime: null,
    ready: false,
  };
}

const NPC_NAMES = ["Minh Anh", "Quốc Bảo", "Thu Hà", "Gia Huy", "Bảo Trân", "Đức Phát", "Mai Linh", "Trí Minh", "Như Quỳnh", "Hoàng Nam", "Phương Anh", "Khánh Vy"];

export function HostLobbyScreen({ onNavigate, data }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [copied, setCopied] = useState(false);
  const [autoAdded, setAutoAdded] = useState<string[]>([]);

  // Simulate players joining
  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];
    let delay = 1500;

    const scheduleJoin = (name: string) => {
      const t = setTimeout(() => {
        setPlayers((prev) => {
          const newPlayer = generateNPC(name);
          playSound("join");
          return [...prev, newPlayer];
        });
      }, delay);
      delay += 2000 + Math.random() * 3000;
      return t as unknown as ReturnType<typeof setInterval>;
    };

    // Add 3-5 NPC players progressively
    const names = [...NPC_NAMES].sort(() => Math.random() - 0.5).slice(0, 5);
    names.forEach((n) => {
      const id = scheduleJoin(n);
      intervals.push(id);
    });

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(intervals[0]);
    };
  }, []);

  const handleAddPlayer = () => {
    const remaining = NPC_NAMES.filter((n) => !autoAdded.includes(n));
    if (remaining.length === 0) return;
    const name = remaining[Math.floor(Math.random() * remaining.length)];
    setAutoAdded((prev) => [...prev, name]);
    setPlayers((prev) => [...prev, generateNPC(name)]);
    playSound("join");
  };

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(data.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    if (players.length === 0) {
      // Add at least 1 NPC if no players
      const p = generateNPC(NPC_NAMES[0]);
      setPlayers([p]);
      onNavigate("host-question", { ...data, players: [p] });
    } else {
      playSound("start");
      onNavigate("host-question", { ...data, players });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-purple-800 flex flex-col items-center p-4 md:p-6 no-select">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate("host-setup")} className="flex items-center gap-2 text-white/80 hover:text-white font-semibold">
            <ArrowLeft size={20} /> Quay lại
          </button>
          <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            <Users size={18} className="text-white" />
            <span className="text-white font-bold">{players.length} người tham gia</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* PIN + QR */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center">
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">Mã PIN phòng</p>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-5xl font-extrabold text-violet-600 tracking-widest">{data.pin}</span>
              <button onClick={handleCopyPin} className="p-2 rounded-xl bg-violet-100 text-violet-600 hover:bg-violet-200 transition-colors">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>

            {/* Fake QR code */}
            <div className="bg-slate-900 p-4 rounded-2xl mb-3">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 49 }).map((_, i) => {
                  const corner = (i < 3 || i % 7 < 3 || i % 7 > 4) && (Math.floor(i / 7) < 3 || Math.floor(i / 7) > 4);
                  const center = i === 24;
                  const random = (data.pin.charCodeAt(i % 6) + i) % 2 === 0;
                  return <div key={i} className={`w-5 h-5 rounded-sm ${corner || center || random ? "bg-white" : "bg-slate-900"}`} />;
                })}
              </div>
            </div>
            <p className="text-slate-400 text-xs text-center">Học sinh quét mã hoặc nhập PIN tại màn hình "Tham gia chơi"</p>
            <p className="text-violet-500 text-xs font-bold mt-1">Môn: {data.subject}</p>
          </motion.div>

          {/* Players list */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col">
            <h3 className="font-display text-xl font-bold text-slate-800 mb-3">Người tham gia</h3>
            <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px] space-y-2 mb-3">
              <AnimatePresence>
                {players.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-400 py-12">
                    <Users size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Đang chờ người chơi tham gia...</p>
                  </motion.div>
                )}
                {players.map((p) => {
                  const av = AVATARS.find((a) => a.id === p.avatarId)!;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: 50, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3"
                    >
                      <div className={`w-10 h-10 rounded-full ${av.color} flex items-center justify-center text-xl`}>{av.emoji}</div>
                      <span className="font-bold text-slate-700 flex-1">{p.name}</span>
                      <span className="text-green-500 text-sm font-bold">● Sẵn sàng</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <button onClick={handleAddPlayer} className="text-violet-600 text-sm font-bold hover:bg-violet-50 rounded-xl py-2 transition-colors mb-3">
              + Thêm người chơi mô phỏng
            </button>
          </motion.div>
        </div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={players.length === 0}
          className="w-full mt-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-display font-bold text-2xl py-5 rounded-3xl shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={28} fill="white" /> Bắt đầu chơi ({players.length} người)
        </motion.button>

        <button onClick={() => onNavigate("home")} className="w-full mt-2 text-white/60 hover:text-white text-sm font-semibold flex items-center justify-center gap-1 py-2">
          <LogOut size={16} /> Hủy phòng
        </button>
      </div>
    </div>
  );
}
