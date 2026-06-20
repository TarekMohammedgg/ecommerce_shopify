"use client";

import { useCart } from '@/lib/cart';
import { useI18n } from '@/lib/i18n';
import { X, Plus, Minus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    triggerCheckout 
  } = useCart();
  
  const { t, locale } = useI18n();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-white border-l border-brand-border h-full flex flex-col justify-between shadow-2xl z-10 animate-fade-in font-sans">
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-bold text-lg uppercase tracking-wider text-brand-navy">
            {t('cart_title')}
          </h2>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-1 hover:text-brand-red transition-colors"
            aria-label={t('close_cart')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs text-brand-gray uppercase tracking-widest font-semibold">
                {t('cart_empty')}
              </span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.cartId}
                className="flex gap-4 pb-6 border-b border-brand-border items-start"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 bg-brand-sec border border-brand-border rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover filter sepia-[5%]"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between h-24">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-xs md:text-sm text-brand-dark uppercase tracking-wider truncate max-w-[180px]">
                        {item.title}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-brand-gray hover:text-brand-red transition-colors animate-all"
                        aria-label={t('remove_item')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta options (color, size) */}
                    <div className="flex gap-3 mt-1.5 text-[10px] text-brand-gray font-bold uppercase tracking-wider">
                      {item.color && (
                        <span>{t('color_label')}: {item.color}</span>
                      )}
                      {item.size && (
                        <span>{t('size_label')}: {item.size}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity adjustment & Price */}
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-brand-border rounded-full overflow-hidden bg-brand-sec">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs hover:bg-brand-border text-brand-dark transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-brand-navy">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs hover:bg-brand-border text-brand-dark transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-brand-red tracking-wider">
                      {item.price * item.quantity} {t('currency')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-brand-border bg-brand-sec">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-xs font-bold text-brand-gray uppercase tracking-wider">
                {t('subtotal')}
              </span>
              <span className="text-lg font-extrabold text-brand-navy tracking-wide">
                {cartSubtotal} {t('currency')}
              </span>
            </div>

            <button
              onClick={triggerCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-navy hover:bg-brand-red text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 group rounded-full shadow-md"
            >
              <span>{t('checkout')}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
