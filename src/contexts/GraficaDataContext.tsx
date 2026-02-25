/**
 * GraficaDataContext
 *
 * Responsabilidad: proveer los datos de las gráficas (leídos de archivos JSON
 * en build time) a los componentes MDX sin necesidad de serializar funciones en props.
 * El provider envuelve el contenido MDX renderizado; el componente Grafica consume
 * el contexto usando el nombre del archivo JSON como clave.
 *
 * Relaciones:
 * - Usado por: src/pages/investigacion/[slug].tsx (como GraficaDataProvider)
 * - Consumido por: src/components/molecules/Grafica/index.tsx (via useDatosGrafica)
 */
import React, { createContext, useContext } from 'react';

// Mapa de nombre-de-archivo → contenido JSON de la gráfica
const ContextoDatosGrafica = createContext<Record<string, any>>({});

interface GraficaDataProviderProps {
    datos: Record<string, any>;
    children: React.ReactNode;
}

export function GraficaDataProvider({ datos, children }: GraficaDataProviderProps) {
    return <ContextoDatosGrafica.Provider value={datos}>{children}</ContextoDatosGrafica.Provider>;
}

// Hook para que el componente Grafica obtenga los datos por nombre de archivo
export function useDatosGrafica(nombre: string): any | null {
    const datos = useContext(ContextoDatosGrafica);
    return datos[nombre] ?? null;
}
