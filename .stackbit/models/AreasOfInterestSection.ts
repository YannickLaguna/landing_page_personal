import { Model } from '@stackbit/types';

export const AreasOfInterestSectionModel: Model = {
    type: 'object',
    name: 'AreasOfInterestSection',
    label: 'Areas of Interest Section',
    labelField: 'title',
    fields: [
        { type: 'string', name: 'title', label: 'Título' },
        { type: 'string', name: 'subtitle', label: 'Subtítulo' },
        {
            type: 'list',
            name: 'interests',
            label: 'Áreas de Interés',
            items: {
                type: 'object',
                fields: [
                    {
                        type: 'enum',
                        name: 'icon',
                        label: 'Icono',
                        options: [
                            { label: 'Cloud', value: 'cloud' },
                            { label: 'Chat', value: 'chat' },
                            { label: 'Brain', value: 'brain' },
                            { label: 'Layers', value: 'layers' },
                            { label: 'Upload', value: 'upload' },
                            { label: 'Bar Chart', value: 'bar-chart' }
                        ]
                    },
                    { type: 'string', name: 'title', label: 'Título' },
                    { type: 'string', name: 'description', label: 'Descripción' }
                ]
            }
        },
        { type: 'string', name: 'colors', label: 'Colores', default: 'colors-f' },
        { type: 'object', name: 'styles', label: 'Estilos', fields: [] }
    ]
}; 