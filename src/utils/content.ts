import { allModels } from '.stackbit/models';
import type { ContentObject } from '@/types';
import * as types from '@/types';
import { PAGE_MODEL_NAMES, PageModelType } from '@/types/generated';
import frontmatter from 'front-matter';
import * as fs from 'fs';
import glob from 'glob';
import path from 'path';
import { isDev } from './common';

const contentBaseDir = 'content';
const pagesBaseDir = contentBaseDir + '/pages';

// Función para obtener el sufijo del idioma
function getLanguageSuffix(locale: string): string {
    return locale === 'es' ? '.es' : '';
}

const allReferenceFields = {};
allModels.forEach((model) => {
    model.fields.forEach((field) => {
        if (field.type === 'reference' || (field.type === 'list' && field.items?.type === 'reference')) {
            allReferenceFields[model.name + ':' + field.name] = true;
        }
    });
});

function isRefField(modelName: string, fieldName: string) {
    return !!allReferenceFields[modelName + ':' + fieldName];
}

const supportedFileTypes = ['md', 'json'];
function contentFilesInPath(dir: string) {
    const globPattern = `${dir}/**/*.{${supportedFileTypes.join(',')}}`;
    return glob.sync(globPattern);
}

function readContent(file: string): ContentObject {
    const rawContent = fs.readFileSync(file, 'utf8');
    let content = null;
    switch (path.extname(file).substring(1)) {
        case 'md':
            const parsedMd = frontmatter<Record<string, any>>(rawContent);
            content = {
                ...parsedMd.attributes,
                markdownContent: parsedMd.body
            };
            break;
        case 'json':
            content = JSON.parse(rawContent);
            break;
        default:
            throw Error(`Unhandled file type: ${file}`);
    }

    content.__metadata = {
        id: file,
        modelName: content.type
    };

    return content;
}

function resolveReferences(content: ContentObject, fileToContent: Record<string, ContentObject>) {
    if (!content || !content.type) return;

    const modelName = content.type;
    if (!content.__metadata) content.__metadata = { modelName };

    for (const fieldName in content) {
        let fieldValue = content[fieldName];
        if (!fieldValue) continue;

        const isRef = isRefField(modelName, fieldName);
        if (Array.isArray(fieldValue)) {
            if (fieldValue.length === 0) continue;
            if (isRef && typeof fieldValue[0] === 'string') {
                fieldValue = fieldValue.map((filename) => fileToContent[filename.replace(/\\/g, '/')]);
                content[fieldName] = fieldValue;
            }
            if (typeof fieldValue[0] === 'object') {
                fieldValue.forEach((o) => resolveReferences(o, fileToContent));
            }
        } else {
            if (isRef && typeof fieldValue === 'string') {
                fieldValue = fileToContent[fieldValue.replace(/\\/g, '/')];
                content[fieldName] = fieldValue;
            }
            if (typeof fieldValue === 'object') {
                resolveReferences(fieldValue, fileToContent);
            }
        }
    }
}

function contentUrl(obj: ContentObject) {
    const fileName = obj.__metadata.id;
    if (!fileName.startsWith(pagesBaseDir)) {
        console.warn('Content file', fileName, 'expected to be a page, but is not under', pagesBaseDir);
        return;
    }

    let url = fileName.slice(pagesBaseDir.length);
    url = url.split('.')[0];
    if (url.endsWith('/index')) {
        url = url.slice(0, -6) || '/';
    }
    return url;
}

export function allContent(locale: string = 'en'): ContentObject[] {
    let allObjects = contentFilesInPath(contentBaseDir).map((file) => readContent(file));

    // Filtrar archivos de configuración por locale.
    // Para español: usar .es.json si existe; si no, usar el .json genérico como fallback.
    const configObjects = allObjects.filter((obj) => {
        const id = obj.__metadata.id;
        if (!id.includes('/data/')) return false;
        if (locale === 'es') {
            if (id.endsWith('.es.json')) return true;
            // Incluir .json genéricos que no tienen versión .es.json (ej. style.json)
            const esVersion = id.replace(/\.json$/, '.es.json');
            return !allObjects.some((o) => o.__metadata.id === esVersion);
        }
        return !id.endsWith('.es.json');
    });

    // Filtrar páginas por idioma
    const pageObjects = allObjects.filter((obj) => {
        const fileName = obj.__metadata.id;
        if (fileName.includes('/data/')) return false;
        if (locale === 'es') {
            return fileName.endsWith('.es.md') || fileName.endsWith('.es.json');
        }
        // Inglés: solo archivos sin sufijo .es
        return !fileName.endsWith('.es.md') && !fileName.endsWith('.es.json');
    });

    let objects = [...configObjects, ...pageObjects];

    allPages(objects).forEach((obj) => {
        obj.__metadata.urlPath = contentUrl(obj);
    });

    const fileToContent: Record<string, ContentObject> = Object.fromEntries(
        objects.map((e) => [e.__metadata.id.replace(/\\/g, '/'), e])
    );
    objects.forEach((e) => resolveReferences(e, fileToContent));

    objects = objects.map((e) => deepClone(e));

    // Anotamos el español, que ahora es la fuente primaria del editor visual de Stackbit.
    // Los archivos .es.md y config.es.json están registrados en GitContentSource,
    // por lo que las anotaciones permiten la edición directa desde el editor.
    if (locale === 'es') {
        objects.forEach((e) => annotateContentObject(e));
    }

    return objects;
}

export function allPages(allData: ContentObject[]): PageModelType[] {
    return allData.filter((obj) => {
        return PAGE_MODEL_NAMES.includes(obj.__metadata.modelName);
    }) as PageModelType[];
}

/*
Add annotation data to a content object and its nested children.
*/
const skipList = ['__metadata'];
const logAnnotations = false;

function annotateContentObject(o: any, prefix = '', depth = 0) {
    if (!isDev || !o || typeof o !== 'object' || !o.type || skipList.includes(prefix)) return;

    const depthPrefix = '--'.repeat(depth);
    if (depth === 0) {
        if (o.__metadata?.id) {
            // path.normalize produce backslashes en Windows, lo que coincide con los IDs
            // que @stackbit/cms-git asigna internamente (construidos con path.join).
            o[types.objectIdAttr] = path.normalize(o.__metadata.id);
            if (logAnnotations) console.log('[annotateContentObject] added object ID:', depthPrefix, o[types.objectIdAttr]);
        } else {
            if (logAnnotations) console.warn('[annotateContentObject] NO object ID:', o);
        }
    } else {
        o[types.fieldPathAttr] = prefix;
        if (logAnnotations) console.log('[annotateContentObject] added field path:', depthPrefix, o[types.fieldPathAttr]);
    }

    Object.entries(o).forEach(([k, v]) => {
        if (v && typeof v === 'object') {
            const fieldPrefix = (prefix ? prefix + '.' : '') + k;
            if (Array.isArray(v)) {
                v.forEach((e, idx) => {
                    const elementPrefix = fieldPrefix + '.' + idx;
                    annotateContentObject(e, elementPrefix, depth + 1);
                });
            } else {
                annotateContentObject(v, fieldPrefix, depth + 1);
            }
        }
    });
}

function deepClone(o: object) {
    return JSON.parse(JSON.stringify(o));
}
