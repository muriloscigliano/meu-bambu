# Payment API Requirements for Meu Bambu Integration

**Document Version:** 1.0
**Date:** December 2025
**Project:** Meu Bambu E-commerce
**Purpose:** API specification for third-party payment provider integration

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Core Payment Endpoints](#3-core-payment-endpoints)
4. [Webhook Notifications](#4-webhook-notifications)
5. [Data Structures](#5-data-structures)
6. [Payment Methods](#6-payment-methods)
7. [Brazilian Compliance](#7-brazilian-compliance)
8. [Integration Flow](#8-integration-flow)
9. [Error Handling](#9-error-handling)
10. [Testing & Sandbox](#10-testing--sandbox)

---

## 1. Overview

This document specifies the API requirements that a third-party payment provider must implement to integrate with the Meu Bambu e-commerce platform.

### 1.1 Meu Bambu Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Astro 5.x (Static + SSR) |
| Database | Neon PostgreSQL |
| Authentication | JWT + bcryptjs |
| Email | Resend API |
| Hosting | Vercel |
| Currency | BRL (Brazilian Real) |

### 1.2 What Meu Bambu Already Has

| Feature | Status | Notes |
|---------|--------|-------|
| Customer database | Ready | Neon PostgreSQL with Drizzle ORM |
| Customer authentication | Ready | JWT tokens, bcrypt password hashing |
| Email notifications | Ready | Resend API configured |
| Admin dashboard UI | Built | Needs payment data wiring |
| Order schema | Designed | Ready for implementation |

---

## 2. Authentication

### 2.1 API Key Authentication

The payment provider must support API key authentication:

```
Header: Authorization: Bearer <api_key>
```

### 2.2 Required Credentials

Provide Meu Bambu with:

| Credential | Purpose |
|------------|---------|
| `sandbox_api_key` | Testing/development environment |
| `production_api_key` | Live transactions |
| `webhook_secret` | Validating webhook signatures |

### 2.3 Webhook Signature Validation

All webhooks must include a signature header for validation:

```
Header: X-Webhook-Signature: sha256=<hmac_signature>
```

Signature calculation:
```
HMAC-SHA256(webhook_secret, request_body)
```

---

## 3. Core Payment Endpoints

### 3.1 Create Payment Session

Creates a new payment session for an order.

```
POST /api/payments/create
Content-Type: application/json
Authorization: Bearer <api_key>
```

**Request Body:**
```json
{
  "orderId": "MB-2024-0001",
  "amount": 199.00,
  "currency": "BRL",
  "customer": {
    "id": "cust_abc123",
    "email": "cliente@email.com",
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "phone": "(11) 99999-9999"
  },
  "items": [
    {
      "sku": "PBN-3MM-200X60",
      "name": "Painel Bambu Premium",
      "variant": "3mm - 200x60cm",
      "quantity": 2,
      "unitPrice": 199.00
    }
  ],
  "shippingAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Jardim Paulista",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-100"
  },
  "callbackUrl": "https://meubambu.com.br/api/webhooks/payment",
  "successUrl": "https://meubambu.com.br/pedido/sucesso",
  "cancelUrl": "https://meubambu.com.br/checkout"
}
```

**Response (Success - 201):**
```json
{
  "paymentId": "pay_xyz789",
  "status": "pending",
  "paymentUrl": "https://payment-provider.com/checkout/pay_xyz789",
  "expiresAt": "2024-12-10T15:30:00Z",
  "availableMethods": ["pix", "credit_card", "boleto"]
}
```

---

### 3.2 Get Payment Status

Retrieves the current status of a payment.

```
GET /api/payments/:paymentId
Authorization: Bearer <api_key>
```

**Response (Success - 200):**
```json
{
  "paymentId": "pay_xyz789",
  "orderId": "MB-2024-0001",
  "status": "confirmed",
  "amount": 199.00,
  "currency": "BRL",
  "paymentMethod": "pix",
  "paidAt": "2024-12-08T14:25:00Z",
  "transactionId": "E123456789",
  "createdAt": "2024-12-08T14:20:00Z"
}
```

**Possible Status Values:**
| Status | Description |
|--------|-------------|
| `pending` | Awaiting payment |
| `processing` | Payment being processed |
| `confirmed` | Payment successful |
| `failed` | Payment failed |
| `cancelled` | Payment cancelled |
| `refunded` | Payment refunded |
| `expired` | Payment session expired |

---

### 3.3 Process Payment (Direct)

For server-to-server payment processing (if not using hosted checkout).

```
POST /api/payments/:paymentId/process
Content-Type: application/json
Authorization: Bearer <api_key>
```

**Request Body (Credit Card):**
```json
{
  "method": "credit_card",
  "card": {
    "number": "4111111111111111",
    "expMonth": 12,
    "expYear": 2025,
    "cvv": "123",
    "holderName": "JOAO SILVA"
  },
  "installments": 3,
  "saveCard": true
}
```

**Request Body (PIX):**
```json
{
  "method": "pix"
}
```

**Response (PIX - 200):**
```json
{
  "paymentId": "pay_xyz789",
  "status": "pending",
  "method": "pix",
  "pix": {
    "qrCode": "00020126580014br.gov.bcb.pix...",
    "qrCodeBase64": "data:image/png;base64,iVBORw0KGgo...",
    "copyPasteCode": "00020126580014br.gov.bcb.pix...",
    "expiresAt": "2024-12-08T15:20:00Z"
  }
}
```

**Response (Boleto - 200):**
```json
{
  "paymentId": "pay_xyz789",
  "status": "pending",
  "method": "boleto",
  "boleto": {
    "barcode": "23793.38128 60000.000003 00000.000400 1 84340000019900",
    "digitableLine": "23793381286000000000300000000401843400000199 00",
    "pdfUrl": "https://payment-provider.com/boleto/pay_xyz789.pdf",
    "expiresAt": "2024-12-11T23:59:59Z"
  }
}
```

---

### 3.4 Process Refund

Refunds a confirmed payment.

```
POST /api/payments/:paymentId/refund
Content-Type: application/json
Authorization: Bearer <api_key>
```

**Request Body:**
```json
{
  "amount": 199.00,
  "reason": "customer_request",
  "description": "Cliente solicitou cancelamento"
}
```

**Response (Success - 200):**
```json
{
  "refundId": "ref_abc123",
  "paymentId": "pay_xyz789",
  "amount": 199.00,
  "status": "processing",
  "estimatedCompletionDate": "2024-12-15T00:00:00Z"
}
```

**Refund Reason Values:**
- `customer_request`
- `duplicate_payment`
- `fraudulent`
- `product_issue`
- `other`

---

### 3.5 Cancel Payment

Cancels a pending payment session.

```
POST /api/payments/:paymentId/cancel
Authorization: Bearer <api_key>
```

**Response (Success - 200):**
```json
{
  "paymentId": "pay_xyz789",
  "status": "cancelled",
  "cancelledAt": "2024-12-08T15:00:00Z"
}
```

---

## 4. Webhook Notifications

The payment provider must send webhook notifications to Meu Bambu's callback URL when payment events occur.

### 4.1 Webhook Request Format

```
POST {callbackUrl}
Content-Type: application/json
X-Webhook-Signature: sha256=<signature>
X-Webhook-Event: payment.confirmed
X-Webhook-Timestamp: 1702045200
```

### 4.2 Webhook Events

#### payment.confirmed

Sent when payment is successfully completed.

```json
{
  "event": "payment.confirmed",
  "paymentId": "pay_xyz789",
  "orderId": "MB-2024-0001",
  "amount": 199.00,
  "currency": "BRL",
  "paymentMethod": "pix",
  "paidAt": "2024-12-08T14:25:00Z",
  "transactionId": "E123456789",
  "customer": {
    "email": "cliente@email.com",
    "name": "João Silva"
  }
}
```

#### payment.failed

Sent when payment attempt fails.

```json
{
  "event": "payment.failed",
  "paymentId": "pay_xyz789",
  "orderId": "MB-2024-0001",
  "amount": 199.00,
  "failureCode": "insufficient_funds",
  "failureMessage": "Saldo insuficiente",
  "failedAt": "2024-12-08T14:25:00Z"
}
```

**Failure Codes:**
| Code | Description |
|------|-------------|
| `insufficient_funds` | Saldo insuficiente |
| `card_declined` | Cartão recusado |
| `expired_card` | Cartão expirado |
| `invalid_cvv` | CVV inválido |
| `processing_error` | Erro de processamento |
| `fraud_suspected` | Suspeita de fraude |

#### payment.refunded

Sent when refund is processed.

```json
{
  "event": "payment.refunded",
  "paymentId": "pay_xyz789",
  "orderId": "MB-2024-0001",
  "refundId": "ref_abc123",
  "amount": 199.00,
  "refundedAt": "2024-12-10T10:00:00Z"
}
```

#### payment.expired

Sent when PIX or Boleto expires without payment.

```json
{
  "event": "payment.expired",
  "paymentId": "pay_xyz789",
  "orderId": "MB-2024-0001",
  "expiredAt": "2024-12-08T15:20:00Z",
  "method": "pix"
}
```

### 4.3 Webhook Response

Meu Bambu will respond with:

**Success:**
```
HTTP 200 OK
{"received": true}
```

**Failure (will retry):**
```
HTTP 500 Internal Server Error
```

### 4.4 Webhook Retry Policy

If Meu Bambu doesn't respond with 2xx status:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 5 minutes |
| 3 | 30 minutes |
| 4 | 2 hours |
| 5 | 24 hours |

---

## 5. Data Structures

### 5.1 Customer Object

```typescript
interface Customer {
  id: string;              // Meu Bambu customer ID
  email: string;           // Required
  name: string;            // Required
  cpf?: string;            // Brazilian CPF (format: 123.456.789-00)
  cnpj?: string;           // Brazilian CNPJ for businesses
  phone?: string;          // Format: (11) 99999-9999
}
```

### 5.2 Item Object

```typescript
interface OrderItem {
  sku: string;             // Product SKU (e.g., "PBN-3MM-200X60")
  name: string;            // Product name
  variant?: string;        // Variant description (e.g., "3mm - 200x60cm")
  quantity: number;        // Quantity ordered
  unitPrice: number;       // Price per unit in BRL
}
```

### 5.3 Address Object

```typescript
interface Address {
  street: string;          // Rua, Avenida, etc.
  number: string;          // Street number
  complement?: string;     // Apartment, suite, etc.
  neighborhood: string;    // Bairro
  city: string;            // City name
  state: string;           // 2-letter state code (SP, RJ, MG, etc.)
  zipCode: string;         // CEP (format: 01310-100 or 01310100)
}
```

### 5.4 SKU Code Structure

Meu Bambu uses the following SKU format:

```
Format: [PRODUCT]-[THICKNESS]-[SIZE]

Products:
  PBN = Painel Bambu Natural
  PBP = Painel Bambu Premium
  LBF = Lâmina Bambu Flexível

Examples:
  PBN-3MM-200X60  → Painel Natural, 3mm, 200x60cm
  PBP-5MM-130X28  → Painel Premium, 5mm, 130x28cm
  LBF-06MM-200X60 → Lâmina Flexível, 0.6mm, 200x60cm
```

---

## 6. Payment Methods

### 6.1 Required Methods

| Method | Priority | Notes |
|--------|----------|-------|
| **PIX** | High | Most popular in Brazil, instant settlement |
| **Credit Card** | High | Must support installments (parcelas) |
| **Boleto Bancário** | Medium | 3-day expiration typical |

### 6.2 PIX Requirements

- QR Code generation
- Copy/paste code (copia e cola)
- Real-time confirmation via webhook
- 15-30 minute expiration window

### 6.3 Credit Card Requirements

- Major brands: Visa, Mastercard, Elo, American Express, Hipercard
- Installments support (parcelas): 1x to 12x
- Optional: Save card for future purchases
- 3D Secure support (recommended)

**Installment Calculation:**
```
1x  - R$ 199.00 (sem juros)
2x  - R$ 99.50 (sem juros)
3x  - R$ 66.33 (sem juros)
4x+ - Com juros (provider defines rate)
```

### 6.4 Boleto Requirements

- PDF generation
- Barcode and digitable line
- 3-day default expiration
- Confirmation via webhook (may take 1-3 business days)

---

## 7. Brazilian Compliance

### 7.1 Required Validations

| Field | Validation |
|-------|------------|
| CPF | 11 digits, mod 11 checksum |
| CNPJ | 14 digits, mod 11 checksum |
| CEP | 8 digits |
| Phone | (XX) XXXXX-XXXX or (XX) XXXX-XXXX |

### 7.2 Regulatory Requirements

- **Central Bank PIX Integration**: Must be registered with BCB
- **LGPD Compliance**: Brazilian data protection law
- **PCI-DSS**: For card data handling
- **Nota Fiscal Integration**: Optional, but recommended

### 7.3 Currency

- All amounts in BRL (Brazilian Real)
- Decimal precision: 2 places
- Format: `199.00` (use period as decimal separator)

---

## 8. Integration Flow

### 8.1 Standard Checkout Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Customer clicks "COMPRAR" on Meu Bambu                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Meu Bambu creates order in database                      │
│    Status: pending_payment                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Meu Bambu calls: POST /api/payments/create               │
│    Sends: order details, customer, items, addresses         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Payment Provider returns paymentUrl or PIX code          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Customer completes payment                               │
│    - Hosted checkout page, OR                               │
│    - PIX QR code scan, OR                                   │
│    - Boleto payment                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Payment Provider sends webhook: payment.confirmed        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Meu Bambu updates order status to "processing"           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Meu Bambu sends order confirmation email via Resend      │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Refund Flow

```
1. Admin requests refund in Meu Bambu dashboard
2. Meu Bambu calls: POST /api/payments/:id/refund
3. Payment Provider processes refund
4. Payment Provider sends webhook: payment.refunded
5. Meu Bambu updates order status to "refunded"
6. Meu Bambu sends refund confirmation email
```

---

## 9. Error Handling

### 9.1 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid API key) |
| 404 | Not Found |
| 409 | Conflict (e.g., already refunded) |
| 422 | Unprocessable Entity |
| 429 | Rate Limited |
| 500 | Internal Server Error |

### 9.2 Error Response Format

```json
{
  "error": {
    "code": "invalid_cpf",
    "message": "CPF inválido",
    "field": "customer.cpf",
    "details": "CPF must be 11 digits with valid checksum"
  }
}
```

### 9.3 Common Error Codes

| Code | Description |
|------|-------------|
| `invalid_api_key` | API key is invalid or expired |
| `invalid_cpf` | CPF validation failed |
| `invalid_amount` | Amount must be positive |
| `payment_not_found` | Payment ID doesn't exist |
| `already_refunded` | Payment was already refunded |
| `refund_exceeds_amount` | Refund amount exceeds original |
| `payment_expired` | Payment session has expired |

---

## 10. Testing & Sandbox

### 10.1 Sandbox Environment

Provide a sandbox environment with:
- Test API keys
- Simulated payment flows
- Test card numbers
- Test PIX codes

### 10.2 Test Card Numbers

| Card | Number | Result |
|------|--------|--------|
| Visa (Success) | 4111 1111 1111 1111 | Approved |
| Visa (Decline) | 4000 0000 0000 0002 | Declined |
| Mastercard | 5555 5555 5555 4444 | Approved |
| Insufficient Funds | 4000 0000 0000 9995 | Insufficient funds |

### 10.3 Test PIX

- Sandbox PIX should auto-confirm after 5 seconds
- Or provide manual confirmation trigger

### 10.4 Webhook Testing

Provide a way to:
- Manually trigger webhooks
- View webhook history
- Retry failed webhooks

---

## Appendix A: Complete Request/Response Examples

### A.1 Full Payment Creation Example

**Request:**
```bash
curl -X POST https://api.payment-provider.com/api/payments/create \
  -H "Authorization: Bearer sk_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "MB-2024-0001",
    "amount": 597.00,
    "currency": "BRL",
    "customer": {
      "id": "cust_abc123",
      "email": "joao.silva@email.com",
      "name": "João Silva",
      "cpf": "123.456.789-00",
      "phone": "(11) 99999-9999"
    },
    "items": [
      {
        "sku": "PBN-3MM-200X60",
        "name": "Painel Bambu Premium",
        "variant": "3mm - 200x60cm",
        "quantity": 2,
        "unitPrice": 199.00
      },
      {
        "sku": "LBF-06MM-200X60",
        "name": "Lâmina Bambu Flexível",
        "variant": "0.6mm - 200x60cm",
        "quantity": 1,
        "unitPrice": 199.00
      }
    ],
    "shippingAddress": {
      "street": "Rua das Flores",
      "number": "123",
      "complement": "Apto 45",
      "neighborhood": "Jardim Paulista",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310-100"
    },
    "callbackUrl": "https://meubambu.com.br/api/webhooks/payment",
    "successUrl": "https://meubambu.com.br/pedido/sucesso?order=MB-2024-0001",
    "cancelUrl": "https://meubambu.com.br/checkout"
  }'
```

**Response:**
```json
{
  "paymentId": "pay_xyz789",
  "status": "pending",
  "paymentUrl": "https://checkout.payment-provider.com/pay_xyz789",
  "expiresAt": "2024-12-08T16:00:00Z",
  "availableMethods": ["pix", "credit_card", "boleto"]
}
```

---

## Appendix B: Meu Bambu Contact Information

For integration support and API key requests:

- **Technical Contact:** dev@murilo.design
- **Website:** https://meubambu.com.br
- **Company:** Meu Bambu - Flowing Boards
- **CNPJ:** 12.641.824/0001-20

---

**Document Prepared By:** Meu Bambu Development Team
**Last Updated:** December 2025
**Status:** Ready for Implementation
