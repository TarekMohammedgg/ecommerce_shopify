"use client";

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createShopifyCart, getProduct, resolveVariantFromProduct } from './shopify';
import { useCart } from './cart';
import { useAuth, AUTH_TOKEN_KEY } from './auth';

// Real variant from connected store (used when cart has mock/csv product ids)
const FALLBACK_VARIANT_ID = 'gid://shopify/ProductVariant/43721485221962';

const CheckoutContext = createContext({
  status: 'idle',
  error: null,
  processCheckout: () => {},
  retryCheckout: () => {},
  resetCheckout: () => {}
});

async function buildLineItems(cartItems) {
  const lines = [];

  for (const item of cartItems) {
    let variantId = item.variantId;

    if (!variantId) {
      if (item.id.includes('ProductVariant')) {
        variantId = item.id;
      } else if (item.handle) {
        const product = await getProduct(item.handle);
        variantId = resolveVariantFromProduct(product, item.color, item.size);

        if (!variantId && (item.id.includes('mock') || item.id.includes('csv'))) {
          variantId = FALLBACK_VARIANT_ID;
        }
      } else if (item.id.includes('mock') || item.id.includes('csv')) {
        variantId = FALLBACK_VARIANT_ID;
      }
    }

    if (!variantId) {
      throw new Error(
        `Could not resolve variant for "${item.title}". Remove it from cart and add again.`
      );
    }

    lines.push({ variantId, quantity: item.quantity });
  }

  return lines;
}

export function CheckoutProvider({ children }) {
  const { cartItems } = useCart();
  const { token } = useAuth();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const processingRef = useRef(false);

  const processCheckout = useCallback(async () => {
    if (processingRef.current) return;

    if (cartItems.length === 0) {
      setStatus('error');
      setError('Your cart is empty.');
      return;
    }

    processingRef.current = true;
    setStatus('processing');
    setError(null);

    try {
      const customerAccessToken =
        token ||
        (typeof window !== 'undefined'
          ? localStorage.getItem(AUTH_TOKEN_KEY) || undefined
          : undefined);

      const lineItems = await buildLineItems(cartItems);
      const shopifyCart = await createShopifyCart(lineItems, {
        customerAccessToken
      });

      if (!shopifyCart?.checkoutUrl) {
        throw new Error('Unable to create checkout. Please try again.');
      }

      setStatus('redirecting');
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      window.location.assign(shopifyCart.checkoutUrl);
    } catch (err) {
      console.error('Checkout failed:', err);
      setStatus('error');
      setError(err.message || 'Checkout failed. Please try again.');
      processingRef.current = false;
    }
  }, [cartItems, token]);

  const retryCheckout = useCallback(() => {
    processingRef.current = false;
    setError(null);
    setStatus('idle');
    queueMicrotask(() => processCheckout());
  }, [processCheckout]);

  const resetCheckout = useCallback(() => {
    processingRef.current = false;
    setStatus('idle');
    setError(null);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{ status, error, processCheckout, retryCheckout, resetCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
