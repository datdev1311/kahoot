import { SUBJECTS, SUBJECT_COLORS, getQuestionsBySubject } from "@/data/questions";
import { Calculator, BookOpen, FlaskConical, Languages, Globe, Cpu, Swords, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
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

const ALL_SUBJECTS = [...SUBJECTS, "Đấu trường tổng hợp"] as const;

export function SoloSetupScreen({ onNavigate }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [count, setCount] = useState(10);

  const questionCount = selected ? getQuestionsBySubject(selected).length : 0;
  const effectiveCount = Math.min(count, questionCount || count);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-700 flex flex-col items-center p-6 no-select">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-white/80 hover:text-white font-semibold"
          >
            <ArrowLeft size={20} /> Trang chủ
          </button>
          <h1 className="font-display text-3xl text-white font-bold">Tự Luyện Tập</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
        >
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Chọn môn học</h2>
          <p className="text-slate-500 text-sm mb-5">Chọn môn bạn muốn ôn tập hôm nay</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {ALL_SUBJECTS.map((s) => {
              const Icon = s === "Đấu trường tổng hợp" ? Swords : (SUBJECT_ICONS[s] ?? BookOpen);
              const c = SUBJECT_COLORS[s] ?? { bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-600" };
              const isSelected = selected === s;
              return (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelected(s)}
                  className={`relative rounded-2xl p-4 text-center transition-all border-3 ${
                    isSelected ? `${c.bg} text-white border-transparent shadow-lg scale-105` : `${c.light} ${c.text} border-transparent hover:shadow-md`
                  }`}
                >
                  <Icon size={28} className="mx-auto mb-2" />
                  <p className="font-display font-bold text-sm">{s}</p>
                  {s !== "Đấu trường tổng hợp" && (
                    <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "opacity-60"}`}>
                      {getQuestionsBySubject(s).length} câu
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>

          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-slate-100 pt-5"
            >
              <h3 className="font-display text-lg font-bold text-slate-800 mb-3">Số câu hỏi</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {[5, 10, 15, 20, 30].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                      count === n
                        ? "bg-emerald-500 text-white shadow-md scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {n} câu
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate("solo-quiz", { subject: selected, count: effectiveCount })}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display font-bold text-xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
              >
                Bắt đầu ôn tập <ArrowRight size={22} />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
