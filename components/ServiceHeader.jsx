"use client";

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { STUDIO } from '@/lib/studio';
import { Globe } from 'lucide-react';

export default function ServiceHeader() {
  const { locale, t, setLocale } = useI18n();
  const name = locale === 'ar' ? STUDIO.nameAr : STUDIO.nameEn;

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white text-brand-dark border-b border-brand-border backdrop-blur-md bg-opacity-95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col flex-shrink-0">
          <span className="font-urbanist tracking-[0.1em] font-extrabold text-xl sm:text-2xl text-brand-navy select-none">
            {name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-brand-dark uppercase tracking-wider">
          <a href="#demos" className="hover:text-brand-red transition-colors">
            {t('svc_nav_demos')}
          </a>
          <a href="#how" className="hover:text-brand-red transition-colors">
            {t('svc_nav_how')}
          </a>
          <a href="#request" className="hover:text-brand-red transition-colors">
            {t('svc_nav_request')}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-[11px] font-medium text-brand-gray hover:text-brand-navy transition-colors border border-brand-border rounded-full px-3 py-1.5 hover:border-brand-navy hover:bg-brand-sec"
            aria-label={t('toggle_language')}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'EN' : 'AR'}</span>
          </button>

          <a
            href="#request"
            className="hidden sm:inline-flex items-center px-5 py-2.5 bg-brand-navy text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-red rounded-full transition-all duration-300"
          >
            {t('svc_cta_header')}
          </a>
        </div>
      </div>
    </header>
  );
}
