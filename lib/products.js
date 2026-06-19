"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getProducts as fetchProducts, getProduct as fetchProduct } from './shopify';
import { useI18n } from './i18n';

const ProductsContext = createContext({
  products: [],
  loading: true,
  getCachedProduct: () => null,
  ensureProduct: async () => null,
  prefetchProduct: () => {},
});

export function ProductsProvider({ children }) {
  const { locale } = useI18n();
  const [productsByLocale, setProductsByLocale] = useState({});
  const [loadingByLocale, setLoadingByLocale] = useState({});
  const productCacheRef = useRef({});
  const inflightRef = useRef({});

  const products = productsByLocale[locale];
  const loading = products ? false : (loadingByLocale[locale] ?? true);

  useEffect(() => {
    if (productsByLocale[locale]) return;

    let cancelled = false;
    setLoadingByLocale((prev) => ({ ...prev, [locale]: true }));

    fetchProducts(locale)
      .then((data) => {
        if (cancelled) return;
        setProductsByLocale((prev) => ({ ...prev, [locale]: data }));
        data.forEach((p) => {
          productCacheRef.current[`${locale}:${p.handle}`] = p;
        });
      })
      .catch((err) => {
        console.error('Failed loading products:', err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingByLocale((prev) => ({ ...prev, [locale]: false }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale, productsByLocale]);

  const getCachedProduct = useCallback(
    (handle) => {
      if (!handle) return null;
      const key = `${locale}:${handle}`;
      if (productCacheRef.current[key]) return productCacheRef.current[key];
      return productsByLocale[locale]?.find((p) => p.handle === handle) ?? null;
    },
    [locale, productsByLocale]
  );

  const ensureProduct = useCallback(
    async (handle) => {
      const cached = getCachedProduct(handle);
      if (cached) return cached;

      const key = `${locale}:${handle}`;
      if (inflightRef.current[key]) return inflightRef.current[key];

      const promise = fetchProduct(handle, locale)
        .then((data) => {
          if (data) productCacheRef.current[key] = data;
          return data;
        })
        .finally(() => {
          delete inflightRef.current[key];
        });

      inflightRef.current[key] = promise;
      return promise;
    },
    [locale, getCachedProduct]
  );

  const prefetchProduct = useCallback(
    (handle) => {
      ensureProduct(handle).catch(() => {});
    },
    [ensureProduct]
  );

  const value = useMemo(
    () => ({
      products: products ?? [],
      loading,
      getCachedProduct,
      ensureProduct,
      prefetchProduct,
    }),
    [products, loading, getCachedProduct, ensureProduct, prefetchProduct]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  return useContext(ProductsContext);
}
