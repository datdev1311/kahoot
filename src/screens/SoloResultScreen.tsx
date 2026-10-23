import { motion } from "framer-motion";
import { Trophy, Home, RotateCcw, Check, X, Clock } from "lucide-react";
import type { Question } from "@/data/questions";
import type { SoloResult, Screen } from "@/lib/types";
import { podiumConfetti } from "@/lib/confetti";
import { useEffect } from "react";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
  data: { questions: Question[]; results: SoloResult[] };
}

export function SoloResultScreen({ onNavigate, data }: Props) {
  const { questions, results } = data;
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const percent = Math.round((correct / total) * 100);
  const avgTime = (results.reduce((s, r) => s + r.timeUsed, 0) / total).toFixed(1);

  useEffect(() => {
    if (percent >= 50) podiumConfetti();
  }, [percent]);

  const grade = percent >= 90 ? { label: "Xuất sắc!", color: "from-yellow-400 to-orange-500", emoji: "🏆" }
    : percent >= 75 ? { label: "Giỏi!", color: "from-emerald-400 to-teal-500", emoji: "🌟" }
    : percent >= 50 ? { label: "Khá!", color: "from-sky-400 to-blue-500", emoji: "👍" }
    : { label: "Cần cố gắng!", color: "from-rose-400 to-red-500", emoji: "💪" };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${grade.color} flex flex-col items-center p-6 no-select`}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-7xl mb-2"
      >
        {grade.emoji}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl text-white font-extrabold mb-1"
      >
        {grade.label}
      </motion.h1>
      <p className="text-white/80 mb-6">Hoàn thành bài luyện tập</p>

      {/* Score circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="bg-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-2xl mb-6"
      >
        <span className="font-display text-5xl font-extrabold text-slate-800">{correct}/{total}</span>
        <span className="text-slate-500 font-bold">{percent}%</span>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
          <Check className="mx-auto text-white mb-1" size={20} />
          <p className="text-white font-bold text-lg">{correct}</p>
          <p className="text-white/70 text-xs">Đúng</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
          <X className="mx-auto text-white mb-1" size={20} />
          <p className="text-white font-bold text-lg">{total - correct}</p>
          <p className="text-white/70 text-xs">Sai</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
          <Clock className="mx-auto text-white mb-1" size={20} />
          <p className="text-white font-bold text-lg">{avgTime}s</p>
          <p className="text-white/70 text-xs">TB/câu</p>
        </div>
      </div>

      {/* Detail review */}
      <div className="bg-white rounded-3xl shadow-2xl p-5 w-full max-w-2xl mb-6 max-h-[40vh] overflow-y-auto">
        <h3 className="font-display text-lg font-bold text-slate-800 mb-3">Chi tiết đáp án</h3>
        <div className="space-y-2">
          {results.map((r, i) => {
            const q = questions.find((qq) => qq.id === r.questionId)!;
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${r.correct ? "bg-green-50" : "bg-red-50"}`}>
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${r.correct ? "bg-green-500" : "bg-red-500"}`}>
                  {r.correct ? <Check size={16} /> : <X size={16} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">Câu {i + 1}: {q.question}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Đáp án đúng: {q.options[q.correct_index]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("solo-setup")}
          className="flex-1 bg-white/20 backdrop-blur-sm text-white font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} /> Luyện lại
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate("home")}
          className="flex-1 bg-white text-slate-700 font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
        >
          <Home size={20} /> Về trang chủ
        </motion.button>
      </div>
    </div>
  );
}
