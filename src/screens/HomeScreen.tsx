import { SUBJECTS, SUBJECT_COLORS } from "@/data/questions";
import { BookOpen, Calculator, FlaskConical, Languages, Globe, Cpu, Swords, Trophy, User, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { Screen } from "@/lib/types";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
}

const SUBJECT_ICONS: Record<string, any> = {
  "Toán": Calculator,
  "Ngữ văn": BookOpen,
  "KHTN": FlaskConical,
  "Tiếng Anh": Languages,
  "Lịch sử & Địa lí": Globe,
  "Công nghệ": Cpu,
};

export function HomeScreen({ onNavigate }: Props) {
  const cards = [
    { mode: "host", icon: Swords, title: "Tạo phòng đấu", desc: "Giáo viên host — chiếu lên bảng, học sinh tham gia bằng PIN", color: "from-violet-500 to-purple-600", screen: "host-setup" as Screen },
    { mode: "player", icon: User, title: "Tham gia chơi", desc: "Học sinh nhập mã PIN để vào phòng đấu trường", color: "from-sky-500 to-blue-600", screen: "player-join" as Screen },
    { mode: "solo", icon: Trophy, title: "Tự luyện tập", desc: "Ôn tập cá nhân từng môn, tự bấm giờ trả lời", color: "from-emerald-500 to-teal-600", screen: "solo-setup" as Screen },
    { mode: "review", icon: RotateCcw, title: "Xem lại đáp án", desc: "Ôn lại toàn bộ câu hỏi và giải thích chi tiết", color: "from-amber-500 to-orange-600", screen: "review-select" as Screen },
  ];

  return (
    <div className="min-h-screen animated-gradient flex flex-col items-center justify-center p-6 no-select">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float-slow">📚</div>
      <div className="absolute top-20 right-16 text-5xl opacity-20 animate-float">✏️</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-float">🎓</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float-slow">🧠</div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 z-10"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-5xl">🎯</span>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
            QuizK6
          </h1>
        </div>
        <p className="font-display text-xl md:text-2xl text-white/90 font-semibold">
          Đấu Trường Trắc Nghiệm — Ôn Thi Giữa Kỳ 1 Lớp 6
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {SUBJECTS.map((s) => {
            const Icon = SUBJECT_ICONS[s] ?? BookOpen;
            const c = SUBJECT_COLORS[s];
            return (
              <span key={s} className={`px-3 py-1 rounded-full text-sm font-bold text-white ${c.bg} shadow-md flex items-center gap-1`}>
                <Icon size={14} />
                {s}
              </span>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl w-full z-10">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.button
              key={c.mode}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(c.screen)}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${c.color} p-8 text-left shadow-xl`}
            >
              <div className="absolute -right-6 -top-6 opacity-20">
                <Icon size={120} strokeWidth={1.5} />
              </div>
              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-14 h-14 flex items-center justify-center mb-4">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-white/85 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/60 text-xs mt-8 z-10"
      >
        Chương trình GDPT mới — Biên soạn theo đề cương Giữa kỳ 1
      </motion.p>
    </div>
  );
}
