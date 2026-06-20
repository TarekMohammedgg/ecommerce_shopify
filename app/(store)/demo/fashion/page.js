"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useProducts } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { ArrowRight, ArrowLeft, Shirt, Flame, Sparkles } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';

export default function HomePage() {
  const { t, locale } = useI18n();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [activeChip, setActiveChip] = useState("BEST_SELLER");

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 17, seconds: 56 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Category list circles (aligned with CSV product types)
  const categories = [
    { name: t('filter_t_shirts'), icon: <Shirt className="w-6 h-6 text-brand-dark" />, path: "/shop?category=T-SHIRTS" },
    { name: t('filter_hoodies'), icon: <Flame className="w-6 h-6 text-brand-dark" />, path: "/shop?category=HOODIES" },
    { name: t('filter_pants'), icon: <Shirt className="w-6 h-6 text-brand-dark rotate-180" />, path: "/shop?category=PANTS" },
    { name: t('filter_shirts'), icon: <Shirt className="w-6 h-6 text-brand-dark opacity-60" />, path: "/shop?category=SHIRTS" },
    { name: t('filter_jackets'), icon: <Flame className="w-6 h-6 text-brand-dark" />, path: "/shop?category=JACKETS" },
    { name: t('filter_dresses'), icon: <Sparkles className="w-6 h-6 text-brand-dark" />, path: "/shop?category=DRESSES" },
  ];

  // Filters for "Todays For You!"
  const filterChips = [
    { key: "BEST_SELLER", label: t('best_seller') },
    { key: "KEEP_STYLISH", label: t('keep_stylish') },
    { key: "SPECIAL_DISCOUNT", label: t('special_discount') },
    { key: "OFFICIAL_STORE", label: t('official_store') }
  ];

  const { toggleWishlist, isLiked } = useWishlist();

  // Filter products for the "Todays For You" section reactively based on active filter chip
  const filteredProductsForYou = products.filter(product => {
    if (!activeChip) return true;
    const tagToSearch = activeChip.toLowerCase().replace('_', ' ');
    return product.tags?.some(tag => tag.toLowerCase() === tagToSearch);
  });

  // Formatting helper for countdown number
  const formatNum = (n) => String(n).padStart(2, '0');

  return (
    <div className="w-full flex flex-col bg-white space-y-12 pb-16">
      
      {/* 1. Hero Promo Section (Split Banner) */}
      <section className="max-w-7xl mx-auto px-6 w-full pt-8 animate-slide-up">
        <div className="w-full bg-brand-sec rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12 relative overflow-hidden">
          {/* Back grid overlay */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent pointer-events-none" />

          {/* Left Text Promotion */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs md:text-sm font-bold text-brand-red tracking-wider uppercase block">
              {t('hero_kicker')}
            </span>
            <h1 className="font-urbanist font-extrabold tracking-tight text-4xl md:text-6xl text-brand-navy leading-none">
              {t('hero_title_1')}<br />
              {t('hero_title_2')}
            </h1>
            <p className="text-brand-gray text-sm md:text-base max-w-md">
              {t('hero_subtitle')}
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-red rounded-full transition-all duration-300"
              >
                <span>{t('btn_shop_now')}</span>
                {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>

          {/* Right Floating Product Gallery */}
          <div className="lg:col-span-5 relative h-[300px] md:h-[380px] w-full flex items-center justify-center">
            {/* White T-shirt mockup */}
            <div className="absolute w-[200px] h-[260px] bg-white border border-brand-border rounded-xl shadow-md transform -rotate-6 translate-x-[-40px] z-10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80" 
                alt="Product Mock" 
                className="w-full h-full object-cover filter sepia-[5%]" 
              />
            </div>
            
            {/* Grey T-shirt mockup */}
            <div className="absolute w-[200px] h-[260px] bg-white border border-brand-border rounded-xl shadow-lg transform rotate-6 translate-x-[40px] z-20 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80" 
                alt="Product Mock" 
                className="w-full h-full object-cover filter sepia-[5%]" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Circle Categories Bar */}
      <section className="max-w-7xl mx-auto px-6 w-full py-4 border-b border-brand-border animate-slide-up">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-around gap-6 overflow-x-auto pb-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.path} className="flex flex-col items-center gap-3 text-center flex-shrink-0 group">
              <div className="w-16 h-16 rounded-full bg-brand-sec border border-brand-border flex items-center justify-center group-hover:border-brand-red group-hover:bg-white shadow-sm transition-all duration-300">
                {cat.icon}
              </div>
              <span className="text-[11px] font-semibold text-brand-dark uppercase tracking-wider group-hover:text-brand-red transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale Section with Countdown */}
      <section className="max-w-7xl mx-auto px-6 w-full space-y-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-brand-navy">
              <span className="font-urbanist font-extrabold text-xl md:text-2xl uppercase tracking-wider">
                {t('flash_sale')}
              </span>
            </div>
            {/* Ticking Countdown Circular Red Badges */}
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 bg-brand-red rounded-full flex items-center justify-center text-xs font-bold text-white" suppressHydrationWarning>
                {formatNum(timeLeft.hours)}
              </div>
              <span className="text-brand-red font-bold">:</span>
              <div className="w-7 h-7 bg-brand-red rounded-full flex items-center justify-center text-xs font-bold text-white" suppressHydrationWarning>
                {formatNum(timeLeft.minutes)}
              </div>
              <span className="text-brand-red font-bold">:</span>
              <div className="w-7 h-7 bg-brand-red rounded-full flex items-center justify-center text-xs font-bold text-white" suppressHydrationWarning>
                {formatNum(timeLeft.seconds)}
              </div>
            </div>
          </div>
          <Link href="/shop" className="text-xs font-bold text-brand-navy hover:text-brand-red uppercase tracking-widest">
            {t('view_all')}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product, idx) => {
              const originalPrice = Math.round(product.price * 1.4);
              const progressPercentage = idx === 0 ? 90 : idx === 1 ? 70 : idx === 2 ? 50 : 20;
              const soldLabel = idx === 0 ? t('sold_1') : idx === 1 ? t('sold_2') : idx === 2 ? t('sold_3') : t('sold_4');

              return (
                <ProductCard
                  key={`${product.id}-${locale}`}
                  product={product}
                  locale={locale}
                  t={t}
                  liked={isLiked(product.id)}
                  onToggleWishlist={toggleWishlist}
                  showCategory={false}
                  compareAtPrice={originalPrice}
                  priceVariant="sale"
                  progressPercentage={progressPercentage}
                  soldLabel={soldLabel}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 4. "Todays For You!" Product Selection Section */}
      <section className="max-w-7xl mx-auto px-6 w-full space-y-8 animate-slide-up">
        <div className="space-y-4">
          <h2 className="font-urbanist font-extrabold text-xl md:text-2xl uppercase tracking-wider text-brand-navy">
            {t('todays_for_you')}
          </h2>
          
          {/* Active filter tags (Pill/Capsule chips) */}
          <div className="flex flex-wrap gap-3">
            {filterChips.map((chip) => {
              const isActive = activeChip === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setActiveChip(chip.key)}
                  className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 ${
                    isActive 
                      ? 'bg-brand-navy text-white border-brand-navy' 
                      : 'bg-white text-brand-gray border-brand-border hover:border-brand-navy hover:text-brand-navy'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredProductsForYou.slice(0, 8).map((product) => (
              <ProductCard
                key={`${product.id}-${locale}`}
                product={product}
                locale={locale}
                t={t}
                liked={isLiked(product.id)}
                onToggleWishlist={toggleWishlist}
                onQuickAdd={(p) => addToCart(p, 1, p.colors[0], p.sizes[0])}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Manifesto / Concept Banner (Clean layout replacement) */}
      <section id="manifesto" className="max-w-7xl mx-auto px-6 w-full pt-8">
        <div className="w-full bg-brand-navy text-white rounded-2xl p-8 md:p-16 text-center space-y-6">
          <span className="text-xs font-bold text-brand-red tracking-widest uppercase block">
            {t('manifesto_kicker')}
          </span>
          <h2 className="font-urbanist font-extrabold text-2xl md:text-4xl uppercase tracking-wider max-w-xl mx-auto leading-tight">
            {t('manifesto_title')}
          </h2>
          <p className="text-brand-gray text-xs md:text-sm max-w-2xl mx-auto leading-relaxed italic">
            &quot;{t('manifesto_body_1')} {t('manifesto_body_2')}&quot;
          </p>
        </div>
      </section>

    </div>
  );
}
