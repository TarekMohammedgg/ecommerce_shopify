"use client";

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { CheckCircle2, Loader2 } from 'lucide-react';

const BUSINESS_TYPES = [
  { value: 'fashion', labelKey: 'svc_type_fashion' },
  { value: 'restaurant', labelKey: 'svc_type_restaurant' },
  { value: 'other', labelKey: 'svc_type_other' },
];

const INITIAL = {
  businessName: '',
  businessType: 'fashion',
  contactName: '',
  email: '',
  phone: '',
  message: '',
};

export default function WebsiteRequestForm() {
  const { t } = useI18n();
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/website-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('svc_form_error'));
      }

      setStatus('success');
      setSubmittedEmail(form.email);
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      setError(err.message || t('svc_form_error'));
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-brand-border bg-brand-sec p-10 text-center space-y-4 animate-slide-up">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" aria-hidden="true" />
        <h3 className="font-urbanist font-extrabold text-xl text-brand-navy">{t('svc_form_success_title')}</h3>
        <p className="text-sm text-brand-gray max-w-md mx-auto">
          {t('svc_form_success_body').replace('{email}', submittedEmail)}
        </p>
        <button
          type="button"
          onClick={() => { setStatus('idle'); setSubmittedEmail(''); }}
          className="text-xs font-bold text-brand-navy hover:text-brand-red uppercase tracking-widest transition-colors"
        >
          {t('svc_form_another')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="businessName" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
            {t('svc_field_business')}
          </label>
          <input
            id="businessName"
            required
            value={form.businessName}
            onChange={update('businessName')}
            placeholder={t('svc_placeholder_business')}
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark placeholder-brand-gray focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="businessType" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
            {t('svc_field_type')}
          </label>
          <select
            id="businessType"
            value={form.businessType}
            onChange={update('businessType')}
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
          >
            {BUSINESS_TYPES.map(({ value, labelKey }) => (
              <option key={value} value={value}>
                {t(labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contactName" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
            {t('svc_field_name')}
          </label>
          <input
            id="contactName"
            required
            value={form.contactName}
            onChange={update('contactName')}
            placeholder={t('svc_placeholder_name')}
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark placeholder-brand-gray focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
            {t('email_label')}
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder={t('email_placeholder')}
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark placeholder-brand-gray focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="phone" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
            {t('profile_phone')} <span className="text-brand-gray font-normal normal-case">({t('svc_optional')})</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="+20 ..."
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark placeholder-brand-gray focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="message" className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
            {t('svc_field_message')}
          </label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={update('message')}
            placeholder={t('svc_placeholder_message')}
            className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark placeholder-brand-gray focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition-all resize-y min-h-[100px]"
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-sm text-brand-red" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-3.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-red rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {t('svc_form_sending')}
          </>
        ) : (
          t('svc_form_submit')
        )}
      </button>
    </form>
  );
}
