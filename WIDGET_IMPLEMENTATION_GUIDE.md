# Freely Widget Implementation Guide

This guide explains how to integrate the Freely AI Sales Widget into your e-commerce website.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Configuration Options](#configuration-options)
4. [Payment Methods](#payment-methods)
5. [Product Sync API](#product-sync-api)
6. [Webhooks](#webhooks)
7. [Customization](#customization)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before integrating the widget, you need:

1. **Freely Account** - Sign up at [freely.app](https://freely.app)
2. **Organization ID** - Created when you set up your organization
3. **API Key** - Generated in your dashboard (starts with `pk_live_` or `pk_test_`)

---

## Quick Start

Add this snippet before the closing `</body>` tag on your website:

```html
<script>
  window.FreelyConfig = {
    organizationId: 'your-organization-uuid',
    apiKey: 'pk_live_your_api_key',
    language: 'pt-BR'
  };
</script>
<script src="https://freely-backend.fly.dev/widget.js" async></script>
```

That's it! The widget will appear in the bottom-right corner of your website.

---

## Configuration Options

### Basic Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `organizationId` | `string` | **required** | Your organization UUID |
| `apiKey` | `string` | **required** | Your public API key |
| `language` | `string` | `'pt'` | Widget language (`'pt'`, `'en'`, `'es'`) |
| `position` | `string` | `'bottom-right'` | Widget position (`'bottom-right'`, `'bottom-left'`) |
| `currency` | `string` | `'BRL'` | Currency code for formatting |

### Branding Customization

```javascript
window.FreelyConfig = {
  organizationId: 'xxx',
  apiKey: 'pk_live_xxx',

  // Colors (all optional)
  primaryColor: '#4F46E5',      // Main accent color (buttons, links)
  backgroundColor: '#0A0A0A',   // Widget background
  cardColor: '#111111',         // Card/message background
  textColor: '#FFFFFF',         // Primary text
  mutedColor: '#737373',        // Secondary text
  borderColor: '#262626',       // Borders
  inputColor: '#141414',        // Input backgrounds
};
```

### Payment Configuration

```javascript
window.FreelyConfig = {
  organizationId: 'xxx',
  apiKey: 'pk_live_xxx',

  // Payment options
  paymentMethods: ['pix', 'card'],  // Enabled payment methods
  maxInstallments: 12,              // Max credit card installments (1-12)
};
```

---

## Payment Methods

### PIX (Brazilian Instant Payment)

- **Instant approval** - Payment confirmed in seconds
- **QR Code** - Customer scans with banking app
- **Copy/Paste** - Alternative code for manual entry
- **Expiration** - Default 30 minutes

### Credit Card (Parcelamento)

- **1x to 12x** installments without interest
- **Minimum per installment** - R$5.00
- **Secure checkout** - Redirects to Stripe Checkout

---

## Product Sync API

Sync your product catalog with Freely to enable the AI assistant to recommend and sell products.

### Sync Products

```bash
POST https://freely-backend.fly.dev/v1/widget/products/sync
Authorization: Bearer pk_live_your_api_key
Content-Type: application/json

{
  "products": [
    {
      "external_id": "bambu-3mm",
      "sku": "BAMBU-3MM-200x60",
      "name": "Painel de Bambu 3mm",
      "description": "Painel de bambu natural prensado, ideal para revestimentos.",
      "price_cents": 15900,
      "currency": "BRL",
      "image_urls": [
        "https://your-site.com/images/bambu-3mm.jpg"
      ],
      "category": "Paineis",
      "stock_available": 50,
      "is_available": true,
      "variants": [
        {
          "external_id": "bambu-3mm-200x60",
          "name": "200x60cm",
          "option_name": "Tamanho",
          "option_value": "200x60cm",
          "price_cents": 15900,
          "stock_available": 25
        },
        {
          "external_id": "bambu-3mm-244x122",
          "name": "244x122cm",
          "option_name": "Tamanho",
          "option_value": "244x122cm",
          "price_cents": 28900,
          "stock_available": 15
        }
      ],
      "metadata": {
        "material": "Bambu Natural",
        "thickness": "3mm"
      }
    }
  ],
  "delete_missing": false
}
```

### Response

```json
{
  "sync_id": "uuid",
  "status": "processing",
  "products_received": 1,
  "products_created": 1,
  "products_updated": 0,
  "products_failed": 0,
  "errors": []
}
```

### Check Sync Status

```bash
GET https://freely-backend.fly.dev/v1/widget/products/sync/{sync_id}/status
Authorization: Bearer pk_live_your_api_key
```

---

## Webhooks

Receive real-time notifications when events occur.

### Configure Webhook

```bash
POST https://freely-backend.fly.dev/v1/widget/webhooks
Authorization: Bearer pk_live_your_api_key
Content-Type: application/json

{
  "name": "Order Notifications",
  "url": "https://your-site.com/api/webhooks/freely",
  "events": [
    "order.created",
    "order.paid",
    "pix.paid",
    "cart.abandoned"
  ],
  "is_active": true
}
```

### Available Events

| Event | Description |
|-------|-------------|
| `order.created` | New order placed |
| `order.paid` | Order payment confirmed |
| `order.failed` | Payment failed |
| `order.refunded` | Order refunded |
| `order.fulfilled` | Order marked as fulfilled |
| `order.shipped` | Order shipped |
| `payment.pending` | Payment awaiting confirmation |
| `payment.confirmed` | Payment confirmed |
| `pix.generated` | PIX QR code generated |
| `pix.paid` | PIX payment received |
| `boleto.generated` | Boleto generated |
| `boleto.paid` | Boleto paid |
| `cart.abandoned` | Cart abandoned (30min inactivity) |
| `customer.created` | New customer registered |

### Webhook Payload

```json
{
  "event": "order.paid",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "order_id": "uuid",
    "customer_email": "customer@email.com",
    "total_cents": 15900,
    "payment_method": "pix",
    "items": [...]
  }
}
```

### Verify Webhook Signature

```python
import hmac
import hashlib

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

# In your webhook handler:
signature = request.headers.get('X-Freely-Signature')
is_valid = verify_signature(request.body, signature, webhook_secret)
```

---

## Customization

### Full Example

```html
<script>
  window.FreelyConfig = {
    // Required
    organizationId: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f90',
    apiKey: 'pk_live_meubambu_xxxxx',

    // Language & Region
    language: 'pt-BR',
    currency: 'BRL',

    // Branding (match your site's colors)
    primaryColor: '#8B5A2B',      // Bamboo brown
    backgroundColor: '#0A0A0A',   // Dark background
    cardColor: '#111111',         // Card background
    textColor: '#FFFFFF',         // Text

    // Payment
    paymentMethods: ['pix', 'card'],
    maxInstallments: 12,

    // Position
    position: 'bottom-right',
  };
</script>
<script src="https://freely-backend.fly.dev/widget.js" async></script>
```

### CSS Override (Advanced)

For advanced customization, you can target widget elements:

```css
/* Widget container */
#freely-widget .freely-chat {
  /* Custom styles */
}

/* Primary button */
#freely-widget .freely-primary-btn {
  /* Custom styles */
}
```

---

## API Reference

### Base URL

```
https://freely-backend.fly.dev/v1/widget
```

### Authentication

All API requests require the `Authorization` header:

```
Authorization: Bearer pk_live_your_api_key
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/config` | Get widget configuration |
| `POST` | `/config` | Create/update widget config |
| `POST` | `/products/sync` | Sync product catalog |
| `GET` | `/products/sync/{id}/status` | Check sync status |
| `POST` | `/webhooks` | Create webhook |
| `GET` | `/webhooks` | List webhooks |
| `DELETE` | `/webhooks/{id}` | Delete webhook |
| `POST` | `/payments/pix` | Create PIX payment |
| `POST` | `/analytics/events` | Track custom event |
| `GET` | `/analytics/summary` | Get analytics summary |

---

## Troubleshooting

### Widget not appearing

1. Check browser console for errors
2. Verify `organizationId` and `apiKey` are correct
3. Ensure the script is loaded after `FreelyConfig` is defined

### CORS errors

The widget is configured to work from any domain. If you see CORS errors:
1. Check that you're using the correct API URL
2. Verify your API key is valid and active

### Payment not processing

1. Ensure your Stripe Connect account is set up
2. Check that payment methods are enabled in your config
3. Verify the customer's CPF is valid (for PIX)

### Products not showing

1. Run a product sync via API
2. Check the sync status for errors
3. Ensure products have `is_available: true`

---

## Support

- **Documentation**: [docs.freely.app](https://docs.freely.app)
- **Email**: support@freely.app
- **GitHub Issues**: [github.com/freely/widget/issues](https://github.com/freely/widget/issues)
