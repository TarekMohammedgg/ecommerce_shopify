"use client";

import { useI18n } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';

export default function BrandMark({ className = '' }) {
  const { locale } = useI18n();
  const name = locale === 'ar' ? BRAND.nameAr : BRAND.nameEn;

  // Replace block with flex to avoid visual conflicts
  const cleanClassName = className.replace(/\bblock\b/g, 'flex').replace(/\binline-block\b/g, 'flex');

  return (
    <span className={`inline-flex items-center gap-2.5 ${cleanClassName}`}>
      <img src="/brand/target_logo.svg" alt="Naseej Logo" className="w-8 h-8 object-contain" />
      <span>
        {name}
        {locale === 'en' && <span className="text-brand-red">.com</span>}
      </span>
    </span>
  );
}
