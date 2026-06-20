"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { ShoppingBag, Globe, Search, User } from 'lucide-react';
import { useState } from 'react';
import BrandMark from '@/components/BrandMark';

const NAV_LINKS = [
  { href: '/shop', labelKey: 'nav_shop', isActive: (pathname) => pathname === '/shop' },
  { href: '/shop?category=T-SHIRTS', labelKey: 'filter_t_shirts' },
  { href: '/shop?category=SHIRTS', labelKey: 'filter_shirts' },
  { href: '/shop?category=HOODIES', labelKey: 'filter_hoodies' },
  { href: '/shop?category=JACKETS', labelKey: 'filter_jackets' },
  { href: '/shop?category=PANTS', labelKey: 'filter_pants' },
  { href: '/shop?category=DRESSES', labelKey: 'filter_dresses' },
  { href: '/#manifesto', labelKey: 'nav_about' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t, setLocale } = useI18n();
  const { setCartOpen, cartCount } = useCart();
  const { isLoggedIn, customer } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white text-brand-dark border-b border-brand-border backdrop-blur-md bg-opacity-95 shadow-sm">
      

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col flex-shrink-0">
          <BrandMark className="font-urbanist tracking-[0.1em] font-extrabold text-2xl text-brand-navy select-none" />
        </Link>

        {/* Middle Wide Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:flex items-center gap-2 border border-brand-border rounded-lg bg-brand-sec px-3 py-1.5 focus-within:border-brand-navy focus-within:ring-1 focus-within:ring-brand-navy transition-all">
          <Search className="w-4 h-4 text-brand-gray flex-shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent text-xs text-brand-dark placeholder-brand-gray focus:outline-none min-w-0 text-start rtl:text-end"
          />
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-brand-gray hover:text-brand-navy transition-colors border border-brand-border rounded-full px-3 py-1.5 hover:border-brand-navy hover:bg-brand-sec"
            aria-label={t('toggle_language')}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'EN' : 'AR'}</span>
          </button>

          {/* Profile Button */}
          <Link
            href="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-white text-brand-dark transition-all hover:border-brand-navy hover:text-brand-red hover:bg-brand-sec"
            aria-label={t('account_label')}
          >
            {isLoggedIn && customer ? (
              <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-urbanist font-extrabold text-xs transition-all overflow-hidden">
                {customer.firstName?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
              </div>
            ) : (
              <span className="transition-colors">
                <User className="w-5 h-5" />
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-11 min-w-11 items-center justify-center gap-1 rounded-full border border-brand-border px-3 sm:px-4 py-2 hover:border-brand-navy transition-all hover:bg-brand-sec"
            aria-label={t('open_cart')}
          >
            <ShoppingBag className="w-4 h-4 text-brand-dark" />
            {cartCount > 0 && (
              <span className="bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category nav — horizontal scroll on mobile, full row on desktop */}
      <nav
        aria-label={t('nav_shop')}
        className="relative border-t border-brand-border"
      >
        <div
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-8 bg-gradient-to-r from-white from-30% to-transparent md:hidden"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-8 bg-gradient-to-l from-white from-30% to-transparent md:hidden"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-none scroll-smooth px-4 md:px-6 [-webkit-overflow-scrolling:touch]">
          <div className="flex w-max md:w-full items-center gap-1 md:gap-0 md:justify-between py-2 md:py-2.5 text-xs font-semibold text-brand-dark uppercase tracking-wider">
            {NAV_LINKS.map(({ href, labelKey, isActive }) => {
              const active = isActive?.(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex-shrink-0 rounded-full px-3 py-2 md:px-0 md:py-0 md:rounded-none transition-colors hover:text-brand-red active:bg-brand-sec md:active:bg-transparent ${
                    active ? 'text-brand-red' : ''
                  }`}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
