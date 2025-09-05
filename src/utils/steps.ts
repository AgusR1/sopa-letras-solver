// Utilities to build the animation steps for Sopa de Letras

export type Coord = [number, number];
export type Paso = { palabra: string; coord: Coord };

export type Posiciones = Record<string, Coord[]>; // palabra -> lista de coordenadas (primeras letras encontradas)

export function buildSteps(palabras: string[], posiciones: Posiciones): Paso[] {
  const sec: Paso[] = [];
  palabras.forEach((p) => {
    const coords = posiciones[p] || [];
    coords.forEach((coord) => sec.push({ palabra: p, coord }));
  });
  return sec;
}
