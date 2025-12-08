# E-commerce Solution Report: Meu Bambu
**Date:** January 2025  
**Project:** Meu Bambu Website  
**Focus:** E-commerce Dashboard & AI Conversational Cart Integration

---

## Executive Summary

This report analyzes the current state of the Meu Bambu e-commerce website and provides recommendations for implementing a product management system and AI conversational cart. The analysis concludes that a **custom lightweight solution** is optimal over Sanity CMS, given the simple product catalog (2 products with limited variants) and the planned AI conversational cart integration.

---

## 1. Current State Analysis

### 1.1 Product Catalog

**Product 1: Painéis de Bambu Premium**
- Base Price: R$ 199,00
- Variants:
  - **Thickness (Espessura):** 3mm, 5mm, 15mm
  - **Size (Tamanho):** 200x60cm, 130x28cm, 125x28cm, 115x28cm, 105x28cm, 95x28cm, 90x28cm, 80x28cm
- Total SKU Combinations: 24 (3 thickness × 8 sizes)
- Features: Resistência estrutural superior, Sustentável & ecológico, Fácil de cortar e aplicar

**Product 2: Lâminas de Bambu Flexíveis**
- Base Price: R$ 349,00
- Variants:
  - **Thickness (Espessura):** 0.6mm (single option)
  - **Size (Tamanho):** 200x60cm (single option)
- Total SKU Combinations: 1
- Features: Flexível e fácil de moldar, Acabamento natural elegante, Liberdade criativa para projetos

**Total Products:** 2  
**Total SKUs:** 25

### 1.2 Current Implementation

- **Framework:** Astro (static site generator)
- **Current Flow:** All "COMPRAR" buttons link to `#comprar` anchor (non-functional)
- **Order Processing:** Manual via WhatsApp (mentioned in footer)
- **Product Data:** Hardcoded in `src/pages/index.astro`
- **No Cart System:** No shopping cart or checkout flow exists
- **No Product Management:** No CMS or admin interface

### 1.3 Technical Stack

- **Frontend:** Astro, TypeScript
- **Styling:** CSS (custom properties)
- **Animations:** GSAP, Lenis (smooth scroll)
- **Deployment:** Vercel (configured)
- **Dependencies:** Minimal (no e-commerce libraries)

---

## 2. Solution Comparison

### 2.1 Option A: Sanity CMS Integration

**Pros:**
- Professional content management interface
- Real-time preview
- Version control for content
- Multi-user collaboration
- Rich media handling

**Cons:**
- **Overkill for 2 products** - unnecessary complexity
- **Additional cost** - Sanity pricing starts at $0 (free tier limited) but scales
- **Learning curve** - Team needs to learn Sanity schema
- **Integration overhead** - Requires Astro integration setup
- **API calls** - Adds latency to static site
- **Not ideal for AI cart** - AI needs structured, fast data access

**Cost Estimate:** $0-99/month (depending on usage)

### 2.2 Option B: Custom Lightweight Solution ⭐ **RECOMMENDED**

**Pros:**
- **Perfect fit** - Designed specifically for 2 products
- **Zero ongoing cost** - No SaaS fees
- **Fast performance** - Static JSON files, no API calls
- **AI-friendly** - Structured data perfect for conversational cart
- **Full control** - Customize exactly to needs
- **Simple maintenance** - Edit JSON or use simple admin form
- **Type-safe** - TypeScript interfaces ensure data integrity

**Cons:**
- Requires initial development (estimated 2-4 hours)
- No built-in user management (not needed for this use case)

**Cost Estimate:** $0 (development time only)

---

## 3. Recommended Solution Architecture

### 3.1 Product Data Management

**Structure:**
```
src/
  data/
    products.json          # Product catalog
    pricing.json          # Price matrix (if prices vary by variant)
  utils/
    product.ts            # Product utilities & validation
```

**Product Schema:**
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: 'BRL';
  features: string[];
  variants: {
    thickness?: string[];
    size?: string[];
  };
  images: {
    main: string;
    gallery?: string[];
  };
  inStock: boolean;
  metadata?: Record<string, any>;
}
```

### 3.2 AI Conversational Cart Integration

**Architecture:**
```
┌─────────────────┐
│   User Query    │
│  (via Chat UI)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Chat Agent  │ ← Uses product.json for context
│  (Claude/OpenAI)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cart Manager   │ ← Manages cart state
│  (LocalStorage) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WhatsApp Flow  │ ← Generates order message
└─────────────────┘
```

**Key Features:**
1. **Product Discovery:** AI understands product names, variants, and features
2. **Natural Language Selection:** "I want 3mm thick panels, 200x60cm"
3. **Cart Management:** Add, remove, modify quantities via conversation
4. **Price Calculation:** Real-time total calculation
5. **Order Summary:** AI generates human-readable order summary
6. **WhatsApp Integration:** Pre-filled message with order details

### 3.3 Implementation Components

**1. Product Data Layer**
- JSON-based product catalog
- TypeScript interfaces for type safety
- Utility functions for product lookup

**2. Cart State Management**
- Client-side cart (localStorage)
- Cart actions: add, remove, update quantity
- Cart persistence across sessions

**3. AI Chat Interface**
- Chat widget component
- Message history
- Product context injection
- Cart state synchronization

**4. Order Processing**
- Order summary generation
- WhatsApp deep link generation
- Order confirmation

---

## 4. Detailed Implementation Plan

### Phase 1: Product Data Structure (1-2 hours)

**Tasks:**
1. Create `src/data/products.json` with structured product data
2. Create TypeScript interfaces in `src/utils/product.ts`
3. Create utility functions:
   - `getProduct(id)` - Get product by ID
   - `getProductBySlug(slug)` - Get product by slug
   - `getVariantPrice(productId, variant)` - Calculate variant price
   - `validateVariant(productId, variant)` - Validate variant selection

**Deliverables:**
- Product data JSON file
- Type-safe product utilities
- Updated product components to use data layer

### Phase 2: Cart System (2-3 hours)

**Tasks:**
1. Create cart state management (`src/utils/cart.ts`)
2. Create cart UI component (`src/components/Cart.astro`)
3. Implement cart actions:
   - Add to cart
   - Remove from cart
   - Update quantity
   - Clear cart
4. Cart persistence (localStorage)
5. Cart badge/counter in header

**Deliverables:**
- Functional shopping cart
- Cart state management
- Cart UI components

### Phase 3: AI Chat Integration (4-6 hours)

**Tasks:**
1. Set up AI provider (Claude API or OpenAI)
2. Create chat widget component (`src/components/ChatWidget.astro`)
3. Implement chat interface:
   - Message input/output
   - Loading states
   - Error handling
4. Create AI prompt system:
   - Product catalog context
   - Cart state context
   - Conversation history
5. Implement cart actions via chat:
   - "Add 2 panels, 5mm thick, 200x60cm"
   - "Show me my cart"
   - "Remove the sheets from my cart"
6. Order summary generation

**Deliverables:**
- AI chat widget
- Conversational cart functionality
- Order summary generation

### Phase 4: WhatsApp Integration (1-2 hours)

**Tasks:**
1. Create WhatsApp deep link generator
2. Format order message:
   - Product details
   - Variants selected
   - Quantities
   - Total price
   - Customer info (if collected)
3. Add "Finalize Order" button in cart/chat

**Deliverables:**
- WhatsApp order flow
- Pre-filled order messages

### Phase 5: Admin Interface (Optional, 2-3 hours)

**Tasks:**
1. Simple admin form to update products
2. Price management
3. Stock management
4. Or: Use JSON file editing (simpler)

**Deliverables:**
- Admin interface OR documentation for JSON editing

---

## 5. AI Conversational Cart - Detailed Specification

### 5.1 User Experience Flow

**Example Conversation:**
```
User: "I need bamboo panels for furniture"
AI: "Great! We have Premium Bamboo Panels. What thickness do you need? 
     We offer 3mm, 5mm, or 15mm."

User: "5mm please, and I need 200x60cm size"
AI: "Perfect! I've added Premium Bamboo Panels (5mm, 200x60cm) to your cart. 
     Price: R$ 199,00. Would you like to add anything else?"

User: "Show me what's in my cart"
AI: "Your cart contains:
     1x Premium Bamboo Panels (5mm, 200x60cm) - R$ 199,00
     Total: R$ 199,00
     Ready to checkout?"

User: "Yes, let's checkout"
AI: "Perfect! I'll prepare your order for WhatsApp..."
```

### 5.2 AI Context System

**System Prompt Structure:**
```
You are a helpful sales assistant for Meu Bambu, a premium bamboo products store.

PRODUCT CATALOG:
[Injected product data from products.json]

CURRENT CART:
[Injected cart state]

CAPABILITIES:
- Help customers find products
- Answer questions about products
- Add products to cart (use format: productId, variant, quantity)
- Show cart contents
- Calculate totals
- Generate order summaries

CONSTRAINTS:
- Only sell products from the catalog
- Validate variants before adding to cart
- Always confirm before adding to cart
- Be friendly and helpful
```

### 5.3 Cart Actions via AI

**Supported Commands:**
- "Add [product] [variant details]" → Adds to cart
- "Remove [product]" → Removes from cart
- "Update quantity of [product] to [number]" → Updates quantity
- "Show cart" / "What's in my cart" → Displays cart
- "Clear cart" → Empties cart
- "Checkout" → Generates order summary

### 5.4 Technical Implementation

**AI Provider Options:**

1. **Anthropic Claude API** (Recommended)
   - Best for structured data
   - Excellent at following instructions
   - Cost: ~$0.008 per 1K tokens

2. **OpenAI GPT-4**
   - Good alternative
   - Cost: ~$0.03 per 1K tokens

3. **OpenAI GPT-3.5 Turbo** (Budget option)
   - Cheaper but less capable
   - Cost: ~$0.0015 per 1K tokens

**Implementation:**
- Server-side API route (Astro API endpoint)
- Client-side chat UI
- Streaming responses for better UX
- Error handling and fallbacks

---

## 6. Cost Analysis

### 6.1 Development Costs

| Phase | Time Estimate | Complexity |
|-------|---------------|------------|
| Product Data Structure | 1-2 hours | Low |
| Cart System | 2-3 hours | Medium |
| AI Chat Integration | 4-6 hours | High |
| WhatsApp Integration | 1-2 hours | Low |
| Admin Interface (Optional) | 2-3 hours | Medium |
| **Total** | **10-16 hours** | **Medium** |

### 6.2 Ongoing Costs

**Custom Solution:**
- Hosting: $0 (Vercel free tier)
- AI API: ~$5-20/month (depending on usage)
- **Total: ~$5-20/month**

**Sanity CMS Alternative:**
- Sanity: $0-99/month
- AI API: ~$5-20/month
- **Total: ~$5-119/month**

**Savings with Custom Solution: $0-99/month**

---

## 7. Recommended Tech Stack

### 7.1 Core Stack (Current)
- ✅ Astro (static site generator)
- ✅ TypeScript
- ✅ Vercel (hosting)

### 7.2 Additions Needed

**Product Management:**
- JSON files for product data
- TypeScript interfaces
- Utility functions

**Cart System:**
- LocalStorage for cart persistence
- Cart state management (vanilla JS or Zustand)

**AI Integration:**
- Anthropic SDK (`@anthropic-ai/sdk`) OR OpenAI SDK (`openai`)
- Astro API endpoint for chat
- Streaming support

**UI Components:**
- Chat widget component
- Cart drawer/modal
- Product selection enhancements

---

## 8. Security Considerations

### 8.1 Product Data
- ✅ Static JSON files (no injection risk)
- ✅ Type validation on load
- ✅ No user-generated content in product data

### 8.2 Cart Data
- ✅ Client-side only (localStorage)
- ✅ No sensitive data stored
- ✅ Cart cleared on checkout

### 8.3 AI API
- ✅ API keys stored in environment variables
- ✅ Rate limiting on API endpoint
- ✅ Input sanitization
- ✅ Cost monitoring

### 8.4 WhatsApp Integration
- ✅ No sensitive data in URLs
- ✅ Order data in message only (user-controlled)

---

## 9. Performance Considerations

### 9.1 Product Data Loading
- ✅ Static JSON (bundled at build time)
- ✅ No runtime API calls for products
- ✅ Fast, instant product lookup

### 9.2 AI Chat
- ⚠️ API calls add latency (~1-3 seconds)
- ✅ Streaming responses improve perceived performance
- ✅ Cache common queries (optional)

### 9.3 Cart Operations
- ✅ Instant (localStorage)
- ✅ No network requests
- ✅ Optimistic updates

---

## 10. Scalability Path

### 10.1 If Products Grow (10+ products)
- Current solution still works
- Add search/filter functionality
- Consider product categories

### 10.2 If Variants Become Complex
- Extend variant schema
- Add variant validation rules
- Price matrix for complex pricing

### 10.3 If Order Volume Increases
- Add order tracking system
- Email confirmations
- Order management dashboard
- Still no need for Sanity (use database)

---

## 11. Migration Strategy

### 11.1 From Current State

**Step 1:** Extract product data from `index.astro` to `products.json`
**Step 2:** Update components to use product data
**Step 3:** Add cart functionality
**Step 4:** Integrate AI chat
**Step 5:** Add WhatsApp flow
**Step 6:** Test and deploy

**Risk Level:** Low (backward compatible)

---

## 12. Success Metrics

### 12.1 Technical Metrics
- Cart abandonment rate
- AI chat engagement rate
- Average conversation length
- Order completion rate
- API response times

### 12.2 Business Metrics
- Conversion rate improvement
- Average order value
- Customer satisfaction (via chat)
- Time to checkout

---

## 13. Final Recommendation

### ✅ **RECOMMENDED: Custom Lightweight Solution**

**Rationale:**
1. **Perfect fit** for 2 products with simple variants
2. **Cost-effective** - No ongoing SaaS fees
3. **AI-friendly** - Structured data perfect for conversational cart
4. **Fast** - Static data, no API overhead
5. **Flexible** - Easy to customize and extend
6. **Maintainable** - Simple architecture, easy to understand

**Next Steps:**
1. Approve this solution
2. Begin Phase 1 implementation
3. Set up AI provider account
4. Iterate based on testing

---

## 14. Appendix

### 14.1 Product Data Example

```json
{
  "products": [
    {
      "id": "panels",
      "slug": "paineis-bambu-premium",
      "name": "Painéis de Bambu Premium",
      "description": "Painéis de bambu com núcleo vertical, mais resistentes que os tradicionais horizontais.",
      "basePrice": 199.00,
      "currency": "BRL",
      "features": [
        "Resistência estrutural superior",
        "Sustentável & ecológico",
        "Fácil de cortar e aplicar"
      ],
      "variants": {
        "thickness": ["3mm", "5mm", "15mm"],
        "size": [
          "200x60cm",
          "130x28cm",
          "125x28cm",
          "115x28cm",
          "105x28cm",
          "95x28cm",
          "90x28cm",
          "80x28cm"
        ]
      },
      "images": {
        "main": "/images/paineis.png"
      },
      "inStock": true
    },
    {
      "id": "sheets",
      "slug": "laminas-bambu-flexiveis",
      "name": "Lâminas de Bambu Flexíveis",
      "description": "Bambu ultrafino e flexível, ideal para curvas e detalhes sofisticados.",
      "basePrice": 349.00,
      "currency": "BRL",
      "features": [
        "Flexível e fácil de moldar",
        "Acabamento natural elegante",
        "Liberdade criativa para projetos"
      ],
      "variants": {
        "thickness": ["0.6mm"],
        "size": ["200x60cm"]
      },
      "images": {
        "main": "/images/laminas.png"
      },
      "inStock": true
    }
  ]
}
```

### 14.2 Cart State Example

```typescript
interface CartItem {
  productId: string;
  variant: {
    thickness?: string;
    size?: string;
  };
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  currency: 'BRL';
}
```

---

## 15. Nuxt Backend API Requirements

### 15.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              ASTRO (meubambu.com.br)                        │
│  - Homepage / Product showcase                              │
│  - Customer dashboard (/minha-conta)                        │
│  - AI Chat widget for cart/checkout                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           NUXT BACKEND (api.meubambu.com.br)                │
│                                                             │
│  PUBLIC API (for Astro + AI Chat):                          │
│  - /api/products - Product catalog                          │
│  - /api/auth - Customer authentication                      │
│  - /api/orders - Customer orders                            │
│  - /api/checkout - Cart & payment processing                │
│  - /api/shipping - Shipping calculations                    │
│                                                             │
│  ADMIN PANEL (/admin):                                      │
│  - Dashboard with sales overview                            │
│  - Product management (CRUD)                                │
│  - Order management                                         │
│  - Customer management                                      │
│  - Settings                                                 │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE                                 │
│  - Products & variants                                      │
│  - Orders & order items                                     │
│  - Customers                                                │
│  - Payment records                                          │
└─────────────────────────────────────────────────────────────┘
```

### 15.2 Public API Endpoints

#### Authentication
```
POST   /api/auth/login          - Customer login
POST   /api/auth/register       - Customer registration
POST   /api/auth/logout         - Logout
POST   /api/auth/refresh        - Refresh JWT token
POST   /api/auth/forgot         - Password reset request
POST   /api/auth/reset          - Password reset confirm
```

#### Products (Public)
```
GET    /api/products            - List all active products
GET    /api/products/:slug      - Get product by slug
GET    /api/products/sku/:sku   - Get product by SKU code
```

#### Customer Profile
```
GET    /api/customer/profile         - Get customer profile
PUT    /api/customer/profile         - Update profile
GET    /api/customer/payment-methods - List saved payment methods
DELETE /api/customer/payment-methods/:id - Remove payment method
```

#### Orders
```
GET    /api/orders              - List customer orders
GET    /api/orders/:id          - Get order details
POST   /api/orders/:id/cancel   - Cancel order
POST   /api/orders/:id/refund   - Request refund
GET    /api/orders/:id/tracking - Get tracking info
```

#### Checkout (AI Chat Integration)
```
POST   /api/checkout/create     - Create checkout session
POST   /api/checkout/shipping   - Calculate shipping options
POST   /api/checkout/payment    - Process payment (Stripe)
POST   /api/checkout/confirm    - Confirm order
```

#### Shipping
```
POST   /api/shipping/calculate  - Calculate shipping by CEP
```

### 15.3 Admin API Endpoints

#### Admin Authentication
```
POST   /api/admin/auth/login    - Admin login
POST   /api/admin/auth/logout   - Admin logout
GET    /api/admin/auth/me       - Get current admin user
```

#### Dashboard
```
GET    /api/admin/dashboard/stats       - Sales statistics
GET    /api/admin/dashboard/recent      - Recent orders
GET    /api/admin/dashboard/top-products - Top selling products
```

#### Product Management
```
GET    /api/admin/products              - List all products (including inactive)
POST   /api/admin/products              - Create product
GET    /api/admin/products/:id          - Get product details
PUT    /api/admin/products/:id          - Update product
DELETE /api/admin/products/:id          - Delete product (soft delete)
POST   /api/admin/products/:id/variants - Add variant
PUT    /api/admin/products/:id/variants/:variantId - Update variant
DELETE /api/admin/products/:id/variants/:variantId - Delete variant
POST   /api/admin/products/:id/images   - Upload product image
```

#### Order Management
```
GET    /api/admin/orders                - List all orders (with filters)
GET    /api/admin/orders/:id            - Get order details
PUT    /api/admin/orders/:id/status     - Update order status
POST   /api/admin/orders/:id/tracking   - Add tracking code
POST   /api/admin/orders/:id/refund     - Process refund
POST   /api/admin/orders/:id/note       - Add internal note
```

#### Customer Management
```
GET    /api/admin/customers             - List customers
GET    /api/admin/customers/:id         - Get customer details
GET    /api/admin/customers/:id/orders  - Get customer orders
PUT    /api/admin/customers/:id         - Update customer
```

#### Settings
```
GET    /api/admin/settings              - Get all settings
PUT    /api/admin/settings              - Update settings
GET    /api/admin/settings/shipping     - Shipping settings
PUT    /api/admin/settings/shipping     - Update shipping settings
```

### 15.4 Database Schema

#### Products Table
```sql
CREATE TABLE products (
  id            UUID PRIMARY KEY,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  short_name    VARCHAR(100),
  description   TEXT,
  features      JSONB,           -- Array of feature strings
  images        JSONB,           -- Array of image URLs
  category      VARCHAR(100),
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);
```

#### Product Variants Table
```sql
CREATE TABLE product_variants (
  id              UUID PRIMARY KEY,
  product_id      UUID REFERENCES products(id),
  sku             VARCHAR(50) UNIQUE NOT NULL,  -- e.g., PBN-3MM-200X60
  thickness       VARCHAR(20),                  -- e.g., "3mm"
  size            VARCHAR(50),                  -- e.g., "200x60cm"
  price           DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),               -- Original price for discounts
  stock           INTEGER DEFAULT 0,
  weight          DECIMAL(10,3),                -- kg
  length          DECIMAL(10,2),                -- cm
  width           DECIMAL(10,2),                -- cm
  height          DECIMAL(10,2),                -- cm
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

#### Customers Table
```sql
CREATE TABLE customers (
  id            UUID PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  cpf           VARCHAR(14),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);
```

#### Customer Addresses Table
```sql
CREATE TABLE customer_addresses (
  id            UUID PRIMARY KEY,
  customer_id   UUID REFERENCES customers(id),
  name          VARCHAR(255),
  street        VARCHAR(255),
  number        VARCHAR(20),
  complement    VARCHAR(100),
  neighborhood  VARCHAR(100),
  city          VARCHAR(100),
  state         VARCHAR(2),
  zip_code      VARCHAR(9),
  is_default    BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY,
  order_number    VARCHAR(20) UNIQUE NOT NULL,  -- e.g., MB-2024-0001
  customer_id     UUID REFERENCES customers(id),
  status          VARCHAR(20) NOT NULL,          -- pending, processing, shipped, delivered, cancelled
  subtotal        DECIMAL(10,2) NOT NULL,
  shipping        DECIMAL(10,2) NOT NULL,
  discount        DECIMAL(10,2) DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method  VARCHAR(50),
  payment_details VARCHAR(100),
  tracking_code   VARCHAR(50),
  tracking_url    VARCHAR(255),
  notes           TEXT,                          -- Internal admin notes
  cancelled_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id            UUID PRIMARY KEY,
  order_id      UUID REFERENCES orders(id),
  product_id    UUID REFERENCES products(id),
  variant_id    UUID REFERENCES product_variants(id),
  sku           VARCHAR(50) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  variant_name  VARCHAR(100),                    -- e.g., "3mm - 200x60cm"
  quantity      INTEGER NOT NULL,
  unit_price    DECIMAL(10,2) NOT NULL,
  total_price   DECIMAL(10,2) NOT NULL,
  image         VARCHAR(255)
);
```

#### Order Status History Table
```sql
CREATE TABLE order_status_history (
  id          UUID PRIMARY KEY,
  order_id    UUID REFERENCES orders(id),
  status      VARCHAR(20) NOT NULL,
  note        TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

#### Payment Methods Table
```sql
CREATE TABLE payment_methods (
  id            UUID PRIMARY KEY,
  customer_id   UUID REFERENCES customers(id),
  stripe_id     VARCHAR(100),                    -- Stripe PaymentMethod ID
  brand         VARCHAR(20),                     -- visa, mastercard, etc.
  last4         VARCHAR(4),
  exp_month     INTEGER,
  exp_year      INTEGER,
  is_default    BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

#### Admin Users Table
```sql
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(20) DEFAULT 'admin',     -- admin, super_admin
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  last_login    TIMESTAMP
);
```

### 15.5 Admin Dashboard Pages

#### Dashboard Home (`/admin`)
- Total sales (today, week, month, all time)
- Orders count by status
- Revenue chart (line graph)
- Recent orders list (last 10)
- Top selling products
- Low stock alerts

#### Orders (`/admin/orders`)
- Orders table with filters (status, date range, customer)
- Search by order number
- Bulk status update
- Export to CSV
- Order detail view:
  - Customer info
  - Items with variants
  - Payment info
  - Shipping info
  - Status history
  - Add tracking code
  - Process refund
  - Add internal notes

#### Products (`/admin/products`)
- Products table (name, SKU count, price range, stock, status)
- Create/Edit product form:
  - Basic info (name, slug, description)
  - Features list
  - Image upload
  - Variants management:
    - Add/edit/remove variants
    - SKU auto-generation
    - Price per variant
    - Stock per variant
    - Dimensions & weight
- Quick stock update
- Toggle active/inactive

#### Customers (`/admin/customers`)
- Customers table (name, email, orders count, total spent)
- Customer detail view:
  - Profile info
  - Order history
  - Saved addresses
  - Total lifetime value

#### Settings (`/admin/settings`)
- Store settings (name, contact)
- Shipping settings:
  - Free shipping threshold
  - Shipping rates by region
- Email templates
- Payment settings (Stripe keys)

### 15.6 SKU Code Structure

```
Format: [PRODUCT]-[THICKNESS]-[SIZE]

Products:
  PBN = Painel Bambu Natural
  PBP = Painel Bambu Premium
  LBF = Lâmina Bambu Flexível

Examples:
  PBN-3MM-200X60  → Painel Natural, 3mm, 200x60cm
  PBP-5MM-100X60  → Painel Premium, 5mm, 100x60cm
  LBF-06MM-200X60 → Lâmina Flexível, 0.6mm, 200x60cm
```

### 15.7 Order Status Flow

```
pending → processing → shipped → delivered
    ↓          ↓
cancelled  cancelled (only before shipped)

Status Descriptions:
- pending: Aguardando pagamento
- processing: Pagamento confirmado, preparando envio
- shipped: Enviado (tracking code added)
- delivered: Entregue
- cancelled: Cancelado
```

### 15.8 Integration Points

#### Stripe Integration
- Payment processing for cards and PIX
- Save payment methods for returning customers
- Webhook for payment confirmation
- Refund processing

#### Shipping Integration (optional)
- Correios API for shipping calculation
- Melhor Envio API (aggregator)
- Manual shipping rates as fallback

#### Email Integration
- Order confirmation
- Shipping notification
- Password reset

---

**Report Prepared By:** AI Assistant
**Last Updated:** December 2025
**Status:** Ready for Implementation
