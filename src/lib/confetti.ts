import confetti from "canvas-confetti";

export function burstConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e", "#a855f7"],
  });
}

export function podiumConfetti() {
  const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e", "#a855f7", "#ec4899"];
  let count = 0;
  const interval = setInterval(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    count++;
    if (count >= 6) clearInterval(interval);
  }, 400);
}
