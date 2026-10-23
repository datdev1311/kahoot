export type GameMode = "host" | "player" | "solo" | "review";

export type Screen =
  | "home"
  | "host-setup"
  | "host-lobby"
  | "host-question"
  | "host-leaderboard"
  | "host-podium"
  | "host-review"
  | "player-join"
  | "player-lobby"
  | "player-answer"
  | "player-result"
  | "solo-setup"
  | "solo-quiz"
  | "solo-result"
  | "review-select"
  | "review-detail";

export interface Player {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  streak: number;
  lastCorrect: boolean;
  lastAnswerIndex: number | null;
  lastAnswerTime: number | null;
  ready: boolean;
}

export interface GameSession {
  pin: string;
  hostId: string;
  subject: string;
  questions: number[]; // question ids
  currentIndex: number;
  phase: "lobby" | "question" | "results" | "finished";
  questionStartTime: number | null;
}

export interface SoloResult {
  questionId: number;
  selectedIndex: number | null;
  correct: boolean;
  timeUsed: number;
}

export const ANSWER_COLORS = [
  { bg: "bg-rose-500", hover: "hover:bg-rose-600", active: "bg-rose-600", shape: "▲", name: "Tam giác" },
  { bg: "bg-sky-500", hover: "hover:bg-sky-600", active: "bg-sky-600", shape: "◆", name: "Hình thoi" },
  { bg: "bg-amber-500", hover: "hover:bg-amber-600", active: "bg-amber-600", shape: "●", name: "Hình tròn" },
  { bg: "bg-emerald-500", hover: "hover:bg-emerald-600", active: "bg-emerald-600", shape: "■", name: "Hình vuông" },
];
