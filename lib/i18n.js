"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    nav_shop: "CATALOG",
    nav_about: "MANIFESTO",
    nav_cart: "CART",
    lang_toggle: "AR",
    hero_kicker: "#Big Fashion Sale",
    hero_title_1: "Limited Time Offer!",
    hero_title_2: "Up to 50% OFF!",
    hero_subtitle: "Redefine Your Everyday Style. Pure materials, high performance, and minimal organic aesthetics.",
    btn_shop_now: "GET PIECES",
    manifesto_kicker: "01 · THE MANIFESTO",
    manifesto_title: "WE WEAR THE FUTURE TODAY",
    manifesto_body_1: "In a world of mass-produced replication, we choose deliberate craftsmanship. We believe clothing should be a blueprint of identity, combining strict geometric precision with organic natural growth.",
    manifesto_body_2: "Inspired by Ukiyo-e woodblock printing and Solarpunk optimistic ecology, our collection utilizes sustainable materials powered by technical design tools. Every piece tells a story of balance, scale, and time.",
    featured_title: "FEATURED PIECES",
    size_label: "SIZE",
    color_label: "COLOR",
    weight_label: "FABRIC WEIGHT",
    add_to_cart: "ADD TO PIECES",
    out_of_stock: "UNAVAILABLE",
    checkout: "PROCEED TO CHECKOUT",
    remove_item: "REMOVE",
    cart_title: "YOUR PIECES",
    cart_empty: "NO PIECES COLLECTED YET",
    subtotal: "SUBTOTAL",
    filter_all: "ALL ITEMS",
    filter_t_shirts: "T-SHIRTS",
    filter_shirts: "SHIRTS",
    filter_hoodies: "HOODIES",
    filter_jackets: "JACKETS & VESTS",
    filter_pants: "PANTS & JEANS",
    filter_dresses: "DRESSES",
    filter_color: "COLOR",
    filter_size: "SIZE",
    filter_price: "PRICE RANGE",
    filter_sort: "SORT BY",
    clear_filters: "CLEAR FILTERS",
    sort_default: "NEW ARRIVALS",
    sort_price_asc: "PRICE: LOW TO HIGH",
    sort_price_desc: "PRICE: HIGH TO LOW",
    copyright: "© 2026 NEO MIRAI. ALL RIGHTS CONSERVED.",
    currency: "EGP",
    items_count: "ITEMS",
    close: "CLOSE",
    view_all: "VIEW ALL",
    todays_for_you: "TODAYS FOR YOU!",
    flash_sale: "FLASH SALE",
    sold_1: "9/10 sold",
    sold_2: "7/10 sold",
    sold_3: "5/10 sold",
    sold_4: "2/10 sold",
    profile_title: "MY PROFILE",
    profile_welcome: "WELCOME BACK,",
    logout_btn: "LOG OUT",
    login_tab: "SIGN IN",
    register_tab: "CREATE ACCOUNT",
    email_label: "EMAIL ADDRESS",
    password_label: "PASSWORD",
    firstname_label: "FIRST NAME",
    lastname_label: "LAST NAME",
    submit_login: "SIGN IN TO ACCOUNT",
    submit_register: "CREATE MY ACCOUNT",
    google_login: "CONTINUE WITH GOOGLE",
    orders_tab: "MY ORDERS",
    favourites_tab: "MY FAVOURITES",
    cart_tab: "MY FAVORITE BAG",
    no_orders: "You haven't placed any orders yet.",
    no_favourites: "You haven't added any favourites yet.",
    no_cart_items: "You haven't added any items to your bag yet.",
    order_number: "Order",
    order_date: "Placed on",
    order_total: "Total",
    order_status: "Status",
    unfulfilled: "Processing",
    fulfilled: "Shipped",
    authorized: "Paid",
    pending: "Pending",
    checkout_preparing: "Preparing your order...",
    checkout_redirecting: "Redirecting to payment...",
    checkout_subtitle: "Please wait while we set up secure checkout",
    checkout_error_title: "Checkout unavailable",
    checkout_error_default: "Something went wrong. Please try again.",
    checkout_retry: "Try again",
    checkout_back_to_shop: "Back to shop"
  },
  ar: {
    nav_shop: "المجموعات",
    nav_about: "البيان الفني",
    nav_cart: "السلة",
    lang_toggle: "EN",
    hero_kicker: "#تخفيضات الموضة الكبرى",
    hero_title_1: "عرض لفترة محدودة!",
    hero_title_2: "خصم يصل إلى ٥٠٪!",
    hero_subtitle: "أعد تعريف أسلوبك اليومي. خامات نقية، أداء عالٍ، وجماليات عضوية مريحة.",
    btn_shop_now: "اكتشف القطع",
    manifesto_kicker: "٠١ · البيان الفني",
    manifesto_title: "نرتدي المستقبل اليوم",
    manifesto_body_1: "في عالم يعتمد على التكرار والإنتاج الكمي البحت، نختار الحرفية المتعمدة. نؤمن بأن الملابس يجب أن تكون بمثابة مخطط للهوية، تجمع بين الدقة الهندسية الصارمة والنمو الطبيعي العضوي.",
    manifesto_body_2: "مستوحاة من فن الطباعة الخشبية (Ukiyo-e) والبيئة المتفائلة لـ Solarpunk، تستخدم مجموعتنا مواد مستدامة مدعومة بأدوات تصميم تقنية. كل قطعة تروي قصة توازن وحجم وزمن.",
    featured_title: "القطع المميزة",
    size_label: "المقاس",
    color_label: "اللون",
    weight_label: "وزن القماش",
    add_to_cart: "إضافة للسلة",
    out_of_stock: "غير متوفر",
    checkout: "متابعة عملية الدفع",
    remove_item: "إزالة",
    cart_title: "حقيبتك الخاصة",
    cart_empty: "لا توجد قطع مضافة بعد",
    subtotal: "المجموع الفرعي",
    filter_all: "كل القطع",
    filter_t_shirts: "تيشرتات",
    filter_shirts: "قمصان",
    filter_hoodies: "هوديز",
    filter_jackets: "جاكيتات وسترات",
    filter_pants: "بناطيل وجينز",
    filter_dresses: "فساتين",
    filter_color: "اللون",
    filter_size: "المقاس",
    filter_price: "نطاق السعر",
    filter_sort: "ترتيب حسب",
    clear_filters: "مسح التصفية",
    sort_default: "وصل حديثاً",
    sort_price_asc: "السعر: من الأقل للأعلى",
    sort_price_desc: "السعر: من الأعلى للأقل",
    copyright: "© ٢٠٢٦ نيو ميراي. جميع الحقوق محفوظة.",
    currency: "ج.م",
    items_count: "قطع",
    close: "إغلاق",
    view_all: "عرض الكل",
    todays_for_you: "مختارات اليوم لك!",
    flash_sale: "عروض خاطفة",
    sold_1: "تم بيع ٩/١٠",
    sold_2: "تم بيع ٧/١٠",
    sold_3: "تم بيع ٥/١٠",
    sold_4: "تم بيع ٢/١٠",
    profile_title: "ملفي الشخصي",
    profile_welcome: "مرحباً بك مجدداً،",
    logout_btn: "تسجيل الخروج",
    login_tab: "تسجيل الدخول",
    register_tab: "إنشاء حساب",
    email_label: "البريد الإلكتروني",
    password_label: "كلمة المرور",
    firstname_label: "الاسم الأول",
    lastname_label: "اسم العائلة",
    submit_login: "تسجيل الدخول إلى الحساب",
    submit_register: "إنشاء حسابي الخاص",
    google_login: "المتابعة باستخدام جوجل",
    orders_tab: "طلباتي",
    favourites_tab: "المفضلة",
    cart_tab: "حقيبتك المفضلة",
    no_orders: "لم تقم بإنشاء أي طلبات بعد.",
    no_favourites: "لم تقم بإضافة أي قطع للمفضلة بعد.",
    no_cart_items: "لم تقم بإضافة أي قطع لحقيبتك بعد.",
    order_number: "طلب رقم",
    order_date: "تاريخ الطلب",
    order_total: "المجموع",
    order_status: "الحالة",
    unfulfilled: "قيد المعالجة",
    fulfilled: "تم الشحن",
    authorized: "تم الدفع",
    pending: "معلق",
    checkout_preparing: "جاري تجهيز طلبك...",
    checkout_redirecting: "جاري التحويل للدفع...",
    checkout_subtitle: "يرجى الانتظار بينما نجهز عملية الدفع الآمنة",
    checkout_error_title: "تعذر إتمام الدفع",
    checkout_error_default: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    checkout_retry: "حاول مرة أخرى",
    checkout_back_to_shop: "العودة للمتجر"
  }
};

const I18nContext = createContext({
  locale: 'ar',
  t: (key) => key,
  setLocale: () => {},
  dir: 'rtl'
});

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('ar');

  // Load locale on mount asynchronously to prevent hydration mismatch and eslint warning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neo_mirai_locale');
      if (saved === 'ar' || saved === 'en') {
        setTimeout(() => {
          setLocaleState(saved);
        }, 0);
      }
    }
  }, []);

  const setLocale = (newLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('neo_mirai_locale', newLocale);
  };

  const t = (key) => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = locale;
    }
  }, [locale, dir]);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
