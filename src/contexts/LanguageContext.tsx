import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface LanguageContextType {
    locale: string;
    setLocale: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [locale, setLocaleState] = useState('en');

    useEffect(() => {
        const savedLocale = localStorage.getItem('preferred-locale');
        const routerLocale = router.locale || 'en';
        const initialLocale = savedLocale || routerLocale;
        setLocaleState(initialLocale);
    }, [router.locale]);

    const setLocale = (newLocale: string) => {
        setLocaleState(newLocale);
        localStorage.setItem('preferred-locale', newLocale);
        router.push(router.asPath, router.asPath, { locale: newLocale });
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 