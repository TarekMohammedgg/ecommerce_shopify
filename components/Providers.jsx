"use client";

import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import { CheckoutProvider } from '@/lib/checkout';
import { WishlistProvider } from '@/lib/wishlist';

export default function Providers({ children }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <CheckoutProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
