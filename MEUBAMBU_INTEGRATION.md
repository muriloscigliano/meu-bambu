# Meu Bambu - Freely Widget Integration

This document contains all credentials and setup instructions for integrating the Freely AI Sales Widget into the Meu Bambu e-commerce website.

## Account Details

| Field | Value |
|-------|-------|
| **User Email** | murilo.scigliano@gmail.com |
| **User ID** | `07c41ad3-11aa-4747-a9b6-43c1c887a597` |
| **Organization** | Meu Bambu |
| **Organization ID** | `3501a39e-cdfa-4dfd-84e1-886c2e62f62a` |
| **Organization Slug** | `meubambu` |

## API Key

```
pk_live_meubambu_0d1e5105d16c9711433dbe07
```

**IMPORTANT**: This is a live API key. Keep it secure and do not commit to public repositories.

---

## Widget Installation for Astro

### Step 1: Add Widget Script

In your Astro layout file (e.g., `src/layouts/Layout.astro`), add the following before the closing `</body>` tag:

```astro
---
// Layout.astro
---
<html>
  <head>
    <!-- your head content -->
  </head>
  <body>
    <slot />

    <!-- Freely AI Sales Widget -->
    <script is:inline>
      window.FreelyConfig = {
        organizationId: '3501a39e-cdfa-4dfd-84e1-886c2e62f62a',
        apiKey: 'pk_live_meubambu_0d1e5105d16c9711433dbe07',

        // Branding (bamboo theme)
        primaryColor: '#8B5A2B',      // Bamboo brown
        backgroundColor: '#0A0A0A',   // Dark background
        cardColor: '#111111',
        textColor: '#FFFFFF',

        // Language
        language: 'pt-BR',

        // Payment methods
        paymentMethods: ['pix', 'card'],
        maxInstallments: 12,

        // Position
        position: 'bottom-right',
      };
    </script>
    <script src="https://freely-backend.fly.dev/widget.js" async></script>
  </body>
</html>
```

---

## Product Catalog Sync

Sync Meu Bambu products with the Freely widget.

### Example: Sync Bamboo Panels

```bash
curl -X POST https://freely-backend.fly.dev/v1/widget/products/sync \
  -H "Authorization: Bearer pk_live_meubambu_0d1e5105d16c9711433dbe07" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "external_id": "bambu-3mm-natural",
        "sku": "BAMBU-3MM-NAT",
        "name": "Painel de Bambu Natural 3mm",
        "description": "Painel de bambu natural prensado, ideal para revestimentos de paredes e moveis. Acabamento natural.",
        "price_cents": 15900,
        "currency": "BRL",
        "image_urls": ["https://meubambu.com.br/images/bambu-3mm-natural.jpg"],
        "category": "Paineis 3mm",
        "stock_available": 50,
        "is_available": true,
        "variants": [
          {
            "external_id": "bambu-3mm-200x60",
            "sku": "BAMBU-3MM-200x60",
            "name": "200x60cm",
            "option_name": "Tamanho",
            "option_value": "200x60cm",
            "price_cents": 15900,
            "stock_available": 25
          },
          {
            "external_id": "bambu-3mm-244x122",
            "sku": "BAMBU-3MM-244x122",
            "name": "244x122cm",
            "option_name": "Tamanho",
            "option_value": "244x122cm",
            "price_cents": 28900,
            "stock_available": 15
          }
        ],
        "metadata": {
          "material": "Bambu Natural",
          "espessura": "3mm",
          "acabamento": "Natural"
        }
      },
      {
        "external_id": "bambu-5mm-carbonizado",
        "sku": "BAMBU-5MM-CARB",
        "name": "Painel de Bambu Carbonizado 5mm",
        "description": "Painel de bambu carbonizado (tratamento termico) com tom escuro natural. Maior resistencia e durabilidade.",
        "price_cents": 22900,
        "currency": "BRL",
        "image_urls": ["https://meubambu.com.br/images/bambu-5mm-carb.jpg"],
        "category": "Paineis 5mm",
        "stock_available": 30,
        "is_available": true,
        "variants": [
          {
            "external_id": "bambu-5mm-200x60",
            "sku": "BAMBU-5MM-200x60",
            "name": "200x60cm",
            "option_name": "Tamanho",
            "option_value": "200x60cm",
            "price_cents": 22900,
            "stock_available": 15
          },
          {
            "external_id": "bambu-5mm-244x122",
            "sku": "BAMBU-5MM-244x122",
            "name": "244x122cm",
            "option_name": "Tamanho",
            "option_value": "244x122cm",
            "price_cents": 39900,
            "stock_available": 10
          }
        ],
        "metadata": {
          "material": "Bambu Carbonizado",
          "espessura": "5mm",
          "acabamento": "Carbonizado"
        }
      }
    ],
    "delete_missing": false
  }'
```

---

## Webhook Configuration (Optional)

Receive notifications when orders are placed.

```bash
curl -X POST https://freely-backend.fly.dev/v1/widget/webhooks \
  -H "Authorization: Bearer pk_live_meubambu_0d1e5105d16c9711433dbe07" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Bambu Order Notifications",
    "url": "https://meubambu.com.br/api/webhooks/freely",
    "events": [
      "order.created",
      "order.paid",
      "pix.paid",
      "payment.confirmed"
    ],
    "is_active": true
  }'
```

---

## Testing

### Local Development

For local testing, you can use the widget with your Astro dev server:

```bash
# In Meu Bambu's Astro project
npm run dev
```

The widget will load and connect to the production Freely backend.

### Test Payment Flow

1. Open the widget on any page
2. Chat with the AI to add products to cart
3. Click "Finalizar Compra"
4. Enter test CPF: `123.456.789-09`
5. Select PIX or Credit Card
6. For PIX: QR code will be generated (use sandbox for testing)
7. For Card: Redirects to Stripe Checkout (test mode if configured)

---

## Customization Options

### Alternative Color Schemes

**Dark Green (Forest)**
```javascript
primaryColor: '#2D5A27',
backgroundColor: '#0A0A0A',
```

**Light Theme**
```javascript
primaryColor: '#8B5A2B',
backgroundColor: '#FAFAFA',
cardColor: '#FFFFFF',
textColor: '#1A1A1A',
mutedColor: '#6B6B6B',
borderColor: '#E5E5E5',
```

---

## Support

- **Implementation Guide**: [WIDGET_IMPLEMENTATION_GUIDE.md](./WIDGET_IMPLEMENTATION_GUIDE.md)
- **API Reference**: https://freely-backend.fly.dev/docs
- **Email**: support@freely.app
