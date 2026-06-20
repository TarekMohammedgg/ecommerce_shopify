import { NextResponse } from 'next/server';
import { createShopifyCart, getProduct, resolveVariantFromProduct } from '@/lib/shopify';

const SHOPIFY_VARIANT_ID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
const MAX_CART_LINES = 50;
const MAX_QUANTITY = 100;

async function resolveLineItem(cartEntry) {
  const quantity = Number(cartEntry?.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new Error('Cart contains an invalid quantity.');
  }

  let variantId = cartEntry?.variantId;
  if (!SHOPIFY_VARIANT_ID.test(variantId || '') && SHOPIFY_VARIANT_ID.test(cartEntry?.id || '')) {
    variantId = cartEntry.id;
  }

  if (!SHOPIFY_VARIANT_ID.test(variantId || '') && cartEntry?.handle) {
    const product = await getProduct(cartEntry.handle);
    variantId = resolveVariantFromProduct(product, cartEntry.color, cartEntry.size);
  }

  if (!SHOPIFY_VARIANT_ID.test(variantId || '')) {
    throw new Error(`Could not find an available variant for "${cartEntry?.title || 'item'}".`);
  }

  return { variantId, quantity };
}

export async function POST(request) {
  let checkoutRequest;
  try {
    checkoutRequest = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { cartItems, customerAccessToken } = checkoutRequest || {};
  if (!Array.isArray(cartItems) || cartItems.length < 1 || cartItems.length > MAX_CART_LINES) {
    return NextResponse.json({ error: 'Cart is empty or too large.' }, { status: 400 });
  }

  try {
    const lineItems = await Promise.all(cartItems.map(resolveLineItem));
    const cart = await createShopifyCart(lineItems, { customerAccessToken });

    if (!cart?.checkoutUrl) {
      throw new Error('Shopify did not return a checkout URL.');
    }

    return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
  } catch (error) {
    console.error('Checkout creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Unable to create checkout. Please try again.' },
      { status: 502 }
    );
  }
}
