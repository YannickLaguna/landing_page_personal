import { BaseContentObject, PageModelType } from '@/types';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import * as React from 'react';

import { Annotated } from '@/components/Annotated';

/**
 * Link — enlace universal de la landing: NextLink para rutas internas y <a> para externas.
 * Los enlaces externos llevan `data-umami-event` para medir conversiones en Umami
 * (components/atoms/Analitica): reservar cita en Cal.com, ir a GrowSave, escribir un email.
 */
type RegularLinkProps = React.PropsWithChildren & NextLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/** Nombre del evento de Umami según el destino de un enlace externo. */
function eventoAnalitica(href: string): string {
    if (href.includes('cal.com')) return 'cta-reservar-cita';
    if (href.includes('growsave.ylaguna.com')) return 'ir-a-growsave';
    if (href.startsWith('mailto:')) return 'contacto-email';
    return 'enlace-externo';
}

type LinkProps = RegularLinkProps | (Omit<RegularLinkProps, 'href'> & { href: PageModelType });

const Link: React.FC<LinkProps> = (props) => {
    const { children, href: hrefArgument, ...other } = props;
    let hrefString: string = null;
    let hrefContent: BaseContentObject = null;

    if (typeof hrefArgument === 'string') {
        hrefString = hrefArgument;
    } else {
        hrefContent = hrefArgument;
        hrefString = hrefArgument.__metadata.urlPath;
    }

    // Pass Any internal link to Next.js Link, for anything else, use <a> tag
    const internal = /^\/(?!\/)/.test(hrefString);
    const linkTag = internal ? (
        <NextLink href={hrefString} {...other}>
            {children}
        </NextLink>
    ) : (
        <a href={hrefString} data-umami-event={eventoAnalitica(hrefString || '')} data-umami-event-destino={hrefString} {...other}>
            {children}
        </a>
    );

    return hrefContent ? <Annotated content={hrefContent}>{linkTag}</Annotated> : linkTag;
};

export default Link;
