/**
 * Componente TablaDContenidos (tabla de contenidos lateral)
 *
 * Responsabilidad: renderizar una lista de enlaces anclados a los encabezados
 * del artículo MDX. Aparece como sidebar sticky en pantallas xl y superiores.
 *
 * Relaciones:
 * - Consumido por: src/pages/publicaciones/[slug].tsx
 * - Los IDs de los encabezados son generados por rehype-slug (misma lógica que github-slugger)
 */

interface Encabezado {
    nivel: 1 | 2 | 3;
    texto: string;
    id: string;
}

interface Props {
    encabezados: Encabezado[];
}

const sangriasPorNivel: Record<number, string> = {
    1: '',
    2: 'pl-3',
    3: 'pl-6',
};

export default function TablaDContenidos({ encabezados }: Props) {
    if (encabezados.length === 0) return null;

    return (
        <nav className="sticky top-24 max-h-[80vh] overflow-y-auto">
            <p className="text-sm uppercase tracking-widest opacity-50 mb-3">En esta página</p>
            <ul className="space-y-1.5 text-xl">
                {encabezados.map((enc) => (
                    <li key={enc.id} className={sangriasPorNivel[enc.nivel]}>
                        <a
                            href={`#${enc.id}`}
                            className="opacity-60 hover:opacity-100 transition-opacity"
                        >
                            {enc.texto}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
