import React from 'react';
import classNames from 'classnames';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageToggleProps {
    className?: string;
    inMobileMenu?: boolean;
}

export default function LanguageToggle({ className, inMobileMenu = false }: LanguageToggleProps) {
    const { locale, setLocale } = useLanguage();

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'es' : 'en';
        setLocale(newLocale);
    };

    const getLanguageLabel = () => {
        return locale === 'en' ? 'ES' : 'EN';
    };

    return (
        <button
            onClick={toggleLanguage}
            className={classNames(
                'flex items-center justify-center transition-colors duration-200 hover:opacity-80',
                inMobileMenu 
                    ? 'text-xl p-5 w-full' 
                    : 'p-4 link-fill',
                className
            )}
            aria-label="Cambiar idioma"
            title="Cambiar idioma"
        >
            <span className="text-sm font-medium">
                {getLanguageLabel()}
            </span>
        </button>
    );
} 