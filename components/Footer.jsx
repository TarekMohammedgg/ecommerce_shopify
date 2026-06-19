"use client";

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t, locale } = useI18n();

  return (
    <footer className="w-full bg-brand-navy text-white pt-16 pb-12 mt-12 border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Logo and About */}
        <div className="space-y-4">
          <span className="font-urbanist font-extrabold text-2xl tracking-wider select-none block">
            NeoMirai<span className="text-brand-red">.com</span>
          </span>
          <p className="text-xs text-brand-gray leading-relaxed max-w-sm">
            {locale === 'en' 
              ? "Redefining your everyday style with high-contrast, premium, and breathable clothing designs. Empowered by headless technology."
              : "إعادة تعريف أسلوبك اليومي بتصاميم ملابس راقية، عالية التباين، ومريحة. مدعومة بتقنيات التصميم الحديثة."}
          </p>
        </div>

        {/* Shop Category Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider text-brand-sec uppercase">
            {locale === 'en' ? "Shop Categories" : "أقسام المتجر"}
          </h4>
          <ul className="space-y-2 text-xs text-brand-gray uppercase tracking-wider font-medium">
            <li>
              <Link href="/shop?category=SHIRTS" className="hover:text-brand-red transition-colors">
                {t('filter_shirts')}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=PANTS" className="hover:text-brand-red transition-colors">
                {t('filter_pants')}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=OUTERWEAR" className="hover:text-brand-red transition-colors">
                {t('filter_outerwear')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider text-brand-sec uppercase">
            {locale === 'en' ? "Information" : "معلومات"}
          </h4>
          <ul className="space-y-2 text-xs text-brand-gray uppercase tracking-wider font-medium">
            <li>
              <Link href="/#manifesto" className="hover:text-brand-red transition-colors">
                {t('nav_about')}
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-brand-red transition-colors">
                {locale === 'en' ? "Contact Us" : "اتصل بنا"}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand-red transition-colors">
                {locale === 'en' ? "Careers" : "الوظائف"}
              </a>
            </li>
          </ul>
        </div>

        {/* Payment & Location Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider text-brand-sec uppercase">
            {locale === 'en' ? "Locate Us" : "موقعنا"}
          </h4>
          <p className="text-xs text-brand-gray leading-relaxed">
            HQ: Tokyo / Cairo
            <br />
            Support: care@neomirai.com
            <br />
            Version: V2.6 Stable
          </p>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-brand-gray/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-gray">
        <span>{t('copyright')}</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-red transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
