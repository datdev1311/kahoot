import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock, Trophy, Flame, ArrowLeft } from "lucide-react";
import { AVATARS } from "@/lib/avatars";
import type { Screen } from "@/lib/types";
import { ANSWER_COLORS } from "@/lib/types";
import { playSound } from "@/lib/sound";
import { burstConfetti } from "@/lib/confetti";
import type { Question } from "@/data/questions";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
  data: { pin: string; name: string; avatarId: string; questions: Question[]; players: any[] };
}

export function PlayerAnswerScreen({ onNavigate, data }: Props) {
  const { questions, name, avatarId } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "question" | "result">("intro");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [rank, setRank] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    setPhase("intro");
    setSelectedIndex(null);
    phaseTimerRef.current = setTimeout(() => {
      setPhase("question");
      setTimeLeft(currentQ.time_limit);
      startTimeRef.current = Date.now();
    }, 3000);
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, currentQ]);

  useEffect(() => {
    if (phase !== "question") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 5) playSound("tick");
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex]);

  const handleTimeout = useCallback(() => {
    setSelectedIndex(-1);
    setPhase("result");
    setStreak(0);
    playSound("wrong");
  }, []);

  const handleAnswer = (index: number) => {
    if (phase !== "question" || selectedIndex !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const timeUsed = (Date.now() - startTimeRef.current) / 1000;
    const correct = index === currentQ.correct_index;
    setSelectedIndex(index);
    setPhase("result");
    playSound(correct ? "correct" : "wrong");

    if (correct) {
      const timeRatio = 1 - timeUsed / currentQ.time_limit;
      const points = Math.round(500 + 500 * timeRatio) + (streak >= 2 ? 100 : 0);
      setScore((s) => s + points);
      setStreak((s) => s + 1);
      setCorrectCount((c) => c + 1);
      burstConfetti();
    } else {
      setStreak(0);
    }
    // Simulated rank change
    setRank(Math.max(1, Math.floor(Math.random() * 3) + 1));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onNavigate("home");
    }
  };

  const av = AVATARS.find((a) => a.id === avatarId)!;

  // INTRO phase
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-900 flex flex-col items-center justify-center p-6 no-select">
        <p className="text-white/60 font-bold uppercase tracking-widest mb-2">Câu {currentIndex + 1} / {questions.length}</p>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="bg-white/10 rounded-full w-32 h-32 flex items-center justify-center mb-4 pulse-ring">
          <span className="font-display text-7xl font-extrabold text-white">?</span>
        </motion.div>
        <p className="font-display text-2xl text-white font-bold">Chuẩn bị trả lời...</p>
        <p className="text-white/60 mt-2">{currentQ.topic}</p>
      </div>
    );
  }

  // RESULT phase
  if (phase === "result") {
    const correct = selectedIndex === currentQ.correct_index;
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 no-select ${
        correct ? "bg-gradient-to-br from-green-500 to-emerald-700" : "bg-gradient-to-br from-rose-500 to-red-700"
      }`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center mb-6">
          {correct ? (
            <>
              <div className="text-7xl mb-3">🎉</div>
              <h1 className="font-display text-4xl text-white font-extrabold">Chính xác!</h1>
            </>
          ) : (
            <>
              <div className="text-7xl mb-3">{selectedIndex === -1 ? "⏰" : "😢"}</div>
              <h1 className="font-display text-4xl text-white font-extrabold">
                {selectedIndex === -1 ? "Hết giờ!" : "Chưa đúng!"}
              </h1>
            </>
          )}
        </motion.div>

        {/* Score + streak */}
        <div className="flex gap-3 mb-6">
          {correct && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <p className="text-white/70 text-xs font-bold uppercase">Điểm</p>
              <p className="font-display text-3xl text-white font-extrabold">+{Math.round(500 + 500 * (1 - (Date.now() - startTimeRef.current) / 1000 / currentQ.time_limit))}</p>
            </motion.div>
          )}
          {streak >= 2 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="bg-orange-500/80 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <p className="text-white/70 text-xs font-bold uppercase flex items-center gap-1"><Flame size={12} /> Chuỗi</p>
              <p className="font-display text-3xl text-white font-extrabold">{streak}</p>
            </motion.div>
          )}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
            <p className="text-white/70 text-xs font-bold uppercase">Hạng</p>
            <p className="font-display text-3xl text-white font-extrabold">#{rank}</p>
          </motion.div>
        </div>

        {/* Correct answer + explanation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-5 w-full max-w-md shadow-xl mb-4">
          <p className="font-bold text-slate-700 mb-1">Đáp án đúng:</p>
          <p className="font-display text-lg font-bold text-green-600 mb-2">{currentQ.options[currentQ.correct_index]}</p>
          <p className="text-slate-500 text-sm">{currentQ.explanation}</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="bg-white text-slate-700 font-display font-bold text-lg px-8 py-3 rounded-2xl shadow-xl"
        >
          {currentIndex < questions.length - 1 ? "Câu tiếp theo →" : "Xem kết quả →"}
        </motion.button>
      </div>
    );
  }

  // QUESTION phase
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-900 flex flex-col p-4 no-select">
      {/* Header */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full mb-3">
        <div className="bg-white/15 rounded-full px-3 py-1 flex items-center gap-1">
          <span className="text-white text-sm font-bold">Câu {currentIndex + 1}/{questions.length}</span>
        </div>
        <div className={`flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 ${timeLeft <= 5 ? "bg-red-500/80" : ""}`}>
          <Clock size={16} className="text-white" />
          <span className="text-white font-bold text-lg tabular-nums">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1">
          <Trophy size={16} className="text-yellow-300" />
          <span className="text-white text-sm font-bold">{score}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="max-w-lg mx-auto w-full mb-4">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-green-400 to-red-500" animate={{ width: `${(timeLeft / currentQ.time_limit) * 100}%` }} transition={{ duration: 1, ease: "linear" }} />
        </div>
      </div>

      {/* Player avatar + name */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-full ${av.color} flex items-center justify-center text-lg`}>{av.emoji}</div>
        <span className="text-white font-bold text-sm">{name}</span>
        {streak >= 2 && <span className="bg-orange-500/80 rounded-full px-2 py-0.5 text-white text-xs font-bold flex items-center gap-1"><Flame size={10} /> {streak}</span>}
      </div>

      {/* Question */}
      <div className="max-w-lg mx-auto w-full mb-4">
        <motion.div key={currentIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl p-5 text-center">
          <p className="font-display text-lg md:text-xl font-bold text-slate-800 leading-relaxed">{currentQ.question}</p>
        </motion.div>
      </div>

      {/* Answer buttons - big and colorful */}
      <div className="max-w-lg mx-auto w-full grid grid-cols-2 gap-3 flex-1 content-start">
        {currentQ.options.map((opt, i) => {
          const color = ANSWER_COLORS[i];
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(i)}
              disabled={selectedIndex !== null}
              className={`${color.bg} ${color.hover} rounded-2xl p-4 md:p-6 shadow-xl flex flex-col items-center justify-center min-h-[100px] md:min-h-[130px] text-white transition-all`}
            >
              <span className="text-3xl md:text-4xl mb-2">{color.shape}</span>
              <span className="font-bold text-xs md:text-sm text-center leading-tight">{opt}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
