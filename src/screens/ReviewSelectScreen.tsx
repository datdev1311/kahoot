import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, BookOpen, FlaskConical, Languages, Globe, Cpu, ChevronRight } from "lucide-react";
import { SUBJECTS, SUBJECT_COLORS, getQuestionsBySubject } from "@/data/questions";
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

export function ReviewSelectScreen({ onNavigate }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 to-orange-700 flex flex-col items-center p-6 no-select">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 text-white/80 hover:text-white font-semibold">
            <ArrowLeft size={20} /> Trang chủ
          </button>
          <h1 className="font-display text-3xl text-white font-bold">Xem Lại Đáp Án</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Chọn môn học để ôn lại</h2>
          <p className="text-slate-500 text-sm mb-5">Xem toàn bộ câu hỏi, đáp án đúng và giải thích chi tiết</p>

          <div className="space-y-3">
            {SUBJECTS.map((s, i) => {
              const Icon = SUBJECT_ICONS[s] ?? BookOpen;
              const c = SUBJECT_COLORS[s];
              const qs = getQuestionsBySubject(s);
              const isExpanded = selected === s;
              return (
                <div key={s}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelected(isExpanded ? null : s)}
                    className={`w-full ${c.light} rounded-2xl p-4 flex items-center gap-4 text-left transition-all`}
                  >
                    <div className={`${c.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-display font-bold text-lg ${c.text}`}>{s}</p>
                      <p className="text-slate-500 text-sm">{qs.length} câu hỏi</p>
                    </div>
                    <ChevronRight size={22} className={`text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </motion.button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 space-y-2"
                    >
                      {qs.map((q, qi) => (
                        <div key={q.id} className="bg-slate-50 rounded-xl p-4">
                          <p className="font-bold text-slate-700 text-sm mb-1">Câu {qi + 1}: {q.question}</p>
                          <div className="space-y-1 mb-2">
                            {q.options.map((opt, oi) => (
                              <p key={oi} className={`text-sm pl-3 ${oi === q.correct_index ? "text-green-600 font-bold" : "text-slate-500"}`}>
                                {opt} {oi === q.correct_index && "✓"}
                              </p>
                            ))}
                          </div>
                          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                            <span className="font-bold">Giải thích: </span>{q.explanation}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
