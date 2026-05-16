# Implementation Approach: Tienda + Loro Piana eFabrics

## Date: 2026-05-15
## Prepared for: Sastrería Manuel Fernández

---

## 1. LORO PIANA eFABRICS — FEASIBILITY AUDIT

### The Reality
After extensive research, **Loro Piana eFabrics is a closed native mobile application** (iOS/Android) designed for master tailors and personal stylists. It is **not a web platform**.

### What Does NOT Exist
| Integration Type | Availability |
|-----------------|--------------|
| Public REST API | ❌ None |
| JavaScript SDK / React wrapper | ❌ None |
| Embeddable iframe / widget | ❌ None |
| Web component | ❌ None |
| Developer documentation | ❌ None |
| Self-service signup | ❌ Professionally gated |

### What eFabrics Actually Is
- A native iPad/phone app for showroom appointments
- Features: 3D fabric browsing, AR garment visualization, real-time stock checks, order traceability
- Showcased at VivaTech 2022 by LVMH Innovation — always presented as an app, never as a web integration
- Access requires a verified tailoring business relationship with Loro Piana Textile Division

### Alternative Approaches (Ranked)

#### **Option A: B2B Partnership + Manual Integration (Recommended)**
- Contact Loro Piana Textile Division via [loropiana.com/textile/login](https://www.loropiana.com/textile/login)
- As an authorized bespoke tailor, negotiate access to digital fabric assets (swatch images, metadata, composition data)
- Manually build a "Loro Piana Collection" section inside your configurator with these assets
- Use the native eFabrics app during in-person or videollamada appointments as a companion sales tool
- **Pros:** Authentic, legally sound, high-quality assets, true brand partnership
- **Cons:** Requires business development effort, timeline dependent on LP response

#### **Option B: Curated Public Collection (Fastest to Implement)**
- Research publicly documented Loro Piana fabric lines (e.g., Wish, Four Seasons, Tasmanian, Australis, Silk Road)
- Source or photograph your own physical swatches, upload to Cloudinary
- Build a curated fabric picker with real swatch images, weights, compositions, and prices
- Link to official Loro Piana references where appropriate
- **Pros:** Immediate implementation, fully controlled UX, works in configurator today
- **Cons:** Not officially sourced; requires clear labeling as "inspired by" or generic naming

#### **Option C: Hybrid Showroom Flow**
- Web configurator handles measurements, design options, and order capture
- During videollamada appointments, tailor opens eFabrics app on a separate iPad/tablet
- Client sees fabric options via screen share or secondary camera
- Selected fabric code is manually entered into the web configurator notes
- **Pros:** Leverages the actual app, authentic experience
- **Cons:** Not integrated; relies on manual data entry; only works for live appointments

#### **Option D: Deep Linking (Not Recommended)**
- Attempt to reverse-engineer and use an undocumented URL scheme to open the app from the browser
- **Pros:** None guaranteed
- **Cons:** Unsupported, fragile, likely breaks with app updates, poor UX if app isn't installed

### Feasibility Matrix

| Capability | eFabrics Direct | Option A | Option B | Option C |
|-----------|-----------------|----------|----------|----------|
| Browse full LP catalog | ❌ | ⚠️ Partial | ⚠️ Curated | ✅ (via app) |
| 3D fabric visualization | ❌ | ⚠️ If maps provided | ✅ With Three.js | ✅ (via app) |
| Real-time stock check | ❌ | ❌ | ❌ | ✅ (via app) |
| AR garment drape | ❌ | ❌ | ❌ | ✅ (via app) |
| Digital archive / traceability | ❌ | ⚠️ Custom build | ✅ Custom build | ✅ (via app) |
| Web configurator integration | ❌ | ✅ Manual | ✅ Full | ⚠️ Manual |

**Recommendation:** Pursue **Option A** (B2B outreach) in parallel with implementing **Option B** (curated collection) immediately. This gives you a working fabric picker today while building an authentic partnership for the future.

---

## 2. TIENDA (E-COMMERCE) — IMPLEMENTATION APPROACH

### 2.1 Current State Analysis
Your Next.js 16 project has:
- ✅ Stripe installed (but only wired for courses)
- ✅ Cloudinary for image CDN
- ✅ Resend for transactional emails
- ✅ i18n (4 languages)
- ✅ Custom styling system (inline styles + CSS variables)
- ❌ No product catalog, cart, or shop infrastructure
- ❌ No database or CMS
- ❌ No order management

### 2.2 Recommended Architecture
For a luxury brand starting with accessories and ready-made pieces (~11 categories, likely <100 SKUs initially), I recommend a **"static-first" MVP** that can evolve into a headless CMS later.

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCT CATALOG                                            │
│  • Static TypeScript definitions (src/data/products.ts)     │
│  • Cloudinary-hosted product images                         │
│  • Or: Sanity/Strapi headless CMS if frequent updates       │
├─────────────────────────────────────────────────────────────┤
│  FRONTEND (Next.js App Router)                              │
│  • /tienda — category grid                                  │
│  • /tienda/[categoria] — category page                      │
│  • /tienda/producto/[slug] — product detail                 │
│  • Cart drawer (Zustand + localStorage)                     │
├─────────────────────────────────────────────────────────────┤
│  CHECKOUT FLOW                                              │
│  • Server Action validates cart                             │
│  • Fetch shipping rates from Sendcloud API                  │
│  • Create Stripe Checkout Session with line items           │
│  • Redirect to Stripe Checkout                              │
├─────────────────────────────────────────────────────────────┤
│  POST-PURCHASE                                              │
│  • Stripe webhook → generate Sendcloud label                │
│  • Resend email: order confirmation + tracking              │
│  • Order log: Airtable / Notion / Supabase (MVP)           │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Navigation Update
Add to `components/global/Navigation.tsx` after `servicios`:

```typescript
{ key: 'tienda', href: '/tienda', icon: ShoppingBag }
```

Add translations to all `messages/*.json` files:
```json
"nav": {
  "tienda": "Tienda"
}
```

### 2.4 URL Structure
```
/tienda                              → Category grid (all 11 categories)
/tienda/camisas                      → Shirt listing
/tienda/pantalones                   → Trousers listing
/tienda/trajes-completos             → Suits listing
/tienda/chalecos                     → Vests listing
/tienda/corbatas                     → Ties listing
/tienda/gemelos                      → Cufflinks listing
/tienda/panuelos                     → Pocket squares listing
/tienda/fajin                        → Cummerbunds listing
/tienda/pajaritas                    → Bow ties listing
/tienda/abrigos                      → Overcoats listing
/tienda/blazers                      → Blazers listing
/tienda/producto/[slug]              → Product detail page
```

### 2.5 Product Data Model (TypeScript)

```typescript
interface Product {
  id: string;
  slug: string;
  name: Record<string, string>;        // i18n names
  description: Record<string, string>;
  category: ProductCategory;
  price: number;                       // EUR
  compareAtPrice?: number;             // For sales
  images: string[];                    // Cloudinary URLs
  variants?: ProductVariant[];         // Size, color
  sku: string;
  weight: number;                      // grams (for shipping)
  hsCode?: string;                     // Customs code
  originCountry?: string;              // "IT" | "ES" etc.
  materials?: string;
  inStock: boolean;
  metadata?: Record<string, any>;
}

type ProductCategory = 
  | 'camisas' | 'pantalones' | 'trajes-completos' | 'chalecos'
  | 'corbatas' | 'gemelos' | 'panuelos' | 'fajin'
  | 'pajaritas' | 'abrigos' | 'blazers';

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number;
  options: Record<string, string>;     // { size: "42", color: "Navy" }
  inStock: boolean;
}
```

### 2.6 Cart Implementation
Use **Zustand** with `persist` middleware for localStorage:

```typescript
// lib/cart/store.ts
interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
```

### 2.7 Shipping Integration — Sendcloud (Recommended)

#### Why Sendcloud?
- **EU-native**, built for European merchants
- **Best Spain carrier coverage**: DHL, UPS, Correos, SEUR, GLS, DPD, Mondial Relay
- **Developer-friendly REST API** with clear docs at `sendcloud.dev`
- **Checkout API** for real-time rates at checkout
- **Automatic customs docs** (CN22/CN23) for international
- **Branded returns portal** — essential for luxury
- **Price**: Starts at €29/month
- **Webhook support** (HMAC-signed) for tracking updates

#### Integration Architecture

```typescript
// lib/shipping/sendcloud.ts
const SENDCLOUD_API = 'https://panel.sendcloud.sc/api/v2';

export async function getShippingRates(params: {
  toCountry: string;
  toPostalCode: string;
  weight: number;           // grams
  value: number;            // EUR — for insurance
}) {
  const res = await fetch(`${SENDCLOUD_API}/shipping_methods`, {
    headers: {
      Authorization: `Basic ${btoa(`${PUBLIC_KEY}:${SECRET_KEY}`)}`,
    },
  });
  // Filter methods by destination + weight
  // Return curated options (Standard, Express)
}

export async function createParcel(params: {
  orderId: string;
  recipient: Address;
  items: CartItem[];
  shippingMethod: number;   // Sendcloud method ID
}) {
  // POST /parcels with request_label: true
  // Returns tracking_number + label PDF URL
}
```

#### Checkout Flow

```
1. CART
   └─ Mini-cart drawer with estimated shipping calculator

2. CHECKOUT INFO
   └─ Email, shipping address form
   └─ Address validation (Sendcloud address check API)

3. SHIPPING METHOD
   └─ Detect country → zone
   └─ Query Sendcloud rates API (Server Action)
   └─ Display curated options:
      • Standard (3-5 days EU, 5-10 days Intl)
      • Express — DHL Express (1-3 days) +€15-30
   └─ For UK/USA/ROW: offer DDP "Includes duties & taxes"

4. REVIEW & PAYMENT
   └─ Server Action creates Stripe Checkout Session
   └─ Line items: products + shipping cost
   └─ Metadata: shipping_method_id, estimated_days
   └─ Redirect to Stripe Checkout

5. POST-PAYMENT
   └─ Stripe webhook checkout.session.completed
   └─ Trigger Sendcloud label generation
   └─ Send order confirmation email via Resend
   └─ Store order in Airtable / Notion / DB
```

#### Zone & Rate Strategy

| Zone | Countries | Service | Est. Cost |
|------|-----------|---------|-----------|
| Zone 1 — Spain Domestic | Mainland + Islands | Correos Express / SEUR | €5-8 standard, €10-15 express |
| Zone 2 — Portugal & Near EU | PT, FR, IT, DE, BE, NL, LU | DHL Parcel / GLS / DPD | €12-18 |
| Zone 3 — Rest of EU | Nordics, AT, IE, Eastern EU | DHL / UPS | €15-25 |
| Zone 4 — UK | United Kingdom | DHL Express / UPS | €18-28 (DDP recommended) |
| Zone 5 — USA/Canada | North America | DHL Express | €25-45+ |
| Zone 6 — Rest of World | Asia, Middle East, LatAm | DHL Express / FedEx | €30-60+ |

**Free shipping threshold**: €150+ for Zones 1-2 (luxury standard)

**IOSS/VAT**: Sendcloud handles IOSS for EU exports under €150. For UK post-Brexit and USA (de minimis ended Aug 2025), **always offer DDP** — surprise duties destroy the luxury experience.

### 2.8 Alternatives to Sendcloud

| Platform | Best For | Price | Notes |
|----------|----------|-------|-------|
| **Easyship** | USA/Asia focus, DDP duty calculation | Pay-per-shipment + subscription | Best-in-class landed cost API. Good if USA becomes your #2 market. |
| **ShippyPro** | Omnichannel, advanced analytics | €220/mo (Enterprise API) | Italian, strong EU coverage. High cost barrier. |
| **ShipStation / ShipEngine** | High volume, USA-centric | Subscription | Good Spain carrier access (SEUR, Correos). |
| **Direct DHL Express API** | Premium international only | Contract-based | Best for luxury positioning but requires managing multiple carrier contracts. |

**Verdict**: Start with **Sendcloud**. If USA sales exceed 30% of revenue, evaluate adding **Easyship** as a secondary provider for transatlantic DDP.

---

## 3. CONFIGURATOR — FABRIC PICKER UPGRADE

Since eFabrics cannot be embedded, I recommend rebuilding the fabric picker to support rich visual swatches.

### Proposed UI Upgrade
- Replace text buttons with **swatch grid**: actual fabric thumbnail images
- Add **detail modal** on click: composition, weight (gsm), origin, price tier
- Group fabrics by **collection** (e.g., "Loro Piana Inspired", "British Worsted", "Seasonal")
- Show **availability** status (in stock, made-to-order, limited)

### Technical Changes
1. Replace hardcoded `OPTIONS.fabrics` in `ConfiguradorWizard.tsx` with a data-driven `FABRICS` array
2. Each fabric object contains: `id`, `name`, `image`, `composition`, `weight`, `origin`, `priceTier`, `inStock`
3. Store selected fabric IDs in state instead of pattern names
4. Add Cloudinary image URLs for each swatch

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Tienda MVP (Weeks 1-3)
- [ ] Add "Tienda" to navigation + i18n translations
- [ ] Create product catalog data file with all categories
- [ ] Build `/tienda` landing page (category grid)
- [ ] Build `/tienda/[categoria]` listing pages
- [ ] Build `/tienda/producto/[slug]` detail pages
- [ ] Implement Zustand cart with localStorage
- [ ] Create cart drawer UI
- [ ] Extend Stripe API for product checkout
- [ ] Integrate Sendcloud for shipping rate calculation
- [ ] Build checkout flow (address → shipping → Stripe)
- [ ] Stripe webhook handler for order completion
- [ ] Order confirmation emails via Resend
- [ ] Basic order logging (Airtable or Supabase)

### Phase 2: Configurator Enhancement (Weeks 3-5)
- [ ] Design and photograph/source fabric swatches
- [ ] Upload swatch images to Cloudinary
- [ ] Rebuild fabric picker with visual swatch grid
- [ ] Add fabric detail modals
- [ ] Implement Option B (curated collection) immediately
- [ ] Initiate Option A (Loro Piana B2B outreach)
- [ ] Connect configurator to quote submission API
- [ ] Save configurations to database/email pipeline

### Phase 3: Polish & Scale (Weeks 5-8)
- [ ] Admin dashboard for orders
- [ ] Inventory tracking
- [ ] Branded Sendcloud tracking page
- [ ] Returns portal integration
- [ ] Evaluate headless CMS (Sanity/Strapi) if product count grows
- [ ] Multi-currency support if needed

---

## 5. FILE STRUCTURE ADDITIONS

```
app/
  tienda/
    page.tsx                    # Category grid overview
    [categoria]/
      page.tsx                  # Category product listing
    producto/
      [slug]/
        page.tsx                # Product detail page
  checkout/
    page.tsx                    # Checkout wrapper
  api/
    webhooks/
      stripe/route.ts           # Payment + order fulfillment
      sendcloud/route.ts        # Tracking updates
components/
  tienda/
    CategoryGrid.tsx
    ProductCard.tsx
    ProductGallery.tsx
    CartDrawer.tsx
    CartItem.tsx
    ShippingSelector.tsx
lib/
  cart/
    store.ts                    # Zustand cart
  shipping/
    sendcloud.ts                # API client
    zones.ts                    # Zone logic
    rates.ts                    # Rate calculation helpers
  products/
    catalog.ts                  # Static product data
    types.ts                    # Product interfaces
```

---

## 6. COST ESTIMATE (Monthly Recurring)

| Service | Cost | Purpose |
|---------|------|---------|
| Sendcloud | €29/mo | Shipping rates, labels, tracking, returns |
| Stripe | ~1.5% + €0.25/transaction | Payment processing |
| Resend | ~$20/mo (10k emails) | Transactional emails |
| Cloudinary | ~$25/mo | Product + swatch images |
| Airtable / Supabase | Free tier → $20/mo | Order database |
| **Total fixed** | **~€75-100/mo** | Before transaction fees |

---

## 7. IMMEDIATE NEXT STEPS

1. **Approve this approach** — confirm Tienda architecture and Sendcloud as shipping provider
2. **Product catalog** — provide product list (names, prices, descriptions, sizes, weights) for the 11 categories
3. **Loro Piana decision** — confirm if you want to pursue B2B partnership (Option A) while building curated collection (Option B)
4. **Sendcloud account** — sign up at sendcloud.com to obtain API keys
5. **Stripe products** — create Stripe products/price objects for e-commerce SKUs
6. **Product photography** — provide or plan photography for accessories and ready-made pieces

---

*Document prepared based on codebase audit, Loro Piana eFabrics platform research, and EU shipping provider analysis.*
