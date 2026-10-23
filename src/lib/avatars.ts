export interface AvatarDef {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const AVATARS: AvatarDef[] = [
  { id: "cat", name: "Mèo", emoji: "🐱", color: "bg-orange-400" },
  { id: "dog", name: "Chó", emoji: "🐶", color: "bg-amber-400" },
  { id: "panda", name: "Gấu trúc", emoji: "🐼", color: "bg-gray-400" },
  { id: "fox", name: "Cáo", emoji: "🦊", color: "bg-orange-500" },
  { id: "lion", name: "Sư tử", emoji: "🦁", color: "bg-yellow-500" },
  { id: "frog", name: "Ếch", emoji: "🐸", color: "bg-green-500" },
  { id: "penguin", name: "Chim cánh cụt", emoji: "🐧", color: "bg-slate-500" },
  { id: "monkey", name: "Khỉ", emoji: "🐵", color: "bg-yellow-600" },
  { id: "unicorn", name: "Kỳ lân", emoji: "🦄", color: "bg-pink-400" },
  { id: "owl", name: "Cú mèo", emoji: "🦉", color: "bg-purple-500" },
  { id: "rabbit", name: "Thỏ", emoji: "🐰", color: "bg-rose-300" },
  { id: "tiger", name: "Hổ", emoji: "🐯", color: "bg-orange-600" },
];

export function randomAvatar(): AvatarDef {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function getAvatar(id: string): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
