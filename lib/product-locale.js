/**
 * Arabic product copy — fallback when Shopify Translate hasn't published AR
 * to Storefront API yet. API @inContext(language: AR) takes priority when live.
 */
export const PRODUCT_TRANSLATIONS_AR = {
  'essential-cotton-crew-t-shirt': {
    title: 'تيشيرت قطن أساسي برقبة دائرية',
    description:
      'تيشيرت يومي ناعم برقبة دائرية من قطن قابل للتنفس. قصة مريحة regular fit لأسلوب كاجوال سهل.',
  },
  'classic-fleece-pullover-hoodie': {
    title: 'هودي صوف كلاسيكي بغطاء رأس',
    description:
      'هودي صوف دافئ بجيب كنغارو واسع، حبل قابل للتعديل، وأطراف مطاطية مريحة للاستخدام اليومي.',
  },
  'high-rise-straight-leg-jeans': {
    title: 'جينز بخصر عالي وساق مستقيمة',
    description:
      'دنيم كلاسيكي بخمس جيوب بخصر عالي وساق مستقيمة. قماش غني بالقطن مع لمسة من الإسترتش.',
  },
  'relaxed-linen-button-up-shirt': {
    title: 'قميص كتان مريح بأزرار',
    description:
      'قميص خفيف من مزيج الكتان بقصة مريحة، ياقة كلاسيكية، وأزرار أمامية. مثالي للطبقات في الطقس الدافئ.',
  },
  'tailored-longline-blazer': {
    title: 'بليزر طويل مفصل',
    description:
      'بليزر أنيق بزر واحد بقصة طويلة، ياقات محززة، وجيوب أمامية عملية. مبطّن بالكامل لانسيابية نظيفة.',
  },
  'faux-leather-biker-jacket': {
    title: 'جاكيت بايكر جلد صناعي',
    description:
      'جاكيت بايكر عصري من جلد صناعي ناعم بسحّاب مائل، تفاصيل معدنية، وجيوب بسحّاب.',
  },
  'everyday-tapered-chinos': {
    title: 'بنطلون تشينو مستدق للاستخدام اليومي',
    description:
      'تشينو قطن مرن متعدد الاستخدامات بساق مستدقة نظيفة، حلقات حزام، وأربعة جيوب عملية.',
  },
  'floral-midi-wrap-dress': {
    title: 'فستان ميدي بوهة زهرية',
    description:
      'فستان ميدي انسيابي بأمامية ملفوفة، ربطة خصر قابلة للتعديل، وطبعة زهرية ناعمة. من النهار للمساء.',
  },
  'lightweight-quilted-puffer-vest': {
    title: 'فيست مبطن خفيف الوزن',
    description:
      'فيست مبطن خفيف بياقة واقفة، سحّاب أمامي، وجيوب جانبية. دفء بدون حجم زائد.',
  },
  'organic-cotton-graphic-tee': {
    title: 'تيشيرت قطن عضوي بطباعة',
    description:
      'تيشيرت مريح بطباعة من قطن عضوي ناعم. رقبة دائرية محززة وطباعة مائية متينة.',
  },
};

export function applyProductLocale(product, locale) {
  if (!product || locale !== 'ar') return product;

  const translation = PRODUCT_TRANSLATIONS_AR[product.handle];
  if (!translation) return product;

  return {
    ...product,
    title: translation.title || product.title,
    description: translation.description || product.description,
  };
}

export function applyProductsLocale(products, locale) {
  return products.map((product) => applyProductLocale(product, locale));
}

/** True when Shopify returns same title for EN and AR — translation not published yet */
export function needsLocaleFallback(product, apiProductEn, locale) {
  if (locale !== 'ar' || !product || !apiProductEn) return false;
  return product.title === apiProductEn.title && Boolean(PRODUCT_TRANSLATIONS_AR[product.handle]);
}
