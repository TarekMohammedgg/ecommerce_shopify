"use client";

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useCart } from './cart';
import { useAuth, AUTH_TOKEN_KEY } from './auth';

const CheckoutContext = createContext({
  status: 'idle',
  error: null,
  processCheckout: () => {},
  retryCheckout: () => {},
  resetCheckout: () => {}
});

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

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          customerAccessToken,
        }),
      });
      const checkoutResponse = await response.json().catch(() => ({}));

      if (!response.ok || !checkoutResponse.checkoutUrl) {
        throw new Error(checkoutResponse.error || 'Unable to create checkout. Please try again.');
      }

      setStatus('redirecting');
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      window.location.assign(checkoutResponse.checkoutUrl);
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
