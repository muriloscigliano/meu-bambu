# API Requirements for Nuxt Backend

This document specifies the API endpoints that the MeuBambu customer dashboard expects from the Nuxt backend.

## Base URL

Configure in environment variable: `PUBLIC_API_URL`
Example: `https://api.meubambu.com.br`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

**Errors:**
- 401: Invalid credentials
- 422: Validation error

---

#### POST /auth/register
Create a new account.

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string" // optional
}
```

**Response (201):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

**Errors:**
- 409: Email already exists
- 422: Validation error

---

#### POST /auth/logout
Invalidate the current token.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true
}
```

---

#### POST /auth/refresh
Refresh the authentication token.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "token": "new_jwt_token_string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

---

### Orders

#### GET /orders
List all orders for the authenticated customer.

**Headers:** Requires authentication

**Response (200):**
```json
[
  {
    "id": "string",
    "orderNumber": "string", // e.g., "MB-2024-0001"
    "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled",
    "createdAt": "2024-01-15T10:30:00Z",
    "total": 299.00,
    "items": [
      {
        "id": "string",
        "name": "Painel de Bambu Premium",
        "variant": "3mm - 200x60cm",
        "quantity": 2,
        "price": 149.50,
        "image": "/images/product.jpg" // optional
      }
    ]
  }
]
```

---

#### GET /orders/:id
Get detailed information about a specific order.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "id": "string",
  "orderNumber": "string",
  "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  "createdAt": "2024-01-15T10:30:00Z",
  "total": 299.00,
  "subtotal": 279.00,
  "shipping": 25.00,
  "discount": 5.00,
  "items": [
    {
      "id": "string",
      "name": "Painel de Bambu Premium",
      "variant": "3mm - 200x60cm",
      "quantity": 2,
      "price": 149.50,
      "image": "/images/product.jpg"
    }
  ],
  "shippingAddress": {
    "name": "João Silva",
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45", // optional
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "paymentMethod": "Cartão de Crédito",
  "paymentDetails": "Visa •••• 4242", // optional
  "tracking": { // optional, only if shipped
    "code": "BR123456789BR",
    "url": "https://www.linkcorreto.com.br/track/BR123456789BR"
  },
  "statusHistory": [
    {
      "status": "pending",
      "date": "2024-01-15T10:30:00Z"
    },
    {
      "status": "processing",
      "date": "2024-01-15T14:00:00Z"
    }
  ],
  "cancelledAt": "2024-01-16T09:00:00Z" // only if cancelled
}
```

---

#### POST /orders/:id/cancel
Cancel an order. Only allowed for orders with status "pending" or "processing".

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "message": "Pedido cancelado com sucesso"
}
```

**Errors:**
- 400: Order cannot be cancelled (wrong status)
- 404: Order not found

---

#### POST /orders/:id/refund
Request a refund. Only allowed for delivered orders.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "message": "Solicitação de reembolso enviada",
  "refundId": "string"
}
```

**Errors:**
- 400: Order cannot be refunded (wrong status)
- 404: Order not found

---

#### GET /orders/:id/tracking
Get detailed tracking information.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "code": "BR123456789BR",
  "url": "https://www.linkcorreto.com.br/track/BR123456789BR",
  "status": "in_transit",
  "events": [
    {
      "date": "2024-01-17T08:00:00Z",
      "description": "Objeto em trânsito - por favor aguarde",
      "location": "São Paulo, SP"
    },
    {
      "date": "2024-01-16T15:00:00Z",
      "description": "Objeto postado",
      "location": "Joanópolis, SP"
    }
  ]
}
```

---

### Customer Profile

#### GET /customer/profile
Get the authenticated customer's profile.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "id": "string",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999", // optional
  "cpf": "123.456.789-00", // optional
  "address": { // optional
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }
}
```

---

#### PUT /customer/profile
Update the customer's profile.

**Headers:** Requires authentication

**Request:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "cpf": "string",
  "address": {
    "street": "string",
    "number": "string",
    "complement": "string",
    "neighborhood": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  }
}
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "cpf": "string",
  "address": { ... }
}
```

**Errors:**
- 409: Email already in use by another account
- 422: Validation error

---

### Payment Methods

#### GET /customer/payment-methods
List saved payment methods.

**Headers:** Requires authentication

**Response (200):**
```json
[
  {
    "id": "string",
    "brand": "visa", // visa, mastercard, amex, elo, hipercard
    "last4": "4242",
    "expMonth": 12,
    "expYear": 2025
  }
]
```

---

#### DELETE /customer/payment-methods/:id
Remove a saved payment method.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true
}
```

**Errors:**
- 404: Payment method not found

---

### Shipping

#### POST /shipping/calculate
Calculate shipping options for a cart.

**Request:**
```json
{
  "zipCode": "01234-567",
  "items": [
    {
      "productId": "string",
      "quantity": 2
    }
  ]
}
```

**Response (200):**
```json
[
  {
    "id": "melhorenvio_sedex",
    "carrier": "Correios",
    "service": "SEDEX",
    "price": 35.90,
    "deliveryDays": 3,
    "deliveryDate": "2024-01-18"
  },
  {
    "id": "melhorenvio_pac",
    "carrier": "Correios",
    "service": "PAC",
    "price": 22.50,
    "deliveryDays": 7,
    "deliveryDate": "2024-01-22"
  },
  {
    "id": "flatrate_grande",
    "carrier": "Transportadora",
    "service": "Frete para painéis grandes",
    "price": 150.00,
    "deliveryDays": 10,
    "deliveryDate": "2024-01-25"
  }
]
```

**Note:** For large panels (e.g., 200x60cm), use flat rate shipping by state since Melhor Envio may not support the dimensions. The flat rate table should be configured in the backend.

---

## Error Response Format

All error responses should follow this format:

```json
{
  "error": true,
  "message": "Human-readable error message",
  "code": "ERROR_CODE" // optional, for programmatic handling
}
```

Common HTTP status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (action not allowed)
- 404: Not Found
- 409: Conflict (e.g., email already exists)
- 422: Unprocessable Entity (validation error)
- 500: Internal Server Error

---

## Shipping Configuration

### Melhor Envio Integration
Use Melhor Envio API for standard-size products:
- API Docs: https://docs.melhorenvio.com.br/
- Calculate shipping based on product dimensions and weight
- Generate shipping labels and tracking codes

### Flat Rate Shipping by State
For large panels (200x60cm or larger), use flat rate shipping:

| State | Price |
|-------|-------|
| SP    | R$ 80 |
| RJ    | R$ 100 |
| MG    | R$ 100 |
| PR, SC, RS | R$ 120 |
| Other states | R$ 150 |

Configure these rates in the backend and return them as a shipping option when product dimensions exceed Melhor Envio limits.

---

## Environment Variables (Astro Frontend)

```env
PUBLIC_API_URL=https://api.meubambu.com.br
```

---

## CORS Configuration

The Nuxt backend should allow requests from:
- `https://meubambu.com.br`
- `https://www.meubambu.com.br`
- `http://localhost:4321` (development)

---

## Security Recommendations

1. **JWT Tokens**: Use short-lived access tokens (15-30 min) with refresh tokens
2. **Password Hashing**: Use bcrypt with cost factor 12+
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **Input Validation**: Validate and sanitize all inputs
5. **HTTPS**: Enforce HTTPS in production
6. **Secure Cookies**: Use HttpOnly, Secure, SameSite flags for tokens
