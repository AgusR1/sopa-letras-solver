import React from "react";
import { autoResolverSteps } from "../../helpers/autoResolver.ts";

// Helper para construir un rayado multicolor a partir de varios colores
export function buildMultiStripe(colores: string[]): string {
  if (colores.length <= 1) {
    const c = colores[0] || 'rgba(0,0,0,0.12)';
    return `repeating-linear-gradient(45deg, ${c} 0, ${c} 4px, rgba(255,255,255,0.12) 4px, rgba(255,255,255,0.12) 8px)`;
  }
  // Múltiples gradients superpuestos con offset distinto
  const parts = colores.map((c, i) => `repeating-linear-gradient(45deg, ${c} ${i}px, ${c} ${i + 4}px, transparent ${i + 4}px, transparent ${i + 8}px)`);
  return parts.join(',');
}

function lightenColor(hex: string, factor: number = 0.5): string {
  const m = hex.trim();
  const h = m.startsWith('#') ? m.slice(1) : m;
  const parse = (s: string) => parseInt(s, 16);
  const r = h.length === 3 ? parse(h[0] + h[0]) : parse(h.slice(0, 2));
  const g = h.length === 3 ? parse(h[1] + h[1]) : parse(h.slice(2, 4));
  const b = h.length === 3 ? parse(h[2] + h[2]) : parse(h.slice(4, 6));
  const mix = (c: number) => Math.round(255 * factor + c * (1 - factor));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

const keyFrom = (r: number, c: number) => `${r}-${c}`;

export function computeCellStyles(
  pasosSecuencia: ReturnType<typeof autoResolverSteps>,
  paso: number,
  colorPorPalabra: Record<string, string>,
  sopaDeLetras: string[][]
): { colorPorCelda: Map<string, string>; estilosPorCelda: Map<string, React.CSSProperties> } {
  // Paths tentativos activos y palabras encontradas hasta el paso actual
  const pathTentativoPorPalabra: Map<string, Array<[number, number]>> = new Map();
  const strongMap = new Map<string, string>(); // celdas finales de palabras encontradas
  const strongContrib: Map<string, Set<string>> = new Map(); // key -> set de palabras finales superpuestas

  const inBounds = (y: number, x: number) => y >= 0 && y < sopaDeLetras.length && x >= 0 && x < sopaDeLetras[0].length;
  const dirs: Array<[number, number]> = [
    [-1, 0],[1, 0],[0, 1],[0, -1],[-1, -1],[-1, 1],[1, -1],[1, 1]
  ];

  // Procesar pasos para mantener estado tentativo y registrar palabras encontradas
  for (let i = 0; i < Math.min(paso, pasosSecuencia.length); i++) {
    const step = pasosSecuencia[i] as ReturnType<typeof autoResolverSteps>[number];
    if (step.type === 'try-direction') {
      pathTentativoPorPalabra.set(step.palabra, []);
    } else if (step.type === 'visit') {
      const path = pathTentativoPorPalabra.get(step.palabra) || [];
      path.push(step.coord as [number, number]);
      pathTentativoPorPalabra.set(step.palabra, path);
    } else if (step.type === 'mismatch') {
      pathTentativoPorPalabra.delete(step.palabra);
    } else if (step.type === 'found') {
      const path = step.path as [number, number][];
      path.forEach(([y, x]) => {
        const k = keyFrom(y, x);
        strongMap.set(k, colorPorPalabra[step.palabra]);
        const set = strongContrib.get(k) || new Set<string>();
        set.add(step.palabra);
        strongContrib.set(k, set);
      });
      pathTentativoPorPalabra.delete(step.palabra);
    }
  }

  // Construir los estilos desde el estado tentativo ACTUAL (no histórico)
  const estilos = new Map<string, React.CSSProperties>();
  const lightMap = new Map<string, string>();
  const centralContrib: Map<string, Set<string>> = new Map(); // key -> set de palabras activas
  const adjacentContrib: Map<string, Set<string>> = new Map();

  // Contribuciones desde los paths tentativos activos
  pathTentativoPorPalabra.forEach((path, palabra) => {
    const light = lightenColor(colorPorPalabra[palabra], 0.6);
    path.forEach(([y, x]) => {
      const k = keyFrom(y, x);
      lightMap.set(k, light);
      // marca central activa
      const s = centralContrib.get(k) || new Set<string>();
      s.add(palabra);
      centralContrib.set(k, s);
      // adyacentes suaves actuales
      dirs.forEach(([dy, dx]) => {
        const ny = y + dy, nx = x + dx;
        if (!inBounds(ny, nx)) return;
        const kk = keyFrom(ny, nx);
        const sa = adjacentContrib.get(kk) || new Set<string>();
        sa.add(palabra);
        adjacentContrib.set(kk, sa);
      });
    });
  });

  // Estilos de adyacentes (solo desde intentos actuales)
  adjacentContrib.forEach((setPalabras, k) => {
    if (setPalabras.size === 0) return;
    const base: React.CSSProperties = { backgroundColor: "#eaf4ff" };
    if (setPalabras.size >= 2) {
      const colores = Array.from(setPalabras).map(p => colorPorPalabra[p]).filter(Boolean) as string[];
      base.backgroundImage = buildMultiStripe(colores);
    }
    estilos.set(k, base);
  });

  // Overlay rayado multicolor si varias palabras activas pisan la misma central tentativamente
  centralContrib.forEach((setPalabras, k) => {
    if (setPalabras.size >= 2) {
      const colores = Array.from(setPalabras).map(p => colorPorPalabra[p]).filter(Boolean) as string[];
      estilos.set(k, { backgroundImage: buildMultiStripe(colores) });
    }
  });

  // Overlay rayado multicolor para celdas finales superpuestas (palabras ya encontradas)
  strongContrib.forEach((setPalabras, k) => {
    if (setPalabras.size >= 2) {
      const colores = Array.from(setPalabras).map(p => colorPorPalabra[p]).filter(Boolean) as string[];
      const overlay = buildMultiStripe(colores);
      const prev = estilos.get(k);
      if (prev && (prev as React.CSSProperties).backgroundImage) {
        estilos.set(k, { ...prev, backgroundImage: `${(prev as React.CSSProperties).backgroundImage},${overlay}` });
      } else if (prev) {
        estilos.set(k, { ...prev, backgroundImage: overlay });
      } else {
        estilos.set(k, { backgroundImage: overlay });
      }
    }
  });

  // Componer mapa final: fuerte > claro (tentativo)
  const colorPorCelda = new Map<string, string>();
  strongMap.forEach((v, k) => colorPorCelda.set(k, v));
  lightMap.forEach((v, k) => { if (!colorPorCelda.has(k)) colorPorCelda.set(k, v); });

  return { colorPorCelda, estilosPorCelda: estilos };
}
