"use client";

import { use, useEffect, useState } from 'react';
import { useProducts } from '@/lib/products';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';
import Link from 'next/link';

export default function ProductDetailPage({ params }) {
  const { handle } = use(params);
  const { t, locale } = useI18n();
  const { addToCart } = useCart();

  const { getCachedProduct, ensureProduct } = useProducts();

  const cachedProduct = getCachedProduct(handle);
  const [product, setProduct] = useState(cachedProduct);
  const [selectedImage, setSelectedImage] = useState(cachedProduct?.images?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(cachedProduct?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(cachedProduct?.colors?.[0] || "");
  const [loading, setLoading] = useState(!cachedProduct);
  const { toggleWishlist, isLiked } = useWishlist();
  const liked = product ? isLiked(product.id) : false;

  useEffect(() => {
    let cancelled = false;
    const instant = getCachedProduct(handle);

    if (instant) {
      setProduct(instant);
      setSelectedImage(instant.images[0] || "");
      setSelectedSize(instant.sizes[0] || "");
      setSelectedColor(instant.colors[0] || "");
      setLoading(false);
      return;
    }

    setLoading(true);
    ensureProduct(handle)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setProduct(data);
          setSelectedImage(data.images[0] || "");
          setSelectedSize(data.sizes[0] || "");
          setSelectedColor(data.colors[0] || "");
        } else {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error("Failed fetching product details:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [handle, locale, getCachedProduct, ensureProduct]);

  const selectedVariant = product ? product.variants?.find(variant => {
    const sizeOpt = variant.selectedOptions.find(opt => opt.name === "SIZE" || opt.name === "المقاس");
    const colorOpt = variant.selectedOptions.find(opt => opt.name === "COLOR" || opt.name === "اللون");
    
    const sizeMatch = sizeOpt ? sizeOpt.value === selectedSize : true;
    const colorMatch = colorOpt ? colorOpt.value === selectedColor : true;
    
    return sizeMatch && colorMatch;
  }) : null;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white text-brand-dark">
        <span className="font-inconsolata text-xs tracking-widest uppercase animate-pulse">
          {t('loading_specification')}
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-white text-brand-dark space-y-6">
        <span className="font-inconsolata text-xs tracking-widest text-brand-gray uppercase">
          SPECIFICATION CODE NOT FOUND
        </span>
        <Link 
          href="/shop" 
          className="px-6 py-3 border border-brand-border text-xs font-bold uppercase tracking-widest hover:border-brand-navy hover:text-brand-navy transition-colors rounded-full"
        >
          BACK TO CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-brand-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Link */}
        <div className="mb-12">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>[ RETURN TO CATALOG ]</span>
          </Link>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Image View */}
            <div className="md:col-span-10 border border-brand-border rounded-xl relative aspect-[4/5] bg-brand-sec overflow-hidden shadow-sm">
              <img 
                src={selectedImage} 
                alt={product.title}
                className="w-full h-full object-cover filter sepia-[5%]"
              />
              {!product.available && (
                <div className="absolute top-4 start-4 bg-brand-navy text-white font-bold text-xs tracking-widest px-3 py-1 uppercase rounded">
                  {t('out_of_stock')}
                </div>
              )}
            </div>

            {/* Thumbnail Selectors */}
            <div className="md:col-span-2 flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible">
              {product.images.map((img, idx) => {
                const isSelected = selectedImage === img;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 border rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      isSelected ? 'border-brand-red p-[2px]' : 'border-brand-border hover:border-brand-gray'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.title} view ${idx + 1}`}
                      className="w-full h-full object-cover filter sepia-[5%]"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Specification details */}
          <div className="lg:col-span-5 space-y-8 p-6 md:p-8 border border-brand-border rounded-2xl bg-brand-sec">
            <div className="space-y-3">
              <span className={`text-xs font-bold text-brand-red block ${locale === 'ar' ? '' : 'uppercase tracking-widest'}`}>
                {t(`filter_${product.category.toLowerCase().replace('-', '_')}`)}
              </span>
              <h1
                className={`font-urbanist font-extrabold tracking-tight text-2xl md:text-3xl text-brand-navy leading-snug ${
                  locale === 'ar' ? '' : 'uppercase'
                }`}
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              >
                {product.title}
              </h1>
              
              <div className="flex justify-between items-baseline pt-2 gap-4">
                <div className="text-xl font-extrabold tracking-wide text-brand-navy tabular-nums">
                  {product.price.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} {t('currency')}
                </div>
                {selectedVariant && selectedVariant.weight > 0 && (
                  <div className="text-[11px] font-semibold tracking-wider text-brand-gray uppercase">
                    [ {t('weight_label')}: {selectedVariant.weight} {selectedVariant.weightUnit === "KILOGRAMS" ? (locale === 'ar' ? "كجم" : "KG") : (locale === 'ar' ? "جرام" : "G")} ]
                  </div>
                )}
              </div>
            </div>

            <div className="border-b border-brand-border" />

            <div className="space-y-4">
              <p
                className="text-sm leading-relaxed text-brand-dark/85 font-medium max-w-prose"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              >
                {product.description}
              </p>
            </div>

            <div className="border-b border-brand-border" />

            {/* Option selectors (Color, Size) */}
            <div className="space-y-6">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-brand-gray uppercase tracking-wider block">
                    {t('color_label')}: <span className="text-brand-navy">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all duration-300 ${
                            isSelected 
                              ? 'bg-brand-navy text-white border-brand-navy' 
                              : 'bg-white text-brand-dark border-brand-border hover:border-brand-navy'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-brand-gray uppercase tracking-wider block">
                    {t('size_label')}: <span className="text-brand-navy">{selectedSize}</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider border rounded-full transition-all duration-300 ${
                            isSelected 
                              ? 'bg-brand-navy text-white border-brand-navy' 
                              : 'bg-white text-brand-dark border-brand-border hover:border-brand-navy'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Add to Cart & Wishlist */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                disabled={!product.available}
                onClick={() => addToCart(product, 1, selectedColor, selectedSize)}
                className="w-full flex items-center justify-center gap-3 py-4 bg-brand-navy hover:bg-brand-red text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-full shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.available ? t('add_to_cart') : t('out_of_stock')}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 border text-xs font-bold rounded-full transition-all duration-300 ${
                  locale === 'ar' ? '' : 'uppercase tracking-widest'
                } ${
                  liked
                    ? 'bg-brand-red border-brand-red text-white shadow-sm'
                    : 'bg-white border-brand-border text-brand-dark hover:border-brand-red hover:text-brand-red'
                }`}
                aria-label={liked ? t('remove_from_wishlist') : t('add_to_wishlist')}
              >
                <Heart className={`w-4 h-4 transition-all duration-300 ${liked ? 'fill-white' : ''}`} />
                <span>{liked ? t('remove_from_wishlist') : t('add_to_wishlist')}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
