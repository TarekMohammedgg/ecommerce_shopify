"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { ShoppingBag, Globe, Search, User } from 'lucide-react';
import { useState } from 'react';
import BrandMark from '@/components/BrandMark';

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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col flex-shrink-0">
          <BrandMark className="font-urbanist tracking-[0.1em] font-extrabold text-2xl text-brand-navy select-none" />
        </Link>

        {/* Middle Wide Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:flex items-center gap-2 border border-brand-border rounded-lg bg-brand-sec px-3 py-1.5 focus-within:border-brand-navy focus-within:ring-1 focus-within:ring-brand-navy transition-all">
          <Search className="w-4 h-4 text-brand-gray flex-shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder={locale === 'en' ? "Search product or brand here..." : "ابحث عن المنتجات أو العلامات التجارية هنا..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent text-xs text-brand-dark placeholder-brand-gray focus:outline-none min-w-0 text-start rtl:text-end"
          />
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-brand-gray hover:text-brand-navy transition-colors border border-brand-border rounded-full px-3 py-1.5 hover:border-brand-navy hover:bg-brand-sec"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'EN' : 'AR'}</span>
          </button>

          {/* Profile Button */}
          <Link href="/profile" className="hidden sm:block" aria-label="Account">
            {isLoggedIn && customer ? (
              <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-urbanist font-extrabold text-xs hover:ring-2 hover:ring-brand-red transition-all overflow-hidden">
                {customer.firstName?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
              </div>
            ) : (
              <span className="text-brand-dark hover:text-brand-red transition-colors">
                <User className="w-5 h-5" />
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1 px-4 py-2 border border-brand-border rounded-full hover:border-brand-navy transition-all hover:bg-brand-sec"
            aria-label="Open cart"
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

      {/* Navigation Submenu */}
      <div className="max-w-7xl mx-auto px-6 border-t border-brand-border hidden md:flex items-center justify-between py-2.5 text-xs font-semibold text-brand-dark uppercase tracking-wider">
        <div className="flex gap-8 overflow-x-auto">
          <Link href="/shop" className={`hover:text-brand-red transition-colors flex-shrink-0 ${pathname === '/shop' ? 'text-brand-red' : ''}`}>
            {t('nav_shop')}
          </Link>
          <Link href="/shop?category=T-SHIRTS" className="hover:text-brand-red transition-colors flex-shrink-0">
            {t('filter_t_shirts')}
          </Link>
          <Link href="/shop?category=SHIRTS" className="hover:text-brand-red transition-colors flex-shrink-0">
            {t('filter_shirts')}
          </Link>
          <Link href="/shop?category=HOODIES" className="hover:text-brand-red transition-colors flex-shrink-0">
            {t('filter_hoodies')}
          </Link>
          <Link href="/shop?category=JACKETS" className="hover:text-brand-red transition-colors flex-shrink-0">
            {t('filter_jackets')}
          </Link>
          <Link href="/shop?category=PANTS" className="hover:text-brand-red transition-colors flex-shrink-0">
            {t('filter_pants')}
          </Link>
          <Link href="/shop?category=DRESSES" className="hover:text-brand-red transition-colors flex-shrink-0">
            {t('filter_dresses')}
          </Link>
          <Link href="/#manifesto" className="hover:text-brand-red transition-colors flex-shrink-0">
            {t('nav_about')}
          </Link>
        </div>
      </div>
    </header>
  );
}
