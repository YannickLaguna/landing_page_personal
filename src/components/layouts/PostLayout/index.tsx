/**
 * PostLayout
 *
 * Responsabilidad: layout de cada entrada de blog individual.
 * Muestra cabecera (fecha, autor, título), imagen destacada, y luego:
 *   - Si el post tiene `notebookUrl`: renderiza un iframe apuntando al HTML de GitHub Pages
 *     (que ya incluye LaTeX, gráficas y código resaltado del notebook de Jupyter).
 *   - Si no hay `notebookUrl`: renderiza el `markdownContent` del post normalmente.
 * Al final del artículo aparece siempre el widget de comentarios Giscus.
 *
 * Relaciones:
 * - Usa: BaseLayout, DynamicComponent, HighlightedPreBlock, GiscusComments
 * - Alimentado por: content/pages/blog/*.es.md vía resolveStaticProps
 * - El campo `notebookUrl` es generado por: scripts/generate-blog-from-notebooks.js
 */
import classNames from 'classnames';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import * as React from 'react';

import { DynamicComponent } from '@/components/components-registry';
import GiscusComments from '@/components/molecules/GiscusComments';
import { PageComponentProps, PostLayout } from '@/types';
import HighlightedPreBlock from '@/utils/highlighted-markdown';
import BaseLayout from '../BaseLayout';

type ComponentProps = PageComponentProps & PostLayout;

const Component: React.FC<ComponentProps> = (props) => {
    const { title, date, author, markdownContent, media, bottomSections = [], notebookUrl, githubUrl } = props;
    const dateTimeAttr = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = dayjs(date).format('YYYY-MM-DD');

    return (
        <BaseLayout {...props}>
            <article className="px-4 py-14 lg:py-20">
                <div className="max-w-5xl mx-auto mb-6">
                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Blog
                    </a>
                </div>
                <header className="max-w-5xl mx-auto mb-10 sm:mb-14">
                    <div className="mb-6 uppercase">
                        <time dateTime={dateTimeAttr}>{formattedDate}</time>
                        {author && (
                            <>
                                {' | '}
                                {author.firstName} {author.lastName}
                            </>
                        )}
                    </div>
                    <h1 className="text-5xl sm:text-6xl">{title}</h1>
                </header>
                {media && (
                    <figure className="max-w-5xl mx-auto mb-10 sm:mb-14">
                        <PostMedia media={media} />
                    </figure>
                )}
                {notebookUrl ? (
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-end mb-3">
                            <a
                                href={githubUrl || notebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors"
                            >
                                Abrir notebook
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                        <iframe
                            src={notebookUrl}
                            className="w-full border-0"
                            style={{ height: '80vh', minHeight: '600px' }}
                            loading="lazy"
                            title={title}
                        />
                    </div>
                ) : markdownContent ? (
                    <Markdown
                        options={{ forceBlock: true, overrides: { pre: HighlightedPreBlock } }}
                        className="max-w-3xl mx-auto prose sm:prose-lg"
                    >
                        {markdownContent}
                    </Markdown>
                ) : null}
                <GiscusComments />
            </article>
            {bottomSections?.map((section, index) => {
                return <DynamicComponent key={index} {...section} />;
            })}
        </BaseLayout>
    );
};
export default Component;

function PostMedia({ media }) {
    return <DynamicComponent {...media} className={classNames({ 'w-full': media.type === 'ImageBlock' })} />;
}
