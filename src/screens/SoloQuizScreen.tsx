import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Clock, Trophy, ChevronRight } from "lucide-react";
import { shuffleQuestions, getQuestionsBySubject, type Question } from "@/data/questions";
import { ANSWER_COLORS, type SoloResult, type Screen } from "@/lib/types";
import { playSound } from "@/lib/sound";
import { TimerBar } from "@/components/Timer";
import { burstConfetti } from "@/lib/confetti";

interface Props {
  onNavigate: (screen: Screen, data?: any) => void;
  data: { subject: string; count: number };
}

export function SoloQuizScreen({ onNavigate, data }: Props) {
  const [questions] = useState<Question[]>(() => {
    const all = getQuestionsBySubject(data.subject);
    return shuffleQuestions(all).slice(0, data.count);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<SoloResult[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ = questions[currentIndex];

  const handleTimeout = useCallback(() => {
    setSelectedIndex(-1);
    setShowResult(true);
    playSound("wrong");
    setResults((prev) => [
      ...prev,
      { questionId: currentQ.id, selectedIndex: null, correct: false, timeUsed: currentQ.time_limit },
    ]);
  }, [currentQ]);

  useEffect(() => {
    setTimeLeft(currentQ.time_limit);
    startTimeRef.current = Date.now();
    setSelectedIndex(null);
    setShowResult(false);

    if (timerRef.current) clearInterval(timerRef.current);
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
  }, [currentIndex, currentQ, handleTimeout]);

  const handleAnswer = (index: number) => {
    if (showResult || selectedIndex !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const timeUsed = Math.max(0, (Date.now() - startTimeRef.current) / 1000);
    const correct = index === currentQ.correct_index;
    setSelectedIndex(index);
    setShowResult(true);
    playSound(correct ? "correct" : "wrong");
    if (correct) burstConfetti();
    setResults((prev) => [
      ...prev,
      { questionId: currentQ.id, selectedIndex: index, correct, timeUsed },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onNavigate("solo-result", { questions, results });
    }
  };

  const score = results.filter((r) => r.correct).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex flex-col p-4 no-select">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-3xl mx-auto w-full">
        <button onClick={() => onNavigate("solo-setup")} className="text-white/80 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
          <Clock size={18} className="text-white" />
          <span className="text-white font-bold text-lg tabular-nums">{timeLeft}s</span>
        </div>
        <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
          <Trophy size={18} className="text-yellow-300" />
          <span className="text-white font-bold">{score}/{questions.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-3xl mx-auto w-full mb-4">
        <div className="flex justify-between text-white/70 text-sm mb-1">
          <span>Câu {currentIndex + 1} / {questions.length}</span>
          <span>{currentQ.subject} — {currentQ.topic}</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question + Answers */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        {!showResult && <TimerBar key={`solo-timer-${currentIndex}`} duration={currentQ.time_limit} />}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 my-5"
        >
          <p className="font-display text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQ.question}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {currentQ.options.map((opt, i) => {
            const color = ANSWER_COLORS[i];
            const isCorrect = i === currentQ.correct_index;
            const isSelected = i === selectedIndex;
            let stateClass = `${color.bg} ${color.hover}`;
            if (showResult) {
              if (isCorrect) stateClass = "bg-green-500 scale-105";
              else if (isSelected) stateClass = "bg-red-500 opacity-70";
              else stateClass = "bg-slate-300 opacity-50";
            }
            return (
              <motion.button
                key={i}
                whileHover={!showResult ? { scale: 1.03, y: -3 } : {}}
                whileTap={!showResult ? { scale: 0.96 } : {}}
                disabled={showResult}
                onClick={() => handleAnswer(i)}
                className={`answer-shape ${stateClass} rounded-2xl p-4 md:p-5 text-left text-white font-bold shadow-lg flex items-center gap-3 transition-all min-h-[80px]`}
              >
                <span className="text-2xl flex-shrink-0">{color.shape}</span>
                <span className="text-sm md:text-base">{opt}</span>
                {showResult && isCorrect && <Check size={24} className="ml-auto" />}
                {showResult && isSelected && !isCorrect && <X size={24} className="ml-auto" />}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation + Next */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 bg-white rounded-2xl p-5 shadow-xl"
            >
              <div className={`flex items-center gap-2 mb-2 font-display text-lg font-bold ${selectedIndex === currentQ.correct_index ? "text-green-600" : "text-red-500"}`}>
                {selectedIndex === currentQ.correct_index ? (
                  <><Check size={22} /> Chính xác!</>
                ) : (
                  <><X size={22} /> {selectedIndex === -1 ? "Hết giờ!" : "Chưa đúng!"}</>
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{currentQ.explanation}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-display font-bold text-lg py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {currentIndex < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                <ChevronRight size={22} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
