"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCheckout } from '@/lib/checkout';
import { useCart } from '@/lib/cart';
import { useI18n } from '@/lib/i18n';

export default function CheckoutPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { cartItems, cartReady } = useCart();
  const { status, error, processCheckout, retryCheckout } = useCheckout();

  useEffect(() => {
    if (!cartReady) return;

    if (cartItems.length === 0) {
      router.replace('/shop');
      return;
    }

    if (status === 'idle') {
      processCheckout();
    }
  }, [cartReady, cartItems.length, status, processCheckout, router]);

  const isProcessing = status === 'processing' || status === 'idle';
  const isRedirecting = status === 'redirecting';
  const isError = status === 'error';

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md text-center space-y-8">
        {(isProcessing || isRedirecting) && (
          <>
            <Loader2 className="w-12 h-12 text-brand-navy animate-spin mx-auto" />
            <div className="space-y-2">
              <h1 className="font-bold text-lg uppercase tracking-wider text-brand-navy">
                {isRedirecting ? t('checkout_redirecting') : t('checkout_preparing')}
              </h1>
              <p className="text-xs text-brand-gray uppercase tracking-widest font-semibold">
                {t('checkout_subtitle')}
              </p>
            </div>
          </>
        )}

        {isError && (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 border border-red-100">
              <AlertCircle className="w-7 h-7 text-brand-red" />
            </div>
            <div className="space-y-2">
              <h1 className="font-bold text-lg uppercase tracking-wider text-brand-navy">
                {t('checkout_error_title')}
              </h1>
              <p className="text-sm text-brand-gray">
                {error || t('checkout_error_default')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={retryCheckout}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-navy hover:bg-brand-red text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-full"
              >
                <span>{t('checkout_retry')}</span>
                {locale === 'ar' ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 border border-brand-border text-brand-navy hover:bg-brand-sec text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-full"
              >
                {t('checkout_back_to_shop')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
