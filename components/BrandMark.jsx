"use client";

import { useI18n } from '@/lib/i18n';
import { BRAND } from '@/lib/brand';

export default function BrandMark({ className = '' }) {
  const { locale } = useI18n();
  const name = locale === 'ar' ? BRAND.nameAr : BRAND.nameEn;

  return (
    <span className={className}>
      {name}
      {locale === 'en' && <span className="text-brand-red">.com</span>}
    </span>
  );
}
