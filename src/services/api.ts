/**
 * API Service Layer
 * Connects to the Nuxt backend for all e-commerce operations
 */

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'https://api.meubambu.com.br';

interface ApiError extends Error {
	status?: number;
	code?: string;
}

async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
	token?: string
): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const error: ApiError = new Error('API request failed');
		error.status = response.status;

		try {
			const data = await response.json();
			error.message = data.message || 'Request failed';
			error.code = data.code;
		} catch {
			error.message = `HTTP ${response.status}`;
		}

		throw error;
	}

	// Handle empty responses
	const text = await response.text();
	return text ? JSON.parse(text) : null;
}

// ============================================
// Authentication
// ============================================

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	phone?: string;
}

export interface AuthResponse {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
	return apiRequest<AuthResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
	return apiRequest<AuthResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function logout(token: string): Promise<void> {
	return apiRequest('/auth/logout', {
		method: 'POST',
	}, token);
}

export async function refreshToken(token: string): Promise<AuthResponse> {
	return apiRequest<AuthResponse>('/auth/refresh', {
		method: 'POST',
	}, token);
}

// ============================================
// Orders
// ============================================

export interface Order {
	id: string;
	orderNumber: string;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	createdAt: string;
	total: number;
	subtotal: number;
	shipping: number;
	discount: number;
	items: OrderItem[];
	shippingAddress: Address;
	paymentMethod: string;
	paymentDetails?: string;
	tracking?: {
		code: string;
		url: string;
	};
	statusHistory?: Array<{
		status: string;
		date: string;
	}>;
	cancelledAt?: string;
}

export interface OrderItem {
	id: string;
	name: string;
	variant: string;
	quantity: number;
	price: number;
	image?: string;
}

export interface Address {
	name: string;
	street: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
	zipCode: string;
}

export async function getOrders(token: string): Promise<Order[]> {
	return apiRequest<Order[]>('/orders', {}, token);
}

export async function getOrder(token: string, orderId: string): Promise<Order> {
	return apiRequest<Order>(`/orders/${orderId}`, {}, token);
}

export async function cancelOrder(token: string, orderId: string): Promise<void> {
	return apiRequest(`/orders/${orderId}/cancel`, {
		method: 'POST',
	}, token);
}

export async function requestRefund(token: string, orderId: string): Promise<void> {
	return apiRequest(`/orders/${orderId}/refund`, {
		method: 'POST',
	}, token);
}

// ============================================
// Customer Profile
// ============================================

export interface CustomerProfile {
	id: string;
	name: string;
	email: string;
	phone?: string;
	cpf?: string;
	address?: Address;
}

export interface UpdateProfileRequest {
	name?: string;
	email?: string;
	phone?: string;
	cpf?: string;
	address?: Partial<Address>;
}

export async function getProfile(token: string): Promise<CustomerProfile> {
	return apiRequest<CustomerProfile>('/customer/profile', {}, token);
}

export async function updateProfile(
	token: string,
	data: UpdateProfileRequest
): Promise<CustomerProfile> {
	return apiRequest<CustomerProfile>('/customer/profile', {
		method: 'PUT',
		body: JSON.stringify(data),
	}, token);
}

// ============================================
// Payment Methods
// ============================================

export interface PaymentMethod {
	id: string;
	brand: string;
	last4: string;
	expMonth: number;
	expYear: number;
}

export async function getPaymentMethods(token: string): Promise<PaymentMethod[]> {
	return apiRequest<PaymentMethod[]>('/customer/payment-methods', {}, token);
}

export async function removePaymentMethod(
	token: string,
	paymentMethodId: string
): Promise<void> {
	return apiRequest(`/customer/payment-methods/${paymentMethodId}`, {
		method: 'DELETE',
	}, token);
}

// ============================================
// Shipping
// ============================================

export interface ShippingQuote {
	id: string;
	carrier: string;
	service: string;
	price: number;
	deliveryDays: number;
	deliveryDate: string;
}

export interface ShippingCalculateRequest {
	zipCode: string;
	items: Array<{
		productId: string;
		quantity: number;
	}>;
}

export async function calculateShipping(
	data: ShippingCalculateRequest
): Promise<ShippingQuote[]> {
	return apiRequest<ShippingQuote[]>('/shipping/calculate', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function getTracking(
	token: string,
	orderId: string
): Promise<{
	code: string;
	url: string;
	status: string;
	events: Array<{
		date: string;
		description: string;
		location?: string;
	}>;
}> {
	return apiRequest(`/orders/${orderId}/tracking`, {}, token);
}
