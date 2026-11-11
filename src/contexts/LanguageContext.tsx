/**
 * LanguageContext — idioma activo de la landing (en/es).
 *
 * Responsabilidad: exponer `locale` y `setLocale` a los componentes (selector de
 * idioma, textos traducidos). La fuente de verdad es la ruta (`router.locale`, i18n de
 * Next en next.config.js), así el HTML del servidor ya sale en el idioma correcto y
 * coincide con la URL que indexa Google (/x/ en inglés, /es/x/ en español).
 * Relación: _app.js (proveedor), componentes que llaman a useLanguage().
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface LanguageContextType {
    locale: string;
    setLocale: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const locale = router.locale || 'en';

    // Cambiar de idioma = navegar a la misma página en el otro locale
    const setLocale = (nuevoLocale: string) => {
        router.push(router.asPath, router.asPath, { locale: nuevoLocale });
    };

    return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
