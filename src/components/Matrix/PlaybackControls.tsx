import React from "react";

interface PlaybackControlsProps {
  ejecutando: boolean;
  velocidadMs: number;
  setVelocidadMs: (ms: number) => void;
  paso: number;
  totalPasos: number;
  iniciar: () => void;
  pausar: () => void;
  reanudar: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  ejecutando,
  velocidadMs,
  setVelocidadMs,
  paso,
  totalPasos,
  iniciar,
  pausar,
  reanudar
}) => {
  return (
    <div className="controls">
      <div className="controls-row">
        <button className="btn btn-primary" onClick={iniciar} disabled={ejecutando}>
          Resolver
        </button>
        <button className="btn" onClick={pausar} disabled={!ejecutando}>
          Pausar
        </button>
        <button className="btn" onClick={reanudar} disabled={ejecutando || paso >= totalPasos}>
          Reanudar
        </button>
      </div>
      <div className="speed-group" role="group" aria-label="Velocidad de reproducción">
        <span className="speed-label">Velocidad:</span>
        <button
          className={`speed-btn ${velocidadMs === 800 ? 'active' : ''}`}
          onClick={() => setVelocidadMs(800)}
          disabled={ejecutando && velocidadMs === 800}
        >
          Lento
        </button>
        <button
          className={`speed-btn ${velocidadMs === 400 ? 'active' : ''}`}
          onClick={() => setVelocidadMs(400)}
          disabled={ejecutando && velocidadMs === 400}
        >
          Medio
        </button>
        <button
          className={`speed-btn ${velocidadMs === 50 ? 'active' : ''}`}
          onClick={() => setVelocidadMs(50)}
          disabled={ejecutando && velocidadMs === 50}
        >
          Rápido
        </button>
      </div>
    </div>
  );
};

export default PlaybackControls;
