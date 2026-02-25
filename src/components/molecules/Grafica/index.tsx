/**
 * Grafica
 *
 * Responsabilidad: renderizar gráficas interactivas de Plotly dentro de artículos MDX.
 * Lee los datos del GraficaDataContext usando el prop `src` como clave (nombre del
 * archivo JSON sin extensión). El spec JSON exportado por Python con fig.write_json()
 * es compatible directamente con Plotly.js.
 *
 * La importación de react-plotly.js es dinámica con ssr:false para evitar errores
 * de `window is not defined` durante el server-side rendering.
 *
 * Relaciones:
 * - Consume: src/contexts/GraficaDataContext.tsx (via useDatosGrafica)
 * - Usado en: archivos .mdx de Publicaciones/ como <Grafica src="nombre-archivo" />
 * - Renderiza con: react-plotly.js / plotly.js-dist-min
 */
import dynamic from 'next/dynamic';
import { useDatosGrafica } from '@/contexts/GraficaDataContext';

// Importación dinámica para evitar errores de SSR (Plotly usa `window`)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface GraficaProps {
    src: string;        // nombre del archivo JSON sin extensión (ej. "varianza")
    titulo?: string;    // leyenda opcional debajo de la gráfica
    altura?: number;    // altura en píxeles (por defecto 420)
}

export default function Grafica({ src, titulo, altura = 420 }: GraficaProps) {
    const datos = useDatosGrafica(src);

    if (!datos) {
        return (
            <div className="my-8 border border-dashed border-gray-400 rounded-lg p-6 text-center text-sm opacity-60">
                Gráfica no encontrada: <code>{src}.json</code>
            </div>
        );
    }

    // El JSON exportado por fig.write_json() de Plotly Python contiene: data, layout, frames, config
    return (
        <figure className="my-10">
            <Plot
                data={datos.data}
                layout={{
                    ...datos.layout,
                    autosize: true,
                    height: altura,
                    margin: { l: 50, r: 20, t: 50, b: 50 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                }}
                config={{
                    responsive: true,
                    displayModeBar: false,
                    ...datos.config,
                }}
                style={{ width: '100%' }}
                frames={datos.frames ?? []}
            />
            {titulo && (
                <figcaption className="text-sm text-center mt-2 opacity-60 italic">
                    {titulo}
                </figcaption>
            )}
        </figure>
    );
}
