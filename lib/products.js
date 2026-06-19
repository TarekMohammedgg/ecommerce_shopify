"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { getProducts as fetchProducts, getProduct as fetchProduct } from './shopify';
import { useI18n } from './i18n';

const STORAGE_KEY = 'naseej_products_cache';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

const ProductsContext = createContext({
  products: [],
  loading: true,
  getCachedProduct: () => null,
  ensureProduct: async () => null,
  prefetchProduct: () => {},
});

function readCatalogCache() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (CACHE_TTL_MS && Date.now() - (parsed.savedAt || 0) > CACHE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }

    return parsed.locales || {};
  } catch {
    return {};
  }
}

function writeCatalogCache(productsByLocale) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        locales: productsByLocale,
      })
    );
  } catch (err) {
    console.warn('Failed persisting product cache:', err);
  }
}

function seedProductCacheRef(productCacheRef, productsByLocale) {
  Object.entries(productsByLocale).forEach(([loc, products]) => {
    products.forEach((p) => {
      productCacheRef.current[`${loc}:${p.handle}`] = p;
    });
  });
}

function upsertProductInCache(productCacheRef, productsByLocale, locale, product) {
  if (!product?.handle) return productsByLocale;

  productCacheRef.current[`${locale}:${product.handle}`] = product;

  const list = productsByLocale[locale] || [];
  const idx = list.findIndex((p) => p.handle === product.handle);
  const nextList =
    idx >= 0
      ? list.map((p, i) => (i === idx ? product : p))
      : [...list, product];

  return { ...productsByLocale, [locale]: nextList };
}

export function ProductsProvider({ children }) {
  const { locale } = useI18n();
  const [productsByLocale, setProductsByLocale] = useState({});
  const [loadingByLocale, setLoadingByLocale] = useState({});
  const [storageReady, setStorageReady] = useState(false);
  const productCacheRef = useRef({});
  const inflightRef = useRef({});
  const hydratedRef = useRef(false);

  useLayoutEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const stored = readCatalogCache();
    if (Object.keys(stored).length > 0) {
      seedProductCacheRef(productCacheRef, stored);
      setProductsByLocale(stored);
    }
    setStorageReady(true);
  }, []);

  const products = productsByLocale[locale];
  const loading = !storageReady || (!products && (loadingByLocale[locale] ?? true));

  useEffect(() => {
    if (!storageReady) return;

    let cancelled = false;
    const hasCache = !!productsByLocale[locale];

    if (!hasCache) {
      setLoadingByLocale((prev) => ({ ...prev, [locale]: true }));
    }

    fetchProducts(locale)
      .then((data) => {
        if (cancelled) return;
        setProductsByLocale((prev) => {
          const next = { ...prev, [locale]: data };
          writeCatalogCache(next);
          return next;
        });
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
  }, [locale, storageReady]);

  const getCachedProduct = useCallback(
    (handle) => {
      if (!handle) return null;

      const key = `${locale}:${handle}`;
      if (productCacheRef.current[key]) return productCacheRef.current[key];

      const fromState = productsByLocale[locale]?.find((p) => p.handle === handle);
      if (fromState) return fromState;

      const fromStorage = readCatalogCache()[locale]?.find((p) => p.handle === handle);
      if (fromStorage) {
        productCacheRef.current[key] = fromStorage;
        return fromStorage;
      }

      return null;
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
          if (data) {
            setProductsByLocale((prev) => {
              const next = upsertProductInCache(productCacheRef, prev, locale, data);
              writeCatalogCache(next);
              return next;
            });
          }
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
