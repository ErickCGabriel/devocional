export interface Sticker {
  key: string;
  label: string;
  src: string;
}

export const STICKERS: Sticker[] = [
  { key: "cruz", label: "Cruz", src: "/stickers/cruz.svg" },
  { key: "biblia", label: "Bíblia aberta", src: "/stickers/biblia.svg" },
  { key: "pomba", label: "Pomba", src: "/stickers/pomba.svg" },
  { key: "flor", label: "Flor", src: "/stickers/flor.svg" },
  { key: "paisagem", label: "Paisagem", src: "/stickers/paisagem.svg" },
  { key: "cafe", label: "Café", src: "/stickers/cafe.svg" },
];

export function getSticker(key: string | null | undefined): Sticker | undefined {
  return STICKERS.find((s) => s.key === key);
}
