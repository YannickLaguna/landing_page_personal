/**
 * API /api/publicaciones/[...path]: sirve las imágenes de cada publicación desde el
 * submódulo `Publicaciones/` (las MDX las referencian con rutas relativas).
 * Se relaciona con src/pages/publicaciones/[slug].tsx (reescribe las rutas de imagen).
 * Seguridad: sin path traversal, solo extensiones de imagen, solo ficheros regulares,
 * `nosniff` y los SVG en sandbox (un <script> dentro de un SVG no se ejecuta en ylaguna.com).
 */
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const MIME_TYPES: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};

const DIR = path.join(process.cwd(), 'Publicaciones');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const segments = req.query.path as string[];
    if (!segments || segments.length < 2) {
        return res.status(400).end('Bad request');
    }

    const resolved = path.resolve(DIR, ...segments);

    // Path traversal guard
    if (!resolved.startsWith(DIR + path.sep) && resolved !== DIR) {
        return res.status(403).end('Forbidden');
    }

    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
        return res.status(404).end('Not found');
    }

    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext];
    if (!contentType) {
        return res.status(415).end('Unsupported media type');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (ext === '.svg') {
        // Abierto directamente, el SVG queda aislado: sin scripts ni acceso al origen
        res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
    }

    const stream = fs.createReadStream(resolved);
    stream.pipe(res);
}
