import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, BarChart3, Trophy } from "lucide-react";
import type { Screen, Player } from "@/lib/types";
import type { Question } from "@/data/questions";
import { ANSWER_COLORS } from "@/lib/types";
import { playSound } from "@/lib/sound";
import { TimerBar } from "@/components/Timer";
import { AVATARS } from "@/lib/avatars";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
  data: { pin: string; subject: string; questions: Question[]; players: Player[] };
}

export function HostQuestionScreen({ onNavigate, data }: Props) {
  const { questions, players: initialPlayers } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "question" | "results">("intro");
  const [timeLeft, setTimeLeft] = useState(0);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQ = questions[currentIndex];

  // Phase: intro -> question -> results -> next
  useEffect(() => {
    setPhase("intro");
    playSound("countdown");

    phaseTimerRef.current = setTimeout(() => {
      setPhase("question");
      setTimeLeft(currentQ.time_limit);
    }, 3000);

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, currentQ]);

  // Question timer + simulate NPC answers
  useEffect(() => {
    if (phase !== "question") return;

    const npcPlayers = players.filter((p) => p.id.startsWith("npc_"));
    const npcTimers: ReturnType<typeof setTimeout>[] = [];
    npcPlayers.forEach((p) => {
      if (p.lastAnswerIndex !== null) return;
      const delay = 2000 + Math.random() * (currentQ.time_limit - 3) * 1000;
      const accuracy = 0.5 + Math.random() * 0.3;
      const correct = Math.random() < accuracy;
      const answerIndex = correct ? currentQ.correct_index : Math.floor(Math.random() * 4);
      const t = setTimeout(() => {
        setPlayers((prev) => prev.map((pl) => {
          if (pl.id !== p.id) return pl;
          const timeRatio = 1 - delay / (currentQ.time_limit * 1000);
          const points = correct ? Math.round(500 + 500 * timeRatio) + (pl.streak >= 2 ? 100 : 0) : 0;
          return {
            ...pl,
            lastAnswerIndex: answerIndex,
            lastCorrect: correct,
            lastAnswerTime: delay / 1000,
            score: pl.score + points,
            streak: correct ? pl.streak + 1 : 0,
          };
        }));
        playSound("select");
      }, delay);
      npcTimers.push(t);
    });

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("results");
          return 0;
        }
        if (prev <= 5) playSound("tick");
        return prev - 1;
      });
    }, 1000);

    return () => {
      npcTimers.forEach(clearTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ, currentIndex]);

  // Show results then leaderboard
  useEffect(() => {
    if (phase !== "results") return;
    playSound("finish");
    phaseTimerRef.current = setTimeout(() => {
      setShowLeaderboard(true);
    }, 5000);

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [phase]);

  const handleNext = useCallback(() => {
    setShowLeaderboard(false);
    if (currentIndex < questions.length - 1) {
      // Reset player answer states
      setPlayers((prev) => prev.map((p) => ({
        ...p,
        lastAnswerIndex: null,
        lastCorrect: false,
        lastAnswerTime: null,
      })));
      setCurrentIndex((i) => i + 1);
    } else {
      // Go to podium
      onNavigate("host-podium", { players, questions });
    }
  }, [currentIndex, questions.length, players, onNavigate]);

  // Calculate answer distribution
  const answerCounts = [0, 0, 0, 0];
  players.forEach((p) => {
    if (p.lastAnswerIndex !== null && p.lastAnswerIndex >= 0) {
      answerCounts[p.lastAnswerIndex]++;
    }
  });
  const totalAnswered = answerCounts.reduce((s, c) => s + c, 0);

  // Intro screen
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-900 flex flex-col items-center justify-center p-6 no-select">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-white/60 font-bold uppercase tracking-widest mb-2">Câu {currentIndex + 1} / {questions.length}</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white/10 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center mb-6 mx-auto pulse-ring"
          >
            <span className="font-display text-7xl font-extrabold text-white">{Math.max(0, 3 - Math.floor((Date.now() % 3000) / 1000))}</span>
          </motion.div>
          <p className="font-display text-3xl text-white font-bold">Chuẩn bị...</p>
          <p className="text-white/60 mt-2">{currentQ.subject} — {currentQ.topic}</p>
        </motion.div>
      </div>
    );
  }

  // Results / Leaderboard screen
  if (showLeaderboard) {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const top5 = sorted.slice(0, 5);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 to-orange-800 flex flex-col items-center p-4 md:p-6 no-select">
        <div className="w-full max-w-3xl">
          <h1 className="font-display text-3xl text-white font-bold text-center mb-2 flex items-center justify-center gap-2">
            <Trophy size={28} /> Bảng Xếp Hạng
          </h1>
          <p className="text-white/70 text-center mb-5">Câu {currentIndex + 1} / {questions.length}</p>

          {/* Answer distribution chart */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 mb-5">
            <p className="text-white/80 text-sm font-bold mb-3 flex items-center gap-2">
              <BarChart3 size={16} /> Phân bố đáp án ({totalAnswered} người trả lời)
            </p>
            <div className="space-y-2">
              {answerCounts.map((count, i) => {
                const color = ANSWER_COLORS[i];
                const isCorrect = i === currentQ.correct_index;
                const pct = totalAnswered > 0 ? (count / totalAnswered) * 100 : 0;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-white text-lg w-6">{color.shape}</span>
                    <div className="flex-1 h-8 bg-white/10 rounded-lg overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full ${isCorrect ? "bg-green-500" : color.bg} flex items-center justify-end pr-2`}
                      >
                        <span className="text-white font-bold text-sm">{count}</span>
                      </motion.div>
                    </div>
                    {isCorrect && <span className="text-green-300 text-xs font-bold">ĐÚNG</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 5 */}
          <div className="space-y-2 mb-5">
            {top5.map((p, i) => {
              const av = AVATARS.find((a) => a.id === p.avatarId)!;
              const medal = ["🥇", "🥈", "🥉"][i] ?? `#${i + 1}`;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 rounded-2xl p-3 ${i === 0 ? "bg-yellow-400/90" : i === 1 ? "bg-slate-300/90" : i === 2 ? "bg-orange-400/80" : "bg-white/15 backdrop-blur-sm"}`}
                >
                  <span className="text-2xl font-bold w-10 text-center">{medal}</span>
                  <div className={`w-10 h-10 rounded-full ${av.color} flex items-center justify-center text-xl`}>{av.emoji}</div>
                  <span className={`font-bold flex-1 ${i < 3 ? "text-slate-800" : "text-white"}`}>{p.name}</span>
                  {p.streak >= 2 && <span className="text-xs font-bold bg-white/30 rounded-full px-2 py-0.5">🔥 {p.streak}</span>}
                  <span className={`font-display font-extrabold text-lg ${i < 3 ? "text-slate-800" : "text-white"}`}>{p.score}</span>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full bg-white text-orange-700 font-display font-bold text-xl py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2"
          >
            {currentIndex < questions.length - 1 ? "Câu tiếp theo" : "Xem tổng kết"} <ArrowRight size={22} />
          </motion.button>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-900 flex flex-col p-4 md:p-6 no-select">
      {/* Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full mb-3">
        <span className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white font-bold text-sm">
          Câu {currentIndex + 1} / {questions.length}
        </span>
        <span className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white font-bold text-sm">
          {currentQ.topic}
        </span>
        <span className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white font-bold text-sm flex items-center gap-1">
          <Users size={16} /> {players.length}
        </span>
      </div>

      {/* Timer */}
      <div className="max-w-4xl mx-auto w-full mb-4">
        <TimerBar key={`timer-${currentIndex}`} duration={currentQ.time_limit} paused={phase !== "question"} />
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-5 text-center relative"
        >
          {/* Timer circle */}
          {phase === "question" && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-extrabold text-white shadow-lg ${timeLeft <= 5 ? "bg-red-500" : "bg-indigo-500"}`}>
                {timeLeft}
              </div>
            </div>
          )}
          <p className="font-display text-2xl md:text-4xl font-bold text-slate-800 leading-relaxed mt-4">
            {currentQ.question}
          </p>
        </motion.div>

        {/* Answer blocks */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {currentQ.options.map((opt, i) => {
            const color = ANSWER_COLORS[i];
            const isCorrect = i === currentQ.correct_index;
            let extraClass = "";
            if (phase === "results") {
              if (isCorrect) extraClass = "ring-4 ring-white scale-105";
            }
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${color.bg} ${extraClass} rounded-2xl p-4 md:p-6 shadow-xl min-h-[100px] md:min-h-[120px] flex items-center justify-center text-center transition-all`}
              >
                <div>
                  <span className="text-3xl md:text-4xl block mb-1">{color.shape}</span>
                  <span className="text-white font-bold text-sm md:text-lg">{opt}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Results: show correct answer + explanation */}
        <AnimatePresence>
          {phase === "results" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 bg-white rounded-2xl p-5 shadow-xl"
            >
              <p className="font-display text-lg font-bold text-slate-800 mb-1">
                Đáp án đúng: {currentQ.options[currentQ.correct_index]}
              </p>
              <p className="text-slate-600 text-sm">{currentQ.explanation}</p>
              <p className="text-violet-500 text-sm font-bold mt-2 animate-pulse">
                Đang tính điểm... Chuẩn bị hiển thị bảng xếp hạng
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
