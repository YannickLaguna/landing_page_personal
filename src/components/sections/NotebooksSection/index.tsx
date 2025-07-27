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
            const notebooksList = data
                .filter((item: any) => item.type === 'file' && item.name.endsWith('.ipynb'))
                .map((item: any) => ({
                    name: item.name.replace('.ipynb', ''),
                    filename: item.name,
                    url: `https://yannicklaguna.github.io/Notebooks/${item.name}`,
                    lastModified: item.updated_at,
                    size: item.size
                }))
                .sort((a: Notebook, b: Notebook) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                .slice(0, maxItems);

            setNotebooks(notebooksList);
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
        <div id={cssId} className={cssClasses} style={cssStyles} {...getDataAttrs(props)}>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{title}</h2>
                    <p className="text-xl text-gray-600">{subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {notebooks.map((notebook, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{notebook.name}</h3>
                                <p className="text-gray-600 mb-4">
                                    Notebook de Jupyter con análisis de datos y machine learning.
                                </p>
                                <div className="text-sm text-gray-500 mb-4">
                                    <p>Última actualización: {new Date(notebook.lastModified).toLocaleDateString('es-ES')}</p>
                                    <p>Tamaño: {(notebook.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <a 
                                    href={notebook.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Ver Notebook
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <a 
                        href="https://yannicklaguna.github.io/Notebooks/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
                    >
                        Ver todos los notebooks
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
} 