"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { STUDIO } from '@/lib/studio';
import { Globe, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#demos', labelKey: 'svc_nav_demos' },
  { href: '#how', labelKey: 'svc_nav_how' },
  { href: '#request', labelKey: 'svc_nav_request' },
];

export default function ServiceHeader() {
  const { locale, t, setLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = locale === 'ar' ? STUDIO.nameAr : STUDIO.nameEn;

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full min-w-0 bg-white text-brand-dark border-b border-brand-border backdrop-blur-md bg-opacity-95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 min-w-0">
          <Link href="/" className="min-w-0 flex-shrink flex items-center gap-2.5">
            <img src="/brand/target_logo.svg" alt="Tajer Logo" className="w-8 h-8 object-contain" />
            <span className="block font-urbanist tracking-[0.1em] font-extrabold text-xl sm:text-2xl text-brand-navy select-none truncate">
              {name}
            </span>
          </Link>

          <nav
            aria-label={t('nav_shop')}
            className="hidden md:flex flex-1 justify-center items-center gap-8 text-xs font-semibold text-brand-dark uppercase tracking-wider"
          >
            {NAV_ITEMS.map(({ href, labelKey }) => (
              <a key={href} href={href} className="hover:text-brand-red transition-colors whitespace-nowrap">
                {t(labelKey)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ms-auto">
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-brand-gray hover:text-brand-navy transition-colors border border-brand-border rounded-full px-3 py-1.5 hover:border-brand-navy hover:bg-brand-sec"
              aria-label={t('toggle_language')}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'EN' : 'AR'}</span>
            </button>

            <a
              href="#request"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-brand-navy text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-red rounded-full transition-all duration-300 whitespace-nowrap"
            >
              {t('svc_cta_header')}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-dark transition-colors hover:border-brand-navy hover:bg-brand-sec"
              aria-label={t('open_menu')}
              aria-expanded={menuOpen}
              aria-controls="service-mobile-nav"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex animate-fade-in md:hidden"
          onClick={closeMenu}
        >
          <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm" />

          <div
            id="service-mobile-nav"
            className="relative w-[min(100%,20rem)] h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto ms-auto border-s border-brand-border"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav_shop')}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-brand-border mb-6">
              <span className="font-urbanist font-extrabold text-lg text-brand-navy tracking-[0.1em]">
                {name}
              </span>
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-gray transition-colors hover:border-brand-navy hover:bg-brand-sec hover:text-brand-dark"
                aria-label={t('close_menu')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              className="sm:hidden mb-4 inline-flex items-center gap-1.5 self-start text-[11px] font-medium text-brand-gray hover:text-brand-navy transition-colors border border-brand-border rounded-full px-3 py-1.5 hover:border-brand-navy hover:bg-brand-sec"
              aria-label={t('toggle_language')}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'EN' : 'AR'}</span>
            </button>

            <nav className="flex flex-col gap-1" aria-label={t('nav_shop')}>
              {NAV_ITEMS.map(({ href, labelKey }) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3.5 text-sm font-semibold text-brand-dark uppercase tracking-wider transition-colors hover:bg-brand-sec hover:text-brand-red active:bg-brand-sec"
                >
                  {t(labelKey)}
                </a>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <a
                href="#request"
                onClick={closeMenu}
                className="flex w-full items-center justify-center px-5 py-3.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-red rounded-full transition-colors"
              >
                {t('svc_cta_header')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
