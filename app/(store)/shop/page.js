"use client";

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useProducts } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { SlidersHorizontal, Check, X } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';

const COLOR_HEX_MAP = {
  "BLACK": "#000000",
  "HEATHER GRAY": "#A8A8A8",
  "MID BLUE": "#4B70F5",
  "WHITE": "#FFFFFF",
  "CAMEL": "#C19A6B",
  "OLIVE": "#606C38",
  "NAVY FLORAL": "#1D2B53",
  "STONE": "#C2B280",
  "NATURAL": "#EAE0D5"
};

function ShopCatalog() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toggleWishlist, isLiked } = useWishlist();
  const { products: allProducts, loading } = useProducts();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [prevParamsString, setPrevParamsString] = useState(() => searchParams.toString());

  // Advanced Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');

  const searchQuery = useMemo(() => searchParams.get('search') || '', [searchParams]);

  // Adjust filters state synchronously during render if search parameters change
  const currentParamsString = searchParams.toString();
  if (currentParamsString !== prevParamsString) {
    setPrevParamsString(currentParamsString);
    
    const categoryParam = searchParams.get('category');
    setSelectedCategories(categoryParam ? categoryParam.split(',') : []);
    
    const colorParam = searchParams.get('color');
    setSelectedColors(colorParam ? colorParam.split(',') : []);
    
    const sizeParam = searchParams.get('size');
    setSelectedSizes(sizeParam ? sizeParam.split(',') : []);
    
    setPriceMin(searchParams.get('priceMin') || '');
    setPriceMax(searchParams.get('priceMax') || '');
    setSortBy(searchParams.get('sort') || 'DEFAULT');
  }

  // Sync state filters to URL parameters
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.categories && newFilters.categories.length > 0) {
      params.set('category', newFilters.categories.join(','));
    }
    
    if (newFilters.colors && newFilters.colors.length > 0) {
      params.set('color', newFilters.colors.join(','));
    }
    
    if (newFilters.sizes && newFilters.sizes.length > 0) {
      params.set('size', newFilters.sizes.join(','));
    }
    
    if (newFilters.priceMin !== undefined && newFilters.priceMin !== '') {
      params.set('priceMin', newFilters.priceMin);
    }
    
    if (newFilters.priceMax !== undefined && newFilters.priceMax !== '') {
      params.set('priceMax', newFilters.priceMax);
    }
    
    if (newFilters.sortBy && newFilters.sortBy !== 'DEFAULT') {
      params.set('sort', newFilters.sortBy);
    }
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }
    
    router.push(`/shop?${params.toString()}`);
  };

  // Toggle helpers
  const toggleCategory = (key) => {
    const next = selectedCategories.includes(key)
      ? selectedCategories.filter(k => k !== key)
      : [...selectedCategories, key];
    setSelectedCategories(next);
    updateFilters({ categories: next, colors: selectedColors, sizes: selectedSizes, priceMin, priceMax, sortBy });
  };

  const toggleColor = (color) => {
    const next = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(next);
    updateFilters({ categories: selectedCategories, colors: next, sizes: selectedSizes, priceMin, priceMax, sortBy });
  };

  const toggleSize = (size) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(next);
    updateFilters({ categories: selectedCategories, colors: selectedColors, sizes: next, priceMin, priceMax, sortBy });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceMin('');
    setPriceMax('');
    setSortBy('DEFAULT');
    
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }
    router.push(`/shop?${params.toString()}`);
  };

  // Filter & Sort core logic
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    
    // 2. Categories
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    
    // 3. Colors
    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors?.some(c => selectedColors.includes(c.toUpperCase())));
    }
    
    // 4. Sizes
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes?.some(s => selectedSizes.includes(s.toUpperCase())));
    }
    
    // 5. Price Min
    if (priceMin !== '') {
      result = result.filter(p => p.price >= parseFloat(priceMin));
    }
    
    // 6. Price Max
    if (priceMax !== '') {
      result = result.filter(p => p.price <= parseFloat(priceMax));
    }
    
    // 7. Sort
    if (sortBy === 'PRICE_ASC') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_DESC') {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [allProducts, searchQuery, selectedCategories, selectedColors, selectedSizes, priceMin, priceMax, sortBy]);

  const { addToCart } = useCart();

  // Shared reusable filter content JSX
  const filtersContent = (
    <div className="space-y-8">
      {/* 1. Sort Options */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-brand-navy tracking-widest uppercase block border-b border-brand-border pb-2">
          {t('filter_sort')}
        </span>
        <div className="space-y-1.5">
          {[
            { key: 'DEFAULT', label: t('sort_default') },
            { key: 'PRICE_ASC', label: t('sort_price_asc') },
            { key: 'PRICE_DESC', label: t('sort_price_desc') }
          ].map((opt) => {
            const isSelected = sortBy === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => {
                  setSortBy(opt.key);
                  updateFilters({ categories: selectedCategories, colors: selectedColors, sizes: selectedSizes, priceMin, priceMax, sortBy: opt.key });
                }}
                className={`w-full text-left rtl:text-right px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-brand-navy text-white border-brand-navy font-bold shadow-xs' 
                    : 'bg-white text-brand-gray border-brand-border hover:border-brand-navy hover:text-brand-navy'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Categories */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-brand-navy tracking-widest uppercase block border-b border-brand-border pb-2">
          {t('filter_categories')}
        </span>
        <div className="space-y-1.5">
          {['T-SHIRTS', 'SHIRTS', 'HOODIES', 'JACKETS', 'PANTS', 'DRESSES'].map((catKey) => {
            const isSelected = selectedCategories.includes(catKey);
            return (
              <button
                key={catKey}
                onClick={() => toggleCategory(catKey)}
                className={`w-full text-left rtl:text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border transition-all duration-200 flex justify-between items-center ${
                  isSelected 
                    ? 'bg-brand-navy text-white border-brand-navy font-bold shadow-xs' 
                    : 'bg-white text-brand-gray border-brand-border hover:border-brand-navy hover:text-brand-navy'
                }`}
              >
                <span>{t(`filter_${catKey.toLowerCase().replace('-', '_')}`)}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Colors */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-brand-navy tracking-widest uppercase block border-b border-brand-border pb-2">
          {t('filter_color')}
        </span>
        <div className="flex flex-wrap gap-3">
          {Object.entries(COLOR_HEX_MAP).map(([colorName, hex]) => {
            const isSelected = selectedColors.includes(colorName);
            return (
              <button
                key={colorName}
                onClick={() => toggleColor(colorName)}
                className={`group relative w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isSelected 
                    ? 'border-brand-navy scale-110 shadow-md' 
                    : 'border-brand-border hover:border-brand-navy'
                }`}
                title={colorName}
                aria-label={`${t('filter_by_color')} ${colorName}`}
              >
                <span 
                  className="w-5.5 h-5.5 rounded-full block transition-transform duration-300 group-hover:scale-95" 
                  style={{ 
                    backgroundColor: hex,
                    border: hex === '#FFFFFF' ? '1px solid #E5E7EB' : 'none'
                  }} 
                />
                {isSelected && (
                  <span className="absolute inset-0 rounded-full border-2 border-brand-navy pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Sizes */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-brand-navy tracking-widest uppercase block border-b border-brand-border pb-2">
          {t('filter_size')}
        </span>
        <div className="flex flex-wrap gap-2">
          {["S", "M", "L"].map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`w-10 h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider border rounded-lg transition-all duration-300 ${
                  isSelected 
                    ? 'bg-brand-navy text-white border-brand-navy shadow-xs' 
                    : 'bg-white text-brand-dark border-brand-border hover:border-brand-navy'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Price Range */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-brand-navy tracking-widest uppercase block border-b border-brand-border pb-2">
          {t('filter_price')}
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t('filter_min_price')}
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={() => updateFilters({ categories: selectedCategories, colors: selectedColors, sizes: selectedSizes, priceMin, priceMax, sortBy })}
            className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg focus:outline-none focus:border-brand-navy bg-white text-brand-dark placeholder-brand-gray"
          />
          <span className="text-brand-gray text-xs">-</span>
          <input
            type="number"
            placeholder={t('filter_max_price')}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={() => updateFilters({ categories: selectedCategories, colors: selectedColors, sizes: selectedSizes, priceMin, priceMax, sortBy })}
            className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg focus:outline-none focus:border-brand-navy bg-white text-brand-dark placeholder-brand-gray"
          />
        </div>
      </div>

      {/* 6. Clear All Filters */}
      {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || priceMin !== '' || priceMax !== '' || sortBy !== 'DEFAULT') && (
        <button
          onClick={clearAllFilters}
          className="w-full py-3 border border-brand-red text-brand-red hover:bg-brand-red hover:text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 mt-4 shadow-xs"
        >
          {t('clear_filters')}
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full bg-white text-brand-dark min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="border-b border-brand-border pb-6 mb-8 flex justify-between items-baseline flex-wrap gap-4">
          <div>
            <span className="text-[10px] text-brand-gray font-bold tracking-widest uppercase block mb-1">
              [ {searchQuery ? `${t('search_results_label')}: "${searchQuery}"` : t('inventory_catalog')} ]
            </span>
            <h1 className="font-urbanist font-extrabold tracking-tight text-3xl md:text-4xl text-brand-navy uppercase">
              {t('nav_shop')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-brand-gray font-medium font-mono uppercase">
              {filteredProducts.length} {t('items_conforming')}
            </span>
            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-brand-border rounded-full text-xs font-bold text-brand-dark hover:border-brand-navy transition-colors bg-brand-sec"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('filter_button')}</span>
            </button>
          </div>
        </div>

        {/* Main Grid Layout (Sidebar on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Desktop Filters Sidebar */}
          <aside className="hidden md:block md:col-span-3 sticky top-32 bg-brand-sec p-6 border border-brand-border rounded-2xl max-h-[80vh] overflow-y-auto">
            {filtersContent}
          </aside>

          {/* Right Column: Products Grid */}
          <main className="col-span-1 md:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center border border-dashed border-brand-border rounded-2xl bg-brand-sec p-8">
                <span className="text-xs text-brand-gray font-semibold uppercase tracking-widest">
                  {t('no_matching_products')}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-red transition-all"
                >
                  {t('clear_filters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
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
          </main>
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {isMobileFilterOpen && (
          <div 
            className="fixed inset-0 z-50 flex justify-end animate-fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            {/* Background backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
            
            {/* Drawer content panel */}
            <div 
              className="relative w-80 max-w-full h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto ltr:ml-auto rtl:mr-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-brand-border mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-navy" />
                  <h2 className="font-urbanist font-extrabold text-sm uppercase tracking-wider text-brand-navy">
                    {t('sort_and_filters')}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full border border-brand-border hover:bg-brand-sec transition-colors text-brand-gray hover:text-brand-dark"
                  aria-label={t('close_filters')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Drawer Filters Widgets */}
              <div className="flex-grow">
                {filtersContent}
              </div>
              
              {/* Apply CTA */}
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="mt-8 w-full py-3.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-red transition-colors shadow-md"
              >
                {t('apply_filters')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ShopPageFallback() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-brand-dark">
      <span className="font-inconsolata text-xs tracking-widest uppercase animate-pulse">
        {t('initializing_shop')}
      </span>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopCatalog />
    </Suspense>
  );
}
