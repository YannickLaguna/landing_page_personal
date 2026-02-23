// este archivo importa la API de GitHub para obtener los notebooks.


import React, { useState, useEffect } from 'react';
import { getDataAttrs } from '../../../utils/get-data-attrs';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';

interface Notebook {
    name: string;
    filename: string;
    url: string;
    lastModified: string;
    size: number;
}

interface NotebooksSectionProps {
    type: 'NotebooksSection';
    title?: string;
    subtitle?: string;
    maxItems?: number;
    colors?: 'colors-a' | 'colors-b' | 'colors-c' | 'colors-d' | 'colors-e' | 'colors-f';
    styles?: {
        self?: {
            height?: 'auto' | 'screen';
            width?: 'narrow' | 'wide' | 'full';
            margin?: string | string[];
            padding?: string | string[];
            borderRadius?: string;
            borderWidth?: number;
            borderStyle?: string;
            borderColor?: string;
            textAlign?: 'left' | 'center' | 'right';
        };
    };
    elementId?: string;
}

export default function NotebooksSection(props: NotebooksSectionProps) {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { type, title = '📓 Notebooks de Jupyter', subtitle = 'Análisis de datos, machine learning y optimización', maxItems = 6, colors = 'colors-f', styles = {}, elementId } = props;

    // Función para formatear el nombre del notebook
    const formatNotebookName = (filename: string): string => {
        return filename
            .replace('.ipynb', '')
            .replace(/([A-Z])/g, ' $1') // Añadir espacio antes de mayúsculas
            .replace(/^./, str => str.toUpperCase()) // Primera letra mayúscula
            .trim();
    };

    // Función para formatear la fecha
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.warn('Fecha inválida:', dateString);
                return 'Fecha no disponible';
            }
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formateando fecha:', error, dateString);
            return 'Fecha no disponible';
        }
    };

    // Función para obtener la fecha del último commit de un archivo
    const fetchLastCommitDate = async (filename: string): Promise<string> => {
        const respuesta = await fetch(
            `https://api.github.com/repos/yannicklaguna/Notebooks/commits?path=${encodeURIComponent(filename)}&per_page=1`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'notebooks-section'
                }
            }
        );
        if (!respuesta.ok) return new Date().toISOString();
        const commits = await respuesta.json();
        return commits[0]?.commit?.committer?.date ?? new Date().toISOString();
    };

    // Función para obtener notebooks desde GitHub API
    const fetchNotebooks = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api.github.com/repos/yannicklaguna/Notebooks/contents', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'notebooks-section'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Filtrar solo archivos .ipynb
            const archivosFiltrados = data.filter((item: any) => item.type === 'file' && item.name.endsWith('.ipynb'));

            // Obtener la fecha real del último commit para cada notebook en paralelo
            const notebooksList = await Promise.all(
                archivosFiltrados.map(async (item: any) => {
                    const fechaUltimaModificacion = await fetchLastCommitDate(item.name);
                    return {
                        name: formatNotebookName(item.name),
                        filename: item.name,
                        url: `https://github.com/YannickLaguna/Notebooks/blob/main/${item.name}`,
                        lastModified: fechaUltimaModificacion,
                        size: item.size
                    };
                })
            );

            const notebooksOrdenados = notebooksList
                .sort((a: Notebook, b: Notebook) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                .slice(0, maxItems);

            setNotebooks(notebooksOrdenados);
            setError(null);
        } catch (err) {
            console.error('Error fetching notebooks:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotebooks();
    }, [maxItems]);

    const cssId = elementId || null;
    const cssClasses = mapStyles(styles?.self);
    const cssStyles = {
        ...(styles?.self?.margin && { margin: styles.self.margin }),
        ...(styles?.self?.padding && { padding: styles.self.padding }),
        ...(styles?.self?.borderRadius && { borderRadius: styles.self.borderRadius }),
        ...(styles?.self?.borderWidth && { borderWidth: styles.self.borderWidth }),
        ...(styles?.self?.borderStyle && { borderStyle: styles.self.borderStyle }),
        ...(styles?.self?.borderColor && { borderColor: styles.self.borderColor }),
        ...(styles?.self?.textAlign && { textAlign: styles.self.textAlign })
    };

    if (loading) {
        return (
            <div id={cssId} className={cssClasses} style={cssStyles} {...getDataAttrs(props)}>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando notebooks...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id={cssId} className={cssClasses} style={cssStyles} {...getDataAttrs(props)}>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <strong>Error:</strong> {error}
                        </div>
                        <button 
                            onClick={fetchNotebooks}
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (notebooks.length === 0) {
        return (
            <div id={cssId} className={cssClasses} style={cssStyles} {...getDataAttrs(props)}>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <p className="text-gray-600">No se encontraron notebooks disponibles.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            id={cssId} 
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                padding: '3rem 1rem'
            }}
            {...getDataAttrs(props)}
        >
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <div style={{marginBottom: '3rem', textAlign: 'center'}}>
                    <h2 style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>{title}</h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#6b7280',
                        textAlign: 'center'
                    }}>{subtitle}</p>
                </div>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1000px',
                        width: '100%',
                        margin: '0 auto'
                    }}>
                        {notebooks.map((notebook, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb',
                                transition: 'box-shadow 0.3s ease'
                            }}>
                                <div style={{padding: '1.5rem'}}>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        marginBottom: '1rem',
                                        color: '#111827',
                                        textAlign: 'center'
                                    }}>{notebook.name}</h3>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: '#6b7280',
                                        marginBottom: '1rem'
                                    }}>
                                        <p style={{marginBottom: '0.25rem'}}>
                                            <strong>Última actualización:</strong> {formatDate(notebook.lastModified)}
                                        </p>
                                        <p>
                                            <strong>Tamaño:</strong> {(notebook.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    <div style={{textAlign: 'center'}}>
                                        <a 
                                            href={notebook.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#2563eb',
                                                color: 'white',
                                                borderRadius: '0.25rem',
                                                textDecoration: 'none',
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                        >
                                            Ver Notebook
                                            <svg style={{marginLeft: '0.5rem', width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div style={{marginTop: '3rem', textAlign: 'center'}}>
                    <a 
                        href="https://yannicklaguna.github.io/Notebooks/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#374151',
                            color: 'white',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                    >
                        Ver todos los notebooks
                        <svg style={{marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
} 