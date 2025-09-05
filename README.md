# Sopa de Letras Solver (React + TypeScript + Vite)

An interactive word-search (sopa de letras) visualizer and educational solver built with React, TypeScript, and Vite. It renders a grid of letters and a list of target words, then animates how the algorithm searches each word across eight directions. Useful for learning how word-search algorithms work and for demoing path visualization.

## Demo Overview
- Visual grid with per-cell coloring that evolves as the solver explores.
- Playback controls: start, pause, resume, and speed adjustment.
- Highlights visited cells, mismatches, and the final found path for each word.

## Quick Start

Prerequisites:
- Node.js 18+ (recommended)

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

- src/App.tsx: Mounts the SopaDeLetrasMatrix with sample data.
- src/assets/testSopas.ts: Example grid (sopaDeLetras) and list of palabras used by default.
- src/components/Matrix/SopaDeLetrasMatrix.tsx: Main UI that ties everything together (grid, words list, playback controls).
- src/helpers/autoResolver.ts: Core logic for generating educational steps of the search (with full JSDoc). Exports:
  - autoResolverSteps(sopa, palabras): produces a sequence of steps for visualization.
  - Types such as Coord and Step describing the coordinate system and step events.
- src/hooks/usePlayback.ts: Generic playback hook to animate steps over time.
- src/components/Matrix/*: Presentation components and styles for the matrix, controls, and list.

## How It Works

1. The application loads a matrix of letters and a list of words from src/assets/testSopas.ts.
2. autoResolverSteps computes an ordered list of step events per word, exploring 8 directions from matching starting letters until the word is found.
3. usePlayback advances through these steps at a configurable speed.
4. UI components color cells based on the current step index, showing exploration and final paths.

Coordinate system: [y, x] with y as row (top to bottom) and x as column (left to right).

## Customizing the Input

To try your own puzzle, edit src/assets/testSopas.ts:
- Replace the sopaDeLetras 2D array with your grid of uppercase letters (rows must be equal length).
- Replace the palabras array with the list of words to find. Matching is case-insensitive.

Example snippet:

```ts
export const testSopa = {
  sopaDeLetras: [
    ["A","B","C"],
    ["D","E","F"],
    ["G","H","I"],
  ],
  palabras: ["ABE", "CFI"]
};
```

## Scripts

- npm run dev: Start Vite dev server with HMR.
- npm run build: Type-check and bundle for production.
- npm run preview: Preview the production build.
- npm run lint: Run ESLint.

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- ESLint

## License

MIT License. See LICENSE if present; otherwise, treat this as MIT unless specified by the repository owner.

## Acknowledgements

- Inspired by classic word-search puzzles and educational algorithm visualizations.
