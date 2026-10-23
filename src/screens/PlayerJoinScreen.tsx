import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import { AVATARS } from "@/lib/avatars";
import type { Screen } from "@/lib/types";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
}

export function PlayerJoinScreen({ onNavigate }: Props) {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState<string>(AVATARS[0].id);
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (pin.length !== 6) {
      setError("Vui lòng nhập mã PIN 6 số");
      return;
    }
    if (!name.trim()) {
      setError("Vui lòng nhập tên hiển thị");
      return;
    }
    onNavigate("player-lobby", { pin, name: name.trim(), avatarId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-blue-700 flex flex-col items-center justify-center p-6 no-select">
      <div className="w-full max-w-md">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 text-white/80 hover:text-white font-semibold mb-4">
          <ArrowLeft size={20} /> Trang chủ
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h1 className="font-display text-3xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Users size={28} className="text-sky-500" /> Tham Gia Chơi
          </h1>
          <p className="text-slate-500 text-sm mb-6">Nhập mã PIN từ giáo viên để vào phòng</p>

          {/* PIN input */}
          <label className="block text-sm font-bold text-slate-700 mb-2">Mã PIN (6 số)</label>
          <input
            type="text"
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
            placeholder="VD: 123456"
            maxLength={6}
            className="w-full text-center font-display text-3xl font-extrabold tracking-[0.3em] text-sky-600 border-2 border-slate-200 rounded-2xl py-3 mb-4 focus:border-sky-500 focus:outline-none transition-colors"
          />

          {/* Name input */}
          <label className="block text-sm font-bold text-slate-700 mb-2">Tên hiển thị</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value.slice(0, 20)); setError(""); }}
            placeholder="VD: Minh Anh"
            maxLength={20}
            className="w-full font-bold text-slate-700 border-2 border-slate-200 rounded-2xl py-3 px-4 mb-4 focus:border-sky-500 focus:outline-none transition-colors"
          />

          {/* Avatar picker */}
          <label className="block text-sm font-bold text-slate-700 mb-2">Chọn avatar</label>
          <div className="grid grid-cols-6 gap-2 mb-6">
            {AVATARS.map((av) => (
              <motion.button
                key={av.id}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAvatarId(av.id)}
                className={`w-full aspect-square rounded-xl ${av.color} flex items-center justify-center text-xl transition-all ${
                  avatarId === av.id ? "ring-4 ring-sky-500 scale-110" : "opacity-60 hover:opacity-100"
                }`}
              >
                {av.emoji}
              </motion.button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm font-bold mb-3 text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-display font-bold text-xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
          >
            Vào phòng <ArrowRight size={22} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
