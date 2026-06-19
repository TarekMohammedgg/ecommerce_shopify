const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`;

// Map Next.js locale → Shopify LanguageCode enum
const LOCALE_TO_SHOPIFY_LANG = {
  ar: 'AR',
  en: 'EN',
};

export function mapLocaleToShopifyLang(locale) {
  return LOCALE_TO_SHOPIFY_LANG[locale] || 'EN';
}

// High-quality mock products from shopify_clothing_dummy_products.csv
const MOCK_PRODUCTS = [
  {
    id: "gid://shopify/Product/csv-1",
    title: "Essential Cotton Crew T-Shirt",
    handle: "essential-cotton-crew-t-shirt",
    description: "A soft everyday crew-neck T-shirt made from breathable cotton. Cut in a comfortable regular fit for easy casual styling.",
    category: "T-SHIRTS",
    price: 1199,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
    colors: ["BLACK"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "T-Shirts", "Black", "New Arrival", "Best Seller"]
  },
  {
    id: "gid://shopify/Product/csv-2",
    title: "Classic Fleece Pullover Hoodie",
    handle: "classic-fleece-pullover-hoodie",
    description: "A warm fleece pullover hoodie with a roomy kangaroo pocket, adjustable drawcord, and ribbed cuffs for daily comfort.",
    category: "HOODIES",
    price: 2699,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"],
    colors: ["HEATHER GRAY"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Hoodies & Sweatshirts", "Heather Gray", "New Arrival", "Keep Stylish"]
  },
  {
    id: "gid://shopify/Product/csv-3",
    title: "High-Rise Straight Leg Jeans",
    handle: "high-rise-straight-leg-jeans",
    description: "Classic five-pocket denim with a flattering high rise and straight leg. The cotton-rich fabric includes a touch of stretch.",
    category: "PANTS",
    price: 3499,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80"],
    colors: ["MID BLUE"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Jeans", "Mid Blue", "New Arrival", "Best Seller"]
  },
  {
    id: "gid://shopify/Product/csv-4",
    title: "Relaxed Linen Button-Up Shirt",
    handle: "relaxed-linen-button-up-shirt",
    description: "A lightweight linen-blend shirt with a relaxed silhouette, classic collar, and button front. Ideal for warm-weather layering.",
    category: "SHIRTS",
    price: 2499,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"],
    colors: ["WHITE"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Shirts", "White", "New Arrival", "Official Store"]
  },
  {
    id: "gid://shopify/Product/csv-5",
    title: "Tailored Longline Blazer",
    handle: "tailored-longline-blazer",
    description: "A polished single-breasted blazer with a longline cut, notched lapels, and practical front pockets. Fully lined for a clean drape.",
    category: "JACKETS",
    price: 5499,
    images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80"],
    colors: ["CAMEL"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Blazers", "Camel", "New Arrival", "Official Store"]
  },
  {
    id: "gid://shopify/Product/csv-6",
    title: "Faux Leather Biker Jacket",
    handle: "faux-leather-biker-jacket",
    description: "A modern biker jacket in smooth faux leather with an asymmetric zip, metal hardware, and zippered pockets.",
    category: "JACKETS",
    price: 4699,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"],
    colors: ["BLACK"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Jackets", "Black", "New Arrival", "Keep Stylish"]
  },
  {
    id: "gid://shopify/Product/csv-7",
    title: "Everyday Tapered Chinos",
    handle: "everyday-tapered-chinos",
    description: "Versatile stretch-cotton chinos with a clean tapered leg, belt loops, and four functional pockets. Smart enough for work and relaxed enough for weekends.",
    category: "PANTS",
    price: 2999,
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"],
    colors: ["OLIVE"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Chinos", "Olive", "New Arrival", "Best Seller"]
  },
  {
    id: "gid://shopify/Product/csv-8",
    title: "Floral Midi Wrap Dress",
    handle: "floral-midi-wrap-dress",
    description: "A flowing midi dress with a flattering wrap front, adjustable waist tie, and soft floral print. Designed for day-to-evening wear.",
    category: "DRESSES",
    price: 3999,
    images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80"],
    colors: ["NAVY FLORAL"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Dresses", "Navy Floral", "New Arrival", "Special Discount"]
  },
  {
    id: "gid://shopify/Product/csv-9",
    title: "Lightweight Quilted Puffer Vest",
    handle: "lightweight-quilted-puffer-vest",
    description: "A lightweight quilted vest with a stand collar, zip front, and side pockets. Adds warmth without unnecessary bulk.",
    category: "JACKETS",
    price: 3249,
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"],
    colors: ["STONE"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "Vests", "Stone", "New Arrival", "Special Discount"]
  },
  {
    id: "gid://shopify/Product/csv-10",
    title: "Organic Cotton Graphic Tee",
    handle: "organic-cotton-graphic-tee",
    description: "A relaxed graphic tee made with soft organic cotton. Finished with a ribbed crew neck and a durable water-based print.",
    category: "T-SHIRTS",
    price: 1499,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"],
    colors: ["NATURAL"],
    sizes: ["S", "M", "L"],
    available: true,
    tags: ["Clothing", "T-Shirts", "Natural", "New Arrival", "Keep Stylish"]
  }
];

// Helper to dynamically populate sizes, colors, and variants for mock/CSV products
function populateMockVariants(product) {
  if (!product) return null;
  if (product.variants && product.variants.length > 0) return product;
  
  const colors = product.colors || ["BLACK"];
  const sizes = product.sizes || ["S", "M", "L"];
  const variants = [];
  const mockWeightBase = product.price > 3000 ? 0.85 : product.price > 2000 ? 0.65 : 0.35; // kg
  
  colors.forEach(col => {
    sizes.forEach(sz => {
      const sizeModifier = sz === "XS" ? 0.85 : sz === "S" ? 0.95 : sz === "M" ? 1.0 : sz === "L" ? 1.05 : 1.15;
      const finalWeight = Math.round(mockWeightBase * sizeModifier * 100) / 100;
      variants.push({
        id: `${product.id}-${col}-${sz}`,
        title: `${col} / ${sz}`,
        weight: finalWeight,
        weightUnit: "KILOGRAMS",
        selectedOptions: [
          { name: "COLOR", value: col },
          { name: "SIZE", value: sz }
        ]
      });
    });
  });
  
  return { ...product, variants };
}

async function shopifyFetch({ query, variables = {}, locale, strict = false }) {
  // Inject language variable when locale provided
  if (locale) {
    variables.language = mapLocaleToShopifyLang(locale);
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Shopify API error: ${res.statusText}`);
    }

    const { data, errors } = await res.json();

    if (errors) {
      throw new Error(errors.map(e => e.message).join("\n"));
    }

    return data;
  } catch (error) {
    if (strict) {
      throw error;
    }
    console.warn("Shopify API fetch failed, using mock data. Error:", error.message);
    return null;
  }
}

export function resolveVariantFromProduct(product, color = "", size = "") {
  if (!product?.variants?.length) return null;

  const normalizedColor = (color || "").toUpperCase();
  const normalizedSize = (size || "").toUpperCase();

  const variant = product.variants.find((v) => {
    const sizeOpt = v.selectedOptions?.find(
      (opt) => opt.name === "SIZE" || opt.name === "المقاس"
    );
    const colorOpt = v.selectedOptions?.find(
      (opt) => opt.name === "COLOR" || opt.name === "اللون"
    );
    const sizeMatch = sizeOpt ? sizeOpt.value === normalizedSize : true;
    const colorMatch = colorOpt ? colorOpt.value === normalizedColor : true;
    return sizeMatch && colorMatch;
  });

  return variant?.id || product.variants[0]?.id || null;
}

// Convert Shopify GraphQL structures to simple flat JSON structure
function formatShopifyProduct(node) {
  const price = Math.round(parseFloat(node.priceRange?.minVariantPrice?.amount || "0"));
  const images = node.images?.edges?.map(e => e.node.url) || [];
  
  // Extract colors and sizes from variants or options
  const colorsSet = new Set();
  const sizesSet = new Set();
  
  node.variants?.edges?.forEach(e => {
    e.node.selectedOptions?.forEach(opt => {
      const name = opt.name.toUpperCase();
      if (name === "COLOR" || name === "اللون") {
        colorsSet.add(opt.value.toUpperCase());
      }
      if (name === "SIZE" || name === "المقاس" || name === "المقاسات") {
        sizesSet.add(opt.value.toUpperCase());
      }
    });
  });

  // Default fallbacks if options are empty
  const colors = colorsSet.size > 0 ? Array.from(colorsSet) : ["CHARCOAL BLACK", "SAKE CREAM"];
  const sizes = sizesSet.size > 0 ? Array.from(sizesSet) : ["S", "M", "L"];

  // Determine category based on collections or title
  const collections = node.collections?.edges?.map(e => e.node.handle.toUpperCase()) || [];
  const titleUpper = node.title.toUpperCase();
  let category = "SHIRTS";
  
  if (collections.includes("T-SHIRTS") || titleUpper.includes("T-SHIRT") || titleUpper.includes("TEE")) {
    category = "T-SHIRTS";
  } else if (collections.includes("HOODIES") || titleUpper.includes("HOODIE") || titleUpper.includes("SWEATSHIRT")) {
    category = "HOODIES";
  } else if (collections.includes("JEANS") || titleUpper.includes("JEANS") || collections.includes("PANTS") || titleUpper.includes("PANTS") || titleUpper.includes("CHINOS") || titleUpper.includes("TROUSERS")) {
    category = "PANTS";
  } else if (collections.includes("SHIRTS") || titleUpper.includes("SHIRT")) {
    category = "SHIRTS";
  } else if (collections.includes("JACKETS") || titleUpper.includes("JACKET") || titleUpper.includes("COAT") || titleUpper.includes("BLAZER") || titleUpper.includes("VEST") || titleUpper.includes("TRENCH")) {
    category = "JACKETS";
  } else if (collections.includes("DRESSES") || titleUpper.includes("DRESS")) {
    category = "DRESSES";
  }

  // Extract variants or generate mock ones with realistic weights
  let variants = [];
  if (node.id.includes('mock') || node.id.includes('csv')) {
    const mockWeightBase = price > 3000 ? 0.85 : price > 2000 ? 0.65 : 0.35; // kg
    colors.forEach(col => {
      sizes.forEach(sz => {
        const sizeModifier = sz === "XS" ? 0.85 : sz === "S" ? 0.95 : sz === "M" ? 1.0 : sz === "L" ? 1.05 : 1.15;
        const finalWeight = Math.round(mockWeightBase * sizeModifier * 100) / 100;
        variants.push({
          id: `${node.id}-${col}-${sz}`,
          title: `${col} / ${sz}`,
          weight: finalWeight,
          weightUnit: "KILOGRAMS",
          selectedOptions: [
            { name: "COLOR", value: col },
            { name: "SIZE", value: sz }
          ]
        });
      });
    });
  } else {
    variants = node.variants?.edges?.map(e => ({
      id: e.node.id,
      title: e.node.title,
      weight: e.node.weight || 0,
      weightUnit: e.node.weightUnit || "GRAMS",
      selectedOptions: e.node.selectedOptions?.map(opt => ({
        name: opt.name.toUpperCase(),
        value: opt.value.toUpperCase()
      })) || []
    })) || [];
  }

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    category,
    price,
    images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
    colors,
    sizes,
    variants,
    available: true,
    tags: node.tags || []
  };
}

export async function getProducts(locale) {
  const query = `
    query getProducts($language: LanguageCode) @inContext(language: $language) {
      products(first: 24) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  weight
                  weightUnit
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            collections(first: 5) {
              edges {
                node {
                  handle
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, locale });
  
  if (!data || !data.products || data.products.edges.length === 0) {
    return MOCK_PRODUCTS.map(populateMockVariants);
  }

  return data.products.edges.map(e => formatShopifyProduct(e.node));
}

export async function getProduct(handle, locale) {
  const query = `
    query getProduct($handle: String!, $language: LanguageCode) @inContext(language: $language) {
      product(handle: $handle) {
        id
        title
        handle
        description
        tags
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              weight
              weightUnit
              selectedOptions {
                name
                value
              }
            }
          }
        }
        collections(first: 5) {
          edges {
            node {
              handle
              title
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, variables: { handle }, locale });

  if (!data || !data.product) {
    const mock = MOCK_PRODUCTS.find(p => p.handle === handle);
    return mock ? populateMockVariants(mock) : null;
  }

  return formatShopifyProduct(data.product);
}

// Cart Management Mutations via Shopify Storefront API
export async function createShopifyCart(lineItems = [], options = {}) {
  const { customerAccessToken } = options;

  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const input = {
    lines: lineItems.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity
    }))
  };

  if (customerAccessToken) {
    input.buyerIdentity = { customerAccessToken };
  }

  const data = await shopifyFetch({ query, variables: { input }, strict: true });
  const result = data?.cartCreate;

  if (result?.userErrors?.length > 0) {
    throw new Error(result.userErrors.map((e) => e.message).join(', '));
  }

  return result?.cart || null;
}

export async function loginCustomer(email, password) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: { email, password }
  };

  const data = await shopifyFetch({ query, variables });
  return data?.customerAccessTokenCreate || null;
}

export async function registerCustomer(email, password, firstName, lastName) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
      firstName,
      lastName
    }
  };

  const data = await shopifyFetch({ query, variables });
  return data?.customerCreate || null;
}

export async function logoutCustomer(accessToken) {
  const query = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = { customerAccessToken: accessToken };
  const data = await shopifyFetch({ query, variables });
  return data?.customerAccessTokenDelete || null;
}

export async function getCustomerDetails(accessToken) {
  const query = `
    query getCustomerDetails($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        orders(first: 10) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image {
                        url
                      }
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { customerAccessToken: accessToken };
  const data = await shopifyFetch({ query, variables });
  return data?.customer || null;
}

