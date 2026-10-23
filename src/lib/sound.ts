type SoundName = "tick" | "select" | "correct" | "wrong" | "join" | "start" | "finish" | "countdown";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15, delay = 0) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const t = c.currentTime + delay;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

export function playSound(name: SoundName) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume();

  switch (name) {
    case "tick":
      tone(600, 0.08, "square", 0.05);
      break;
    case "select":
      tone(440, 0.12, "triangle", 0.1);
      break;
    case "correct":
      tone(523, 0.15, "sine", 0.12, 0);
      tone(659, 0.15, "sine", 0.12, 0.1);
      tone(784, 0.3, "sine", 0.12, 0.2);
      break;
    case "wrong":
      tone(200, 0.3, "sawtooth", 0.1, 0);
      tone(150, 0.4, "sawtooth", 0.1, 0.1);
      break;
    case "join":
      tone(523, 0.1, "sine", 0.1, 0);
      tone(784, 0.15, "sine", 0.1, 0.08);
      break;
    case "start":
      tone(440, 0.1, "square", 0.1, 0);
      tone(440, 0.1, "square", 0.1, 0.15);
      tone(880, 0.2, "square", 0.12, 0.3);
      break;
    case "countdown":
      tone(880, 0.15, "square", 0.12);
      break;
    case "finish":
      tone(523, 0.15, "sine", 0.12, 0);
      tone(659, 0.15, "sine", 0.12, 0.12);
      tone(784, 0.15, "sine", 0.12, 0.24);
      tone(1047, 0.4, "sine", 0.14, 0.36);
      break;
  }
}
