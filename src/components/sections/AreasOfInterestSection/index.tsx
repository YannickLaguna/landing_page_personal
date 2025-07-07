import { iconMap } from '@/components/svgs';
import classNames from 'classnames';
import React from 'react';
import Section from '../Section';

/**
 * Sección de Áreas de Interés para mostrar ítems con icono, título y descripción.
 * Compatible con Netlify Create.
 * @param {object} props
 * @param {string} props.title - Título de la sección
 * @param {string} props.subtitle - Subtítulo de la sección
 * @param {Array} props.interests - Lista de áreas de interés (icon, title, description)
 * @param {string} props.colors - Esquema de colores
 * @param {object} props.styles - Estilos personalizados
 */
export default function AreasOfInterestSection(props) {
    const { title, subtitle, interests = [], colors, styles = {}, elementId } = props;
    return (
        <Section elementId={elementId} colors={colors} styles={styles?.self}>
            <div className={classNames('max-w-4xl mx-auto text-center mb-12')}>
                {title && <h2 className="text-3xl font-bold mb-2">{title}</h2>}
                {subtitle && <p className="text-lg text-gray-600 mb-8">{subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {interests.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md h-full">
                        {item.icon && iconMap[item.icon] && (
                            <span className="mb-4 text-4xl">
                                {React.createElement(iconMap[item.icon])}
                            </span>
                        )}
                        <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-base">{item.description}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
} 