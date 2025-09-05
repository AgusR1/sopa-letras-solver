import { useEffect, useRef, useState } from "react";

export interface UsePlayback {
  ejecutando: boolean;
  velocidadMs: number;
  setVelocidadMs: (ms: number) => void;
  paso: number;
  iniciar: () => void;
  pausar: () => void;
  reanudar: () => void;
}

// Generic playback hook that advances an index from 0..totalSteps at a given speed
export function usePlayback(totalSteps: number, initialSpeedMs: number = 400): UsePlayback {
  const [ejecutando, setEjecutando] = useState(false);
  const [velocidadMs, setVelocidadMs] = useState(initialSpeedMs);
  const [paso, setPaso] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ejecutando) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (paso >= totalSteps) {
      setEjecutando(false);
      return;
    }
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setPaso((p) => Math.min(p + 1, totalSteps));
    }, Math.max(50, velocidadMs));

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [ejecutando, velocidadMs, totalSteps, paso]);

  const iniciar = () => {
    setPaso(0);
    setEjecutando(true);
  };

  const pausar = () => setEjecutando(false);

  const reanudar = () => {
    if (paso < totalSteps) setEjecutando(true);
  };

  return { ejecutando, velocidadMs, setVelocidadMs, paso, iniciar, pausar, reanudar };
}
