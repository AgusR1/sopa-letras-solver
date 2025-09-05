import React, {useMemo} from "react";
import "./SopaDeLetras.css";
import {autoResolverSteps} from "../../helpers/autoResolver.ts";
import {getColorMapForWords} from "../../utils/palette";
import {usePlayback} from "../../hooks/usePlayback";
import { computeCellStyles } from "./matrixStyles.ts";
import MatrixGrid from "./MatrixGrid";
import WordsList from "./WordsList";
import PlaybackControls from "./PlaybackControls";

interface SopaDeLetrasMatrixProps {
  data: {
    sopaDeLetras: string[][];
    palabras: string[];
  };
}

const SopaDeLetrasMatrix: React.FC<SopaDeLetrasMatrixProps> = ({data}) => {
  const {sopaDeLetras, palabras} = data;

  // Secuencia didáctica de pasos del algoritmo (explora direcciones hasta encontrar cada palabra)
  const pasosSecuencia = useMemo(() => autoResolverSteps(sopaDeLetras, palabras), [sopaDeLetras, palabras]);

  // Paleta extendida y mapeo por palabra
  const colorPorPalabra = useMemo(() => getColorMapForWords(palabras), [palabras]);

  // Playback (reproducción de pasos)
  const {
    ejecutando,
    velocidadMs,
    setVelocidadMs,
    paso,
    iniciar,
    pausar,
    reanudar
  } = usePlayback(pasosSecuencia.length, 400);

  // Generar estilos dinámicos a partir de los pasos ejecutados hasta el índice actual
  const { colorPorCelda, estilosPorCelda } = useMemo(() => {
    return computeCellStyles(pasosSecuencia, paso, colorPorPalabra, sopaDeLetras);
  }, [paso, pasosSecuencia, colorPorPalabra, sopaDeLetras]);


  return (
    <div className="sopa-container">
      <h1 className="title">Sopa de Letras</h1>

      {/* Matriz de letras */}
      <MatrixGrid
        sopaDeLetras={sopaDeLetras}
        colorPorCelda={colorPorCelda}
        estilosPorCelda={estilosPorCelda}
      />


      {/* Palabras a encontrar */}
      <WordsList palabras={palabras} />

      {/* Controles (debajo) */}
      <PlaybackControls
        ejecutando={ejecutando}
        velocidadMs={velocidadMs}
        setVelocidadMs={setVelocidadMs}
        paso={paso}
        totalPasos={pasosSecuencia.length}
        iniciar={iniciar}
        pausar={pausar}
        reanudar={reanudar}
      />
    </div>
  );
};

export default SopaDeLetrasMatrix;
