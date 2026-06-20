"use client";

import { useI18n } from '@/lib/i18n';
import { STUDIO } from '@/lib/studio';

export default function ServiceFooter() {
  const { locale, t } = useI18n();
  const name = locale === 'ar' ? STUDIO.nameAr : STUDIO.nameEn;

  return (
    <footer className="w-full bg-brand-navy text-white pt-12 pb-10 mt-8 border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <span className="font-urbanist font-extrabold text-xl tracking-wider block">{name}</span>
          <p className="text-xs text-brand-gray max-w-sm leading-relaxed">
            {locale === 'ar' ? STUDIO.taglineAr : STUDIO.taglineEn}
          </p>
        </div>

        <div className="text-xs text-brand-gray space-y-1">
          <p>{t('svc_footer_contact')}: {STUDIO.contactEmail}</p>
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
