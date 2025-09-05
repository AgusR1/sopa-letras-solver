// Utilities for color palette management
// Provides an extended palette and a helper to map words to colors consistently.

export const EXTENDED_PALETTE: string[] = [
  // Yellows / Oranges
  "#FFF59D", "#FFE082", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800",
  // Reds / Pinks
  "#FFCDD2", "#EF9A9A", "#E57373", "#F06292", "#EC407A", "#E91E63",
  // Purples
  "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0",
  // Blues
  "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3",
  // Cyans / Teals
  "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#26A69A",
  // Greens
  "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50",
  // Limes
  "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39",
  // Browns / Neutrals
  "#D7CCC8", "#BCAAA4", "#A1887F", "#BDBDBD", "#9E9E9E"
];

export function getColorMapForWords(palabras: string[], palette: string[] = EXTENDED_PALETTE): Record<string, string> {
  const map: Record<string, string> = {};
  if (palabras.length === 0) return map;

  // To reduce similarity between consecutive assigned colors, interleave the palette by jumping with a step
  // that is co-prime with palette.length (use a small prime like 7 if possible). This spreads hues apart.
  const n = palette.length;
  const preferredSteps = [7, 5, 11, 13, 17, 3, 19, 23];
  let step = 1;
  for (const s of preferredSteps) {
    if (s < n && gcd(s, n) === 1) { step = s; break; }
  }
  if (step === 1 && n > 2) step = 2; // fallback minimal spread

  let idx = 0;
  palabras.forEach((p) => {
    map[p] = palette[idx];
    idx = (idx + step) % n;
  });
  return map;
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return Math.abs(a);
}
