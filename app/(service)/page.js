"use client";

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { ArrowLeft, ArrowRight, Shirt, UtensilsCrossed, Clock } from 'lucide-react';
import WebsiteRequestForm from '@/components/WebsiteRequestForm';

const HERO_CARDS = [
  {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80',
    alt: 'Laptop with website design workspace',
    className: 'transform -rotate-6 -translate-x-3 sm:-translate-x-6 md:-translate-x-8 z-10 shadow-md',
  },
  {
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&q=80',
    alt: 'Customer paying with mobile phone at checkout',
    className: 'transform rotate-6 translate-x-3 sm:translate-x-6 md:translate-x-8 z-20 shadow-lg',
  },
];

const DEMOS = [
  {
    id: 'fashion',
    href: '/demo/fashion',
    live: true,
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    titleKey: 'svc_demo_fashion_title',
    descKey: 'svc_demo_fashion_desc',
    tagKey: 'svc_demo_live',
  },
  {
    id: 'restaurant',
    href: null,
    live: false,
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    titleKey: 'svc_demo_restaurant_title',
    descKey: 'svc_demo_restaurant_desc',
    tagKey: 'svc_demo_soon',
  },
];

const STEPS = [
  { num: '01', titleKey: 'svc_step1_title', descKey: 'svc_step1_desc' },
  { num: '02', titleKey: 'svc_step2_title', descKey: 'svc_step2_desc' },
  { num: '03', titleKey: 'svc_step3_title', descKey: 'svc_step3_desc' },
];

export default function ServiceLandingPage() {
  const { t, locale } = useI18n();
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full min-w-0 flex flex-col bg-white pb-16 overflow-x-clip">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full min-w-0 pt-10 pb-6 animate-slide-up">
        <div className="w-full min-w-0 bg-brand-sec rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center p-6 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute start-0 top-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent pointer-events-none" />

          <div className="lg:col-span-7 space-y-6 relative z-10">
            <span className="text-xs md:text-sm font-bold text-brand-red tracking-wider uppercase block">
              {t('svc_hero_kicker')}
            </span>
            <h1 className="font-urbanist font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-navy leading-tight">
              {t('svc_hero_title')}
            </h1>
            <p className="text-brand-gray text-sm md:text-base max-w-lg leading-relaxed">
              {t('svc_hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#demos"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-red rounded-full transition-all duration-300"
              >
                <span>{t('svc_hero_cta_demo')}</span>
                <Arrow className="w-4 h-4" />
              </a>
              <a
                href="#request"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-navy border border-brand-border text-xs font-bold uppercase tracking-widest hover:border-brand-navy rounded-full transition-all duration-300"
              >
                {t('svc_hero_cta_request')}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[220px] sm:h-[260px] md:h-[340px] w-full min-w-0 flex items-center justify-center z-10 overflow-hidden">
            {HERO_CARDS.map((card) => (
              <div
                key={card.src}
                className={`absolute w-[140px] h-[190px] sm:w-[180px] sm:h-[240px] bg-white border border-brand-border rounded-xl overflow-hidden ${card.className}`}
              >
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demos */}
      <section id="demos" className="max-w-7xl mx-auto px-4 sm:px-6 w-full min-w-0 py-12 space-y-8 animate-slide-up">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-red tracking-widest uppercase block">
            {t('svc_demos_kicker')}
          </span>
          <h2 className="font-urbanist font-extrabold text-2xl md:text-3xl text-brand-navy uppercase tracking-wider">
            {t('svc_demos_title')}
          </h2>
          <p className="text-sm text-brand-gray max-w-xl">{t('svc_demos_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {DEMOS.map((demo) => {
            const Icon = demo.icon;
            const card = (
              <article
                key={demo.id}
                className={`group rounded-2xl border border-brand-border bg-white overflow-hidden product-card-shadow ${
                  demo.live ? 'cursor-pointer' : 'opacity-90'
                }`}
              >
                <div className="relative h-44 bg-brand-sec overflow-hidden">
                  <img
                    src={demo.image}
                    alt=""
                    className="w-full h-full object-cover img-zoom"
                  />
                  <span
                    className={`absolute top-3 start-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      demo.live
                        ? 'bg-brand-red text-white'
                        : 'bg-brand-navy text-white'
                    }`}
                  >
                    {demo.live ? t(demo.tagKey) : (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t(demo.tagKey)}
                      </span>
                    )}
                  </span>
                  <div className="absolute bottom-3 end-3 w-10 h-10 rounded-full bg-white border border-brand-border flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-brand-navy" />
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-urbanist font-bold text-base text-brand-navy">{t(demo.titleKey)}</h3>
                  <p className="text-xs text-brand-gray leading-relaxed">{t(demo.descKey)}</p>
                  {demo.live && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-red uppercase tracking-wider group-hover:gap-2 transition-all">
                      {t('svc_demo_explore')}
                      <Arrow className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </article>
            );

            return demo.href ? (
              <Link key={demo.id} href={demo.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={demo.id}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-4 sm:px-6 w-full min-w-0 py-12 animate-slide-up">
        <div className="w-full min-w-0 bg-brand-navy text-white rounded-2xl p-6 sm:p-8 md:p-12 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-brand-red tracking-widest uppercase block">
              {t('svc_how_kicker')}
            </span>
            <h2 className="font-urbanist font-extrabold text-2xl md:text-3xl uppercase tracking-wider">
              {t('svc_how_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center space-y-3">
                <span className="inline-block font-urbanist font-extrabold text-3xl text-brand-red">{step.num}</span>
                <h3 className="font-urbanist font-bold text-sm uppercase tracking-wider">{t(step.titleKey)}</h3>
                <p className="text-xs text-brand-gray leading-relaxed max-w-xs mx-auto">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request form */}
      <section id="request" className="max-w-7xl mx-auto px-4 sm:px-6 w-full min-w-0 py-12 animate-slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4 lg:sticky lg:top-28">
            <span className="text-xs font-bold text-brand-red tracking-widest uppercase block">
              {t('svc_request_kicker')}
            </span>
            <h2 className="font-urbanist font-extrabold text-2xl md:text-3xl text-brand-navy uppercase tracking-wider leading-tight">
              {t('svc_request_title')}
            </h2>
            <p className="text-sm text-brand-gray leading-relaxed max-w-md">{t('svc_request_subtitle')}</p>

            <ul className="space-y-3 pt-4">
              {['svc_benefit1', 'svc_benefit2', 'svc_benefit3'].map((key) => (
                <li key={key} className="flex items-start gap-3 text-sm text-brand-dark">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-6 md:p-8 shadow-sm">
            <WebsiteRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
}
