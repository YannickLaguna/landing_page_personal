/**
 * Modelo Stackbit para la sección de Áreas de Interés.
 * Responsabilidad: define el esquema de contenido editable en el editor visual de Netlify
 * para la sección AreasOfInterestSection.
 * Se relaciona con: src/components/sections/AreasOfInterestSection/index.tsx,
 * PageLayout.ts (via grupo SectionModels), section-common-fields.ts
 */
import { Model } from '@stackbit/types';
import { colorFields, settingFields, settingFieldsGroup, styleFieldsGroup } from './section-common-fields';

export const AreasOfInterestSectionModel: Model = {
    type: 'object',
    name: 'AreasOfInterestSection',
    label: 'Areas of Interest Section',
    labelField: 'title',
    thumbnail: 'https://assets.stackbit.com/components/models/thumbnails/default.png',
    groups: ['SectionModels'],
    fieldGroups: [...styleFieldsGroup, ...settingFieldsGroup],
    fields: [
        {
            type: 'string',
            name: 'title',
            label: 'Título',
            default: 'Areas of Interest'
        },
        {
            type: 'string',
            name: 'subtitle',
            label: 'Subtítulo',
            default: 'Take a look at some of the things I love working on.'
        },
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
        ...colorFields,
        ...settingFields,
        {
            type: 'style',
            name: 'styles',
            styles: {
                self: {
                    height: ['auto', 'screen'],
                    width: ['narrow', 'wide', 'full'],
                    margin: ['tw0:96'],
                    padding: ['tw0:96'],
                    borderRadius: '*',
                    borderWidth: ['0:8'],
                    borderStyle: '*',
                    borderColor: [
                        { value: 'border-(--theme-light)', label: 'Light color', color: '$light' },
                        { value: 'border-(--theme-dark)', label: 'Dark color', color: '$dark' },
                        { value: 'border-(--theme-primary)', label: 'Primary color', color: '$primary' },
                        { value: 'border-(--theme-secondary)', label: 'Secondary color', color: '$secondary' },
                        { value: 'border-(--theme-complementary)', label: 'Complementary color', color: '$complementary' }
                    ],
                    textAlign: ['left', 'center', 'right']
                }
            },
            default: {
                self: {
                    height: 'auto',
                    width: 'wide',
                    padding: ['pt-24', 'pb-24', 'pl-4', 'pr-4'],
                    borderRadius: 'none',
                    borderWidth: 0,
                    borderStyle: 'none',
                    borderColor: 'border-(--theme-dark)',
                    textAlign: 'center'
                }
            }
        }
    ]
}; 