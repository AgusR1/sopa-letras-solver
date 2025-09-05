/**
 * Find all coordinates where a given letter appears in the matrix (case-insensitive).
 *
 * Coordinate system:
 * - matriz[y][x]
 * - y is the row index (0 at top), x is the column index (0 at left)
 *
 * @param matriz Matrix of characters (rows x columns).
 * @param letra Single letter to search for. Comparison is case-insensitive.
 * @returns Array of coordinates [y, x] for each match, possibly empty.
 */
const findLetterPositions = (matriz: string[][], letra: string): Array<[number, number]> => {
  const objetivo = letra.toUpperCase();
  const coords: Array<[number, number]> = [];
  for (let fila = 0; fila < matriz.length; fila++) {
    const row = matriz[fila];
    for (let col = 0; col < row.length; col++) {
      if (row[col].toUpperCase() === objetivo) {
        coords.push([fila, col]);
      }
    }
  }
  return coords;
}

/**
 * Get the coordinate directly above the given one.
 * Returns null if moving up would go out of bounds (y <= 0).
 *
 * NOTE: This function does not check the matrix bounds itself, only basic negative protection.
 * Use inBounds(...) to validate against a specific matrix.
 *
 * @param coord Source coordinate [y, x]
 * @returns The coordinate [y-1, x] or null
 */
const obtenerSuperior = (coord: Coord): Coord | null => {
  const [y, x] = coord;
  if (y <= 0) return null;        // fuera de límites por arriba
  return [y - 1, x];
};

/**
 * Get the coordinate directly below the given one.
 * Returns null if input is invalid (y < 0). Does not clamp to matrix height.
 *
 * @param coord Source coordinate [y, x]
 * @returns The coordinate [y+1, x] or null
 */
const obtenerInferiorVerical = (coord: Coord): Coord | null => {
  const [y, x] = coord;
  if (y < 0) return null;
  return [y + 1, x];
}

/**
 * Get the coordinate to the right of the given one.
 * Returns null if input is invalid (x < 0). Does not clamp to matrix width.
 *
 * @param coord Source coordinate [y, x]
 * @returns The coordinate [y, x+1] or null
 */
const obtenerAdyacenteDerecha = (coord: Coord): Coord | null => {
  const [y, x] = coord;
  if (x < 0) return null;
  return [y, x + 1]
}

/**
 * Get the coordinate to the left of the given one.
 * Returns null if input is invalid (x < 0). Does not clamp to matrix width.
 *
 * @param coord Source coordinate [y, x]
 * @returns The coordinate [y, x-1] or null
 */
const obtenerAdyacenteIzquierda = (coord: Coord): Coord | null => {
  const [y, x] = coord;
  if (x < 0) return null;
  return [y, x - 1]
}


/**
 * Set of the 8 neighboring cells around a given coordinate.
 * All fields can be null when the neighbor is invalid or outside the matrix bounds.
 */
type AdjacentSet = {
  superior: Coord | null;
  inferior: Coord | null;
  adyacenteDerecha: Coord | null;
  adyacenteIzquierda: Coord | null;
  diagonalSuperiorIzquierda: Coord | null;
  diagonalSuperiorDerecha: Coord | null;
  diagonalInferiorIzquierda: Coord | null;
  diagonalInferiorDerecha: Coord | null;
};

/**
 * Sanitize a coordinate: if it is null, or any component equals -1, treat the entire coordinate as null.
 * Rule: any tuple containing -1 is considered invalid/null.
 *
 * @param coord Coordinate to sanitize.
 * @returns The same coordinate if valid, otherwise null.
 */
const sanitizeCoord = (coord: Coord | null): Coord | null => {
  if (!coord) return null;
  const [y, x] = coord;
  if (y === -1 || x === -1) return null;
  return coord;
};

/**
 * For each base position, compute its 8 neighbors (N, S, E, W, NE, NW, SE, SW).
 * If a base position is invalid (null or contains -1), all its neighbors are returned as null.
 *
 * NOTE: This function only computes relative neighbors; it does not verify bounds against a matrix.
 *
 * @param posiciones Array of base coordinates [y, x].
 * @returns Array of AdjacentSet, same length as posiciones.
 */
const findAdjacentPositions = (posiciones: Array<[number, number]>): AdjacentSet[] => {
  const resultado: AdjacentSet[] = [];
  posiciones.forEach((posicion) => {
    // Si la posición base tiene -1 en cualquiera de sus componentes, todas las adyacencias se consideran null
    const posicionValida = sanitizeCoord(posicion);
    if (!posicionValida) {
      resultado.push({
        superior: null,
        inferior: null,
        adyacenteDerecha: null,
        adyacenteIzquierda: null,
        diagonalSuperiorIzquierda: null,
        diagonalSuperiorDerecha: null,
        diagonalInferiorIzquierda: null,
        diagonalInferiorDerecha: null,
      });
      return;
    }

    const superior = sanitizeCoord(obtenerSuperior(posicionValida));
    const inferior = sanitizeCoord(obtenerInferiorVerical(posicionValida));
    const adyacenteDerecha = sanitizeCoord(obtenerAdyacenteDerecha(posicionValida));
    const adyacenteIzquierda = sanitizeCoord(obtenerAdyacenteIzquierda(posicionValida));
    const diagonalSuperiorIzquierda = sanitizeCoord(superior ? obtenerAdyacenteIzquierda(superior) : null);
    const diagonalSuperiorDerecha = sanitizeCoord(superior ? obtenerAdyacenteDerecha(superior) : null);
    const diagonalInferiorIzquierda = sanitizeCoord(inferior ? obtenerAdyacenteIzquierda(inferior) : null);
    const diagonalInferiorDerecha = sanitizeCoord(inferior ? obtenerAdyacenteDerecha(inferior) : null);

    resultado.push({
      superior,
      inferior,
      adyacenteDerecha,
      adyacenteIzquierda,
      diagonalSuperiorIzquierda,
      diagonalSuperiorDerecha,
      diagonalInferiorIzquierda,
      diagonalInferiorDerecha,
    });
  });
  return resultado;
}

/**
 * Coordinate represented as a tuple [y, x].
 * - y: row index (0-based, top to bottom)
 * - x: column index (0-based, left to right)
 */
export type Coord = [number, number];

/**
 * Painting information for a cell in the UI layer.
 * - central: whether this cell is a main (strong color) letter start.
 * - layered: number of times this cell has been painted (for overlap/striping effects).
 */
export type PaintInfo = {
  central: boolean; // true si es la letra central
  layered: number;  // cantidad de "pintadas" que recibe esta celda (para detectar solapamientos)
};

/**
 * Map key is a string "y-x" built from the coordinate.
 */
export type PaintMap = Record<string, PaintInfo>; // key: "y-x"

/**
 * Check if a coordinate is inside the bounds of the matrix dimensions.
 *
 * @param matriz Matrix of characters.
 * @param param1 Tuple [y, x].
 * @returns true if 0 <= y < rows and 0 <= x < cols.
 */
const inBounds = (matriz: string[][], [y, x]: Coord) => y >= 0 && y < matriz.length && x >= 0 && x < matriz[0].length;

/**
 * Build the string key used by PaintMap for a coordinate.
 * @param y Row index
 * @param x Column index
 */
const keyFrom = (y: number, x: number) => `${y}-${x}`;

/**
 * Compute helper data for painting a word-search UI given the list of target words.
 *
 * For each word, finds starting cells that match its first letter and:
 * - stores those starting positions
 * - marks the central cell strongly
 * - marks the 8 neighbors lightly
 * If a cell is painted multiple times (overlaps), `layered` is incremented to enable striping.
 *
 * NOTE: This function does not solve whole words; it only highlights first letters and their neighbors.
 *
 * @param sopaLetras Matrix of letters (string[][])
 * @param palabras List of words to highlight
 * @returns Object with:
 *  - posicionesPorPalabra: mapping word -> array of start coords [y, x]
 *  - paintMap: map of "y-x" -> { central, layered }
 */
export const autoResolver = (sopaLetras: string[][], palabras: string[]) => {
  // Devuelve dos cosas:
  // - posicionesPorPalabra: celdas con la primera letra encontrada por palabra
  // - paintMap: mapa de celdas a pintar (central fuerte y adyacentes más leves, con flag de solapamiento)
  const posicionesPorPalabra: Record<string, Coord[]> = {};
  const paintMap: PaintMap = {};

  palabras.forEach((palabra) => {
    const primeraLetra = palabra[0];
    const posiciones = findLetterPositions(sopaLetras, primeraLetra);
    posicionesPorPalabra[palabra] = posiciones;

    // Pintar cada posición central y sus adyacentes
    posiciones.forEach((pos) => {
      const [y, x] = pos;
      if (!inBounds(sopaLetras, pos)) return;

      // Central (color fuerte)
      const kCentral = keyFrom(y, x);
      paintMap[kCentral] = {
        central: true,
        layered: (paintMap[kCentral]?.layered || 0) + 1,
      };

      // Adyacentes (8 direcciones), color más leve; si ya está pintada, se incrementa layered para luego aplicar rayado
      const adyacentes = findAdjacentPositions([pos]);
      const set = adyacentes[0];
      const vecinos: (Coord | null)[] = [
        set.superior,
        set.inferior,
        set.adyacenteDerecha,
        set.adyacenteIzquierda,
        set.diagonalSuperiorIzquierda,
        set.diagonalSuperiorDerecha,
        set.diagonalInferiorIzquierda,
        set.diagonalInferiorDerecha,
      ];
      vecinos.forEach((v) => {
        if (!v) return;
        if (!inBounds(sopaLetras, v)) return;
        const ky = keyFrom(v[0], v[1]);
        const prev = paintMap[ky];
        paintMap[ky] = {
          central: prev?.central || false,
          layered: (prev?.layered || 0) + 1,
        };
      });
    });
  });

  // Nota: mantenemos la firma anterior para posicionesPorPalabra, y añadimos paintMap como propiedad extra
  return { posicionesPorPalabra, paintMap };
}

// Paso didáctico del auto-resolvedor
/**
 * Visual step emitted by the educational auto-resolver to explain the search process.
 */
export type Step =
  | { type: 'start-word'; palabra: string }
  | { type: 'start-at'; palabra: string; coord: Coord }
  | { type: 'try-direction'; palabra: string; coord: Coord; dir: [number, number] }
  | { type: 'visit'; palabra: string; coord: Coord; index: number }
  | { type: 'mismatch'; palabra: string; coord: Coord; index: number }
  | { type: 'found'; palabra: string; path: Coord[] }
  | { type: 'end-word'; palabra: string };

/**
 * 8 possible movement directions in the grid as [dy, dx].
 * Order: N, S, E, W, NW, NE, SW, SE.
 */
const DIRS: Array<[number, number]> = [
  [-1, 0], // N
  [1, 0],  // S
  [0, 1],  // E
  [0, -1], // W
  [-1, -1],// NW
  [-1, 1], // NE
  [1, -1], // SW
  [1, 1],  // SE
];

/**
 * Produce a detailed sequence of steps that simulate the word search resolution process.
 * Useful for visual playback/debugging of how each word is searched across all directions.
 *
 * Emits steps: start-word, start-at, try-direction, visit, mismatch, found, end-word.
 * Stops early for a word once a complete path is found.
 *
 * @param sopa Grid of letters.
 * @param palabras Words to search (case-insensitive).
 * @returns Ordered list of steps for all words, in sequence.
 */
export function autoResolverSteps(sopa: string[][], palabras: string[]): Step[] {
  const steps: Step[] = [];
  const rows = sopa.length;
  const cols = rows > 0 ? sopa[0].length : 0;
  const inB = ([y, x]: Coord) => y >= 0 && y < rows && x >= 0 && x < cols;

  for (const palabra of palabras) {
    if (!palabra || palabra.length === 0) continue;
    const target = palabra.toUpperCase();
    steps.push({ type: 'start-word', palabra });
    const starts = findLetterPositions(sopa, target[0]);

    let found = false;
    for (const start of starts) {
      steps.push({ type: 'start-at', palabra, coord: start });
      for (const dir of DIRS) {
        steps.push({ type: 'try-direction', palabra, coord: start, dir });
        const path: Coord[] = [];
        let ok = true;
        for (let i = 0; i < target.length; i++) {
          const y = start[0] + dir[0] * i;
          const x = start[1] + dir[1] * i;
          const c: Coord = [y, x];
          if (!inB(c)) { ok = false; steps.push({ type: 'mismatch', palabra, coord: c, index: i }); break; }
          steps.push({ type: 'visit', palabra, coord: c, index: i });
          if (sopa[y][x].toUpperCase() !== target[i]) { ok = false; steps.push({ type: 'mismatch', palabra, coord: c, index: i }); break; }
          path.push(c);
        }
        if (ok && path.length === target.length) {
          steps.push({ type: 'found', palabra, path });
          found = true;
          break;
        }
      }
      if (found) break;
    }
    steps.push({ type: 'end-word', palabra });
  }

  return steps;
}