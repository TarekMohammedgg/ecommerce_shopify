export function resolveVariantFromProduct(product, color = '', size = '') {
  if (!product?.variants?.length) return null;

  const normalize = (value) => {
    const normalized = (value || '').trim().toUpperCase();
    return {
      XS: 'EXTRA SMALL',
      S: 'SMALL',
      M: 'MEDIUM',
      L: 'LARGE',
      XL: 'EXTRA LARGE',
    }[normalized] || normalized;
  };

  const normalizedColor = normalize(color);
  const normalizedSize = normalize(size);
  const variant = product.variants.find((candidate) => {
    const sizeOption = candidate.selectedOptions?.find((option) =>
      ['SIZE', 'المقاس', 'المقاسات'].includes(option.name.toUpperCase())
    );
    const colorOption = candidate.selectedOptions?.find((option) =>
      ['COLOR', 'اللون'].includes(option.name.toUpperCase())
    );

    return (!sizeOption || normalize(sizeOption.value) === normalizedSize)
      && (!colorOption || normalize(colorOption.value) === normalizedColor);
  });

  return variant?.id || product.variants[0]?.id || null;
}
