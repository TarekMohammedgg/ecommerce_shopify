"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useWishlist } from '@/lib/wishlist';
import { useCart } from '@/lib/cart';
import { applyProductLocale } from '@/lib/product-locale';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/lib/auth';
import { 
  loginCustomerAccount,
  registerCustomerAccount,
} from '@/lib/customer-auth';
import { 
  User, 
  Mail, 
  Lock, 
  Heart, 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  LogOut, 
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { wishlistItems, toggleWishlist, isLiked } = useWishlist();
  const { 
    cartItems, 
    cartCount, 
    cartSubtotal, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    triggerCheckout 
  } = useCart();
  const { customer, isLoggedIn, loading: loadingCustomer, loginWithToken, logout } = useAuth();

  // Derived active sub-tab from search parameters
  const tabParam = searchParams.get('tab');
  const activeSubTab = tabParam === 'wishlist' ? 'wishlist' : tabParam === 'cart' ? 'cart' : 'orders';
  const redirectPath = searchParams.get('redirect');

  // Authentication Forms State
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');

  // UI States
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect back after login when ?redirect= is present
  useEffect(() => {
    if (!loadingCustomer && isLoggedIn && redirectPath) {
      router.replace(redirectPath);
    }
  }, [loadingCustomer, isLoggedIn, redirectPath, router]);

  // Handle traditional Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!loginEmail || !loginPassword) {
      setError(locale === 'en' ? "Please fill in all fields." : "يرجى ملء جميع الحقول.");
      return;
    }

    setAuthLoading(true);
    try {
      const { ok, data } = await loginCustomerAccount({
        email: loginEmail,
        password: loginPassword,
      });

      if (ok && data?.accessToken) {
        const profile = await loginWithToken(data.accessToken);
        if (profile) {
          setSuccess(locale === 'en' ? "Successfully logged in." : "تم تسجيل الدخول بنجاح.");
        } else {
          setError(locale === 'en' ? "Failed to retrieve profile. Please sign in again." : "فشل في استرداد الملف الشخصي. يرجى تسجيل الدخول مرة أخرى.");
        }
      } else if (data?.errors?.length) {
        setError(data.errors.map((el) => el.message).join(", "));
      } else {
        setError(
          data?.error ||
          (locale === 'en' ? "Invalid email or password." : "البريد الإلكتروني أو كلمة المرور غير صحيحة.")
        );
      }
    } catch (err) {
      setError(err.message || (locale === 'en' ? "An error occurred. Please try again." : "حدث خطأ ما. يرجى المحاولة مرة أخرى."));
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle traditional Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!registerEmail || !registerPassword || !registerFirstName || !registerLastName) {
      setError(locale === 'en' ? "Please fill in all fields." : "يرجى ملء جميع الحقول.");
      return;
    }

    setAuthLoading(true);
    try {
      const { ok, data } = await registerCustomerAccount({
        email: registerEmail,
        password: registerPassword,
        firstName: registerFirstName,
        lastName: registerLastName,
      });

      if (ok && data?.accessToken) {
        const profile = await loginWithToken(data.accessToken);
        if (profile) {
          setSuccess(locale === 'en' ? "Account created successfully!" : "تم إنشاء الحساب بنجاح!");
        } else {
          setSuccess(locale === 'en' ? "Account created! Please sign in." : "تم إنشاء الحساب! يرجى تسجيل الدخول.");
          setAuthTab('login');
          setLoginEmail(registerEmail);
        }
      } else if (ok && data?.created) {
        setSuccess(
          locale === 'en'
            ? "Account created! Please sign in."
            : "تم إنشاء الحساب! يرجى تسجيل الدخول."
        );
        setAuthTab('login');
        setLoginEmail(registerEmail);
      } else if (data?.errors?.length) {
        const taken = data.errors.some((err) => err.code === 'TAKEN');
        if (taken) {
          setError(
            locale === 'en'
              ? "This email is already registered. Please sign in instead."
              : "هذا البريد الإلكتروني مسجّل بالفعل. يرجى تسجيل الدخول."
          );
          setAuthTab('login');
          setLoginEmail(registerEmail);
        } else {
          setError(data.errors.map((err) => err.message).join(", "));
        }
      } else {
        setError(
          data?.error ||
          (locale === 'en'
            ? "Failed to create account. Please try again."
            : "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.")
        );
      }
    } catch (err) {
      setError(err.message || (locale === 'en' ? "An error occurred. Please try again." : "حدث خطأ ما. يرجى المحاولة مرة أخرى."));
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    setSuccess(locale === 'en' ? "Successfully logged out." : "تم تسجيل الخروج بنجاح.");
  };

  // Loading State
  if (loadingCustomer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white text-brand-dark">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
      </div>
    );
  }

  // Logged-in View
  if (isLoggedIn && customer) {
    const formattedOrders = customer.orders?.edges?.map(edge => edge.node) || [];

    return (
      <div className="w-full bg-white py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Profile Information card */}
          <div className="lg:col-span-4 bg-brand-sec border border-brand-border rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4 border-b border-brand-border pb-6">
              <div className="w-14 h-14 rounded-full bg-brand-navy text-white flex items-center justify-center font-urbanist font-extrabold text-xl">
                {customer.firstName?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider block">
                  {t('profile_welcome')}
                </span>
                <h2 className="font-urbanist font-extrabold text-lg text-brand-navy leading-none">
                  {customer.firstName} {customer.lastName}
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs font-semibold text-brand-dark uppercase tracking-wider">
              <div className="space-y-1">
                <span className="text-[10px] text-brand-gray font-normal">{t('email_label')}</span>
                <p className="normal-case text-brand-navy truncate">{customer.email}</p>
              </div>
              {customer.phone && (
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-gray font-normal">PHONE</span>
                  <p className="text-brand-navy">{customer.phone}</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-white border border-brand-border hover:border-brand-red hover:text-brand-red text-brand-navy text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout_btn')}</span>
            </button>
          </div>

          {/* Right Side: Tabbed content (Orders & Wishlist) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tabs selector */}
            <div className="overflow-x-auto -mx-6 px-6 scrollbar-none">
              <div className="flex border-b border-brand-border min-w-max">
                <button 
                  onClick={() => router.replace('/profile?tab=orders', { scroll: false })}
                  className={`pb-4 px-4 sm:px-6 text-xs font-extrabold uppercase tracking-widest transition-all relative whitespace-nowrap flex-shrink-0 ${
                    activeSubTab === 'orders' 
                      ? 'text-brand-navy border-b-2 border-brand-navy' 
                      : 'text-brand-gray hover:text-brand-navy'
                  }`}
                >
                  {t('orders_tab')} ({formattedOrders.length})
                </button>
                <button 
                  onClick={() => router.replace('/profile?tab=wishlist', { scroll: false })}
                  className={`pb-4 px-4 sm:px-6 text-xs font-extrabold uppercase tracking-widest transition-all relative whitespace-nowrap flex-shrink-0 ${
                    activeSubTab === 'wishlist' 
                      ? 'text-brand-navy border-b-2 border-brand-navy' 
                      : 'text-brand-gray hover:text-brand-navy'
                  }`}
                >
                  {t('favourites_tab')} ({wishlistItems.length})
                </button>
                <button 
                  onClick={() => router.replace('/profile?tab=cart', { scroll: false })}
                  className={`pb-4 px-4 sm:px-6 text-xs font-extrabold uppercase tracking-widest transition-all relative whitespace-nowrap flex-shrink-0 ${
                    activeSubTab === 'cart' 
                      ? 'text-brand-navy border-b-2 border-brand-navy' 
                      : 'text-brand-gray hover:text-brand-navy'
                  }`}
                >
                  {t('cart_tab')} ({cartCount})
                </button>
              </div>
            </div>

            {/* Tab content panels */}
            <div className="w-full">
              {activeSubTab === 'orders' && (
                formattedOrders.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-brand-border rounded-2xl bg-brand-sec space-y-4">
                    <ShoppingBag className="w-8 h-8 text-brand-gray mx-auto opacity-60" />
                    <p className="text-brand-gray text-xs font-medium uppercase tracking-wider">
                      {t('no_orders')}
                    </p>
                    <Link 
                      href="/shop" 
                      className="inline-block px-6 py-2.5 bg-brand-navy hover:bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors"
                    >
                      {t('btn_shop_now')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formattedOrders.map((order) => {
                      const date = new Date(order.processedAt).toLocaleDateString(
                        locale === 'ar' ? 'ar-EG' : 'en-US', 
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      );

                      return (
                        <div 
                          key={order.id} 
                          className="border border-brand-border rounded-2xl overflow-hidden bg-white shadow-sm"
                        >
                          {/* Order Header */}
                          <div className="bg-brand-sec border-b border-brand-border p-4 flex flex-wrap justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider text-brand-navy">
                            <div>
                              <span>{t('order_number')} #{order.orderNumber}</span>
                              <span className="text-[10px] text-brand-gray font-normal block mt-1">
                                {t('order_date')}: {date}
                              </span>
                            </div>
                            <div className="flex gap-4 items-center">
                              <div>
                                <span className="text-[10px] text-brand-gray font-normal block">
                                  {t('order_status')}
                                </span>
                                <span className="text-[10px] text-brand-red px-2 py-0.5 rounded-full border border-brand-red mt-1 inline-block">
                                  {t(order.fulfillmentStatus?.toLowerCase() || 'unfulfilled')}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-brand-gray font-normal block">
                                  {t('order_total')}
                                </span>
                                <span>
                                  {Math.round(order.totalPrice.amount)} {order.totalPrice.currencyCode}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Line items list */}
                          <div className="p-4 divide-y divide-brand-border">
                            {order.lineItems?.edges?.map((edge, idx) => {
                              const item = edge.node;
                              return (
                                <div key={idx} className="py-3 flex items-center gap-4 justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-15 bg-brand-sec border border-brand-border rounded overflow-hidden flex-shrink-0">
                                      <img 
                                        src={item.variant?.image?.url || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=150&q=85"} 
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-sans font-medium text-xs text-brand-navy uppercase max-w-md truncate">
                                        {item.title}
                                      </h4>
                                      <span className="text-[10px] text-brand-gray font-medium">
                                        QTY: {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-brand-navy">
                                    {Math.round((item.variant?.price?.amount || 0) * item.quantity)} {order.totalPrice.currencyCode}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {activeSubTab === 'wishlist' && (
                wishlistItems.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-brand-border rounded-2xl bg-brand-sec space-y-4">
                    <Heart className="w-8 h-8 text-brand-gray mx-auto opacity-60" />
                    <p className="text-brand-gray text-xs font-medium uppercase tracking-wider">
                      {t('no_favourites')}
                    </p>
                    <Link 
                      href="/shop" 
                      className="inline-block px-6 py-2.5 bg-brand-navy hover:bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors"
                    >
                      {t('btn_shop_now')}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {wishlistItems.map((item) => {
                      const product = applyProductLocale(item, locale);
                      return (
                        <ProductCard
                          key={`${product.id}-${locale}`}
                          product={product}
                          locale={locale}
                          t={t}
                          liked={isLiked(product.id)}
                          onToggleWishlist={toggleWishlist}
                          onQuickAdd={(p) => addToCart(p, 1, p.colors?.[0], p.sizes?.[0])}
                        />
                      );
                    })}
                  </div>
                )
              )}

              {activeSubTab === 'cart' && (
                cartItems.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-brand-border rounded-2xl bg-brand-sec space-y-4">
                    <ShoppingCart className="w-8 h-8 text-brand-gray mx-auto opacity-60" />
                    <p className="text-brand-gray text-xs font-medium uppercase tracking-wider">
                      {t('no_cart_items')}
                    </p>
                    <Link 
                      href="/shop" 
                      className="inline-block px-6 py-2.5 bg-brand-navy hover:bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors"
                    >
                      {t('btn_shop_now')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="divide-y divide-brand-border border border-brand-border rounded-2xl overflow-hidden bg-white">
                      {cartItems.map((item) => (
                        <div 
                          key={item.cartId}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <Link 
                              href={`/products/${item.handle}`}
                              className="w-20 h-24 bg-brand-sec border border-brand-border rounded-lg overflow-hidden flex-shrink-0"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover filter sepia-[5%]"
                              />
                            </Link>
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <Link 
                                  href={`/products/${item.handle}`}
                                  className="font-sans font-medium text-xs sm:text-sm text-brand-navy uppercase tracking-wider truncate hover:text-brand-red transition-colors"
                                >
                                  {item.title}
                                </Link>
                                <button 
                                  onClick={() => removeFromCart(item.cartId)}
                                  className="text-brand-gray hover:text-brand-red transition-colors flex-shrink-0"
                                  aria-label={t('remove_item')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-3 text-[10px] text-brand-gray font-bold uppercase tracking-wider">
                                {item.color && item.color !== 'DEFAULT' && (
                                  <span>{t('color_label')}: {item.color}</span>
                                )}
                                {item.size && (
                                  <span>{t('size_label')}: {item.size}</span>
                                )}
                              </div>
                              <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                                <div className="flex items-center border border-brand-border rounded-full overflow-hidden bg-brand-sec">
                                  <button
                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                    className="px-2.5 py-1 text-xs hover:bg-brand-border text-brand-dark transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-3 text-xs font-semibold text-brand-navy min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                    className="px-2.5 py-1 text-xs hover:bg-brand-border text-brand-dark transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-sm font-bold text-brand-navy sm:hidden">
                                  {item.price * item.quantity} {t('currency')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="hidden sm:block text-sm font-bold text-brand-red tracking-wider flex-shrink-0">
                            {item.price * item.quantity} {t('currency')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-brand-sec border border-brand-border rounded-2xl">
                      <div className="flex justify-between sm:justify-start sm:gap-3 items-baseline">
                        <span className="text-xs font-bold text-brand-gray uppercase tracking-wider">
                          {t('subtotal')}
                        </span>
                        <span className="text-lg font-extrabold text-brand-navy tracking-wide">
                          {cartSubtotal} {t('currency')}
                        </span>
                      </div>
                      <button
                        onClick={triggerCheckout}
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-navy hover:bg-brand-red text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 group rounded-full shadow-md"
                      >
                        <span>{t('checkout')}</span>
                        {locale === 'ar' ? (
                          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guest / Login Form View
  return (
    <div className="w-full bg-white py-16 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md px-6 space-y-8">
        
        {redirectPath && (
          <div className="p-4 bg-brand-sec border border-brand-border text-brand-navy text-xs font-semibold rounded-xl flex items-center gap-3">
            <ShoppingCart className="w-4 h-4 flex-shrink-0" />
            <span>
              {locale === 'en'
                ? "Sign in to add items to your cart."
                : "سجّل الدخول لإضافة المنتجات إلى سلة التسوق."}
            </span>
          </div>
        )}

        {/* Alerts / Info */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center gap-3">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-red tracking-widest uppercase block">
            {t('brand_id')}
          </span>
          <h1 className="font-urbanist font-extrabold text-3xl text-brand-navy uppercase tracking-wider">
            {authTab === 'login' ? t('login_tab') : t('register_tab')}
          </h1>
        </div>

        {/* Tabs to switch Login / Register */}
        <div className="flex border border-brand-border rounded-full p-1 bg-brand-sec">
          <button
            onClick={() => { setAuthTab('login'); setError(null); }}
            className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
              authTab === 'login' 
                ? 'bg-brand-navy text-white shadow-sm' 
                : 'text-brand-gray hover:text-brand-navy'
            }`}
          >
            {t('login_tab')}
          </button>
          <button
            onClick={() => { setAuthTab('register'); setError(null); }}
            className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
              authTab === 'register' 
                ? 'bg-brand-navy text-white shadow-sm' 
                : 'text-brand-gray hover:text-brand-navy'
            }`}
          >
            {t('register_tab')}
          </button>
        </div>

        {authTab === 'login' ? (
          // LOGIN FORM
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-navy tracking-wider uppercase block">
                {t('email_label')}
              </label>
              <div className="relative flex items-center group">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 ltr:pr-11 rtl:pl-11 py-3 border border-brand-border rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 bg-brand-sec placeholder-brand-gray transition-all duration-300"
                  dir="ltr"
                />
                <Mail className="absolute ltr:right-4 rtl:left-4 w-4 h-4 text-brand-gray group-focus-within:text-brand-navy transition-colors pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-navy tracking-wider uppercase block">
                {t('password_label')}
              </label>
              <div className="relative flex items-center group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 ltr:pr-11 rtl:pl-11 py-3 border border-brand-border rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 bg-brand-sec placeholder-brand-gray transition-all duration-300"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute ltr:right-4 rtl:left-4 text-brand-gray hover:text-brand-navy focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 bg-brand-navy hover:bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md cursor-pointer disabled:opacity-55"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{t('submit_login')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>
        ) : (
          // REGISTER FORM
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-navy tracking-wider uppercase block">
                  {t('firstname_label')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={registerFirstName}
                  onChange={(e) => setRegisterFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-border rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 bg-brand-sec placeholder-brand-gray transition-all duration-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-navy tracking-wider uppercase block">
                  {t('lastname_label')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={registerLastName}
                  onChange={(e) => setRegisterLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-border rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 bg-brand-sec placeholder-brand-gray transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-navy tracking-wider uppercase block">
                {t('email_label')}
              </label>
              <div className="relative flex items-center group">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-4 ltr:pr-11 rtl:pl-11 py-3 border border-brand-border rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 bg-brand-sec placeholder-brand-gray transition-all duration-300"
                  dir="ltr"
                />
                <Mail className="absolute ltr:right-4 rtl:left-4 w-4 h-4 text-brand-gray group-focus-within:text-brand-navy transition-colors pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-brand-navy tracking-wider uppercase block">
                {t('password_label')}
              </label>
              <div className="relative flex items-center group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-4 ltr:pr-11 rtl:pl-11 py-3 border border-brand-border rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-navy focus:ring-4 focus:ring-brand-navy/10 bg-brand-sec placeholder-brand-gray transition-all duration-300"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute ltr:right-4 rtl:left-4 text-brand-gray hover:text-brand-navy focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 bg-brand-navy hover:bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md cursor-pointer disabled:opacity-55"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{t('submit_register')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-white text-brand-dark">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
