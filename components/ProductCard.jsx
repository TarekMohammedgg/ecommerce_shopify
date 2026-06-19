"use client";

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useProducts } from '@/lib/products';

function categoryLabel(product, t) {
  const key = `filter_${product.category.toLowerCase().replace('-', '_')}`;
  const translated = t(key);
  return translated !== key ? translated : product.category;
}

export function ProductCardSkeleton({ className = '' }) {
  return (
    <div
      className={`bg-white border border-brand-border rounded-xl overflow-hidden animate-pulse ${className}`}
      aria-hidden="true"
    >
      <div className="aspect-[4/5] bg-brand-sec" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 w-16 bg-brand-border rounded" />
        <div className="h-4 w-full bg-brand-border rounded" />
        <div className="h-4 w-2/3 bg-brand-border rounded" />
        <div className="h-5 w-20 bg-brand-border rounded" />
      </div>
    </div>
  );
}

export default function ProductCard({
  product,
  locale,
  t,
  liked = false,
  onToggleWishlist,
  onQuickAdd,
  showCategory = true,
  compareAtPrice = null,
  progressPercentage = null,
  soldLabel = null,
  priceVariant = 'default',
}) {
  const { prefetchProduct } = useProducts();
  const isArabic = locale === 'ar';
  const priceClass = priceVariant === 'sale' ? 'text-brand-red' : 'text-brand-navy';

  return (
    <article className="product-card group bg-white border border-brand-border rounded-xl overflow-hidden product-card-shadow flex flex-col h-full">
      <div className="flex flex-col flex-grow">
        <div className="relative w-full aspect-[4/5] bg-brand-sec overflow-hidden">
          <Link
            href={`/products/${product.handle}`}
            className="block w-full h-full"
            onMouseEnter={() => prefetchProduct(product.handle)}
            onFocus={() => prefetchProduct(product.handle)}
          >
            <img
              src={product.images[0]}
              alt={product.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover img-zoom filter sepia-[5%]"
            />
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-[2px] flex items-center justify-center border border-brand-border shadow-sm hover:scale-105 transition-transform z-20"
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${liked ? 'text-brand-red fill-brand-red' : 'text-brand-gray'}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow gap-3">
          <Link
            href={`/products/${product.handle}`}
            className="block space-y-2 group/link flex-grow"
            onMouseEnter={() => prefetchProduct(product.handle)}
            onFocus={() => prefetchProduct(product.handle)}
          >
            {showCategory && (
              <span
                className={`text-[10px] text-brand-gray font-bold tracking-widest block ${
                  isArabic ? 'normal-case' : 'uppercase'
                }`}
              >
                {categoryLabel(product, t)}
              </span>
            )}
            <h3
              className={`font-sans font-medium text-sm text-brand-dark leading-snug line-clamp-2 group-hover/link:text-brand-red transition-colors ${
                isArabic ? 'tracking-normal' : 'tracking-wide uppercase'
              }`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`text-sm font-bold tabular-nums ${priceClass}`}>
                {product.price.toLocaleString(isArabic ? 'ar-EG' : 'en-US')} {t('currency')}
              </span>
              {compareAtPrice != null && (
                <span className="text-[11px] text-brand-gray line-through tabular-nums">
                  {compareAtPrice.toLocaleString(isArabic ? 'ar-EG' : 'en-US')} {t('currency')}
                </span>
              )}
            </div>

            {onQuickAdd && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickAdd(product);
                }}
                className="shrink-0 p-2 rounded-full bg-brand-sec border border-brand-border hover:bg-brand-navy hover:text-white transition-colors"
                aria-label={t('add_to_cart')}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {progressPercentage != null && (
        <div className="px-4 pb-4 space-y-1.5">
          <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-red transition-[width] duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {soldLabel && (
            <span className="text-[10px] text-brand-gray font-medium block text-start">
              {soldLabel}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
