import React from "react";

interface MatrixGridProps {
  sopaDeLetras: string[][];
  colorPorCelda: Map<string, string>;
  estilosPorCelda: Map<string, React.CSSProperties>;
}

const MatrixGrid: React.FC<MatrixGridProps> = ({ sopaDeLetras, colorPorCelda, estilosPorCelda }) => {
  return (
    <div
      className="sopa-grid"
      style={{ gridTemplateColumns: `repeat(${sopaDeLetras[0].length}, 40px)` }}
    >
      {sopaDeLetras.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const key = `${rowIndex}-${colIndex}`;
          const bg = colorPorCelda.get(key);
          const extraStyle = estilosPorCelda.get(key);
          const style = bg ? { backgroundColor: bg, ...(extraStyle || {}) } : extraStyle;
          return (
            <div key={key} className="sopa-cell" style={style}>
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MatrixGrid;
