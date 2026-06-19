"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import { CheckoutProvider } from '@/lib/checkout';
import { WishlistProvider } from '@/lib/wishlist';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function Providers({ children }) {
  const tree = (
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

  if (!googleClientId) {
    return tree;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {tree}
    </GoogleOAuthProvider>
  );
}
