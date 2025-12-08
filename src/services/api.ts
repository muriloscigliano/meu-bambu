/**
 * API Service Layer
 * Connects to the Nuxt backend for all e-commerce operations
 */

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'https://api.meubambu.com.br';

// Mock mode for testing - set to true to use fake data
// Auth uses real database, other features still use mock data
const MOCK_MODE = true;
const USE_REAL_AUTH = true; // Use Neon database for authentication

// Test credentials
const TEST_USER = {
	email: 'teste@meubambu.com.br',
	password: 'teste123',
	id: 'user-001',
	name: 'João Silva',
	phone: '(11) 99999-9999',
	cpf: '123.456.789-00',
};

// Mock data
const MOCK_ORDERS: Order[] = [
	{
		id: 'order-001',
		orderNumber: 'MB-2024-0001',
		status: 'delivered',
		createdAt: '2024-12-01T10:30:00Z',
		total: 299.00,
		subtotal: 274.00,
		shipping: 25.00,
		discount: 0,
		items: [
			{
				id: 'item-001',
				name: 'Painel de Bambu Premium',
				variant: '3mm - 200x60cm',
				quantity: 2,
				price: 137.00,
				image: '/images/painel-bambu.jpg',
			},
		],
		shippingAddress: {
			name: 'João Silva',
			street: 'Rua das Flores',
			number: '123',
			complement: 'Apto 45',
			neighborhood: 'Centro',
			city: 'São Paulo',
			state: 'SP',
			zipCode: '01234-567',
		},
		paymentMethod: 'Cartão de Crédito',
		paymentDetails: 'Visa •••• 4242',
		tracking: {
			code: 'BR123456789BR',
			url: 'https://www.linkcorreto.com.br/track/BR123456789BR',
		},
		statusHistory: [
			{ status: 'pending', date: '2024-12-01T10:30:00Z' },
			{ status: 'processing', date: '2024-12-01T14:00:00Z' },
			{ status: 'shipped', date: '2024-12-02T09:00:00Z' },
			{ status: 'delivered', date: '2024-12-05T15:30:00Z' },
		],
	},
	{
		id: 'order-002',
		orderNumber: 'MB-2024-0002',
		status: 'processing',
		createdAt: '2024-12-06T14:00:00Z',
		total: 458.50,
		subtotal: 408.50,
		shipping: 50.00,
		discount: 0,
		items: [
			{
				id: 'item-002',
				name: 'Painel de Bambu Natural',
				variant: '5mm - 200x60cm',
				quantity: 3,
				price: 136.17,
				image: '/images/painel-bambu.jpg',
			},
		],
		shippingAddress: {
			name: 'João Silva',
			street: 'Rua das Flores',
			number: '123',
			complement: 'Apto 45',
			neighborhood: 'Centro',
			city: 'São Paulo',
			state: 'SP',
			zipCode: '01234-567',
		},
		paymentMethod: 'PIX',
		statusHistory: [
			{ status: 'pending', date: '2024-12-06T14:00:00Z' },
			{ status: 'processing', date: '2024-12-06T14:30:00Z' },
		],
	},
	{
		id: 'order-003',
		orderNumber: 'MB-2024-0003',
		status: 'pending',
		createdAt: '2024-12-08T09:00:00Z',
		total: 185.00,
		subtotal: 160.00,
		shipping: 25.00,
		discount: 0,
		items: [
			{
				id: 'item-003',
				name: 'Painel de Bambu Premium',
				variant: '3mm - 100x60cm',
				quantity: 2,
				price: 80.00,
				image: '/images/painel-bambu.jpg',
			},
		],
		shippingAddress: {
			name: 'João Silva',
			street: 'Rua das Flores',
			number: '123',
			complement: 'Apto 45',
			neighborhood: 'Centro',
			city: 'São Paulo',
			state: 'SP',
			zipCode: '01234-567',
		},
		paymentMethod: 'Boleto Bancário',
		statusHistory: [
			{ status: 'pending', date: '2024-12-08T09:00:00Z' },
		],
	},
];

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
	{
		id: 'pm-001',
		brand: 'visa',
		last4: '4242',
		expMonth: 12,
		expYear: 2025,
	},
	{
		id: 'pm-002',
		brand: 'mastercard',
		last4: '8888',
		expMonth: 6,
		expYear: 2026,
	},
];

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
	if (USE_REAL_AUTH) {
		// Use real database authentication
		const { loginCustomer } = await import('./auth');
		const result = await loginCustomer(data);
		return {
			token: result.token,
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
			},
		};
	}

	if (MOCK_MODE) {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 500));

		if (data.email === TEST_USER.email && data.password === TEST_USER.password) {
			return {
				token: 'mock-jwt-token-' + Date.now(),
				user: {
					id: TEST_USER.id,
					name: TEST_USER.name,
					email: TEST_USER.email,
				},
			};
		}
		throw new Error('E-mail ou senha inválidos');
	}

	return apiRequest<AuthResponse>('/auth/login', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
	if (USE_REAL_AUTH) {
		// Use real database authentication
		const { registerCustomer } = await import('./auth');
		const result = await registerCustomer(data);
		return {
			token: result.token,
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
			},
		};
	}

	if (MOCK_MODE) {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 500));

		if (data.email === TEST_USER.email) {
			throw new Error('Este e-mail já está cadastrado');
		}

		return {
			token: 'mock-jwt-token-' + Date.now(),
			user: {
				id: 'user-' + Date.now(),
				name: data.name,
				email: data.email,
			},
		};
	}

	return apiRequest<AuthResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function logout(token: string): Promise<void> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));
		return;
	}

	return apiRequest('/auth/logout', {
		method: 'POST',
	}, token);
}

export async function refreshToken(token: string): Promise<AuthResponse> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));
		return {
			token: 'mock-jwt-token-refreshed-' + Date.now(),
			user: {
				id: TEST_USER.id,
				name: TEST_USER.name,
				email: TEST_USER.email,
			},
		};
	}

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
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));
		return MOCK_ORDERS;
	}

	return apiRequest<Order[]>('/orders', {}, token);
}

export async function getOrder(token: string, orderId: string): Promise<Order> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));
		const order = MOCK_ORDERS.find(o => o.id === orderId);
		if (!order) {
			throw new Error('Pedido não encontrado');
		}
		return order;
	}

	return apiRequest<Order>(`/orders/${orderId}`, {}, token);
}

export async function cancelOrder(token: string, orderId: string): Promise<void> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 500));
		const order = MOCK_ORDERS.find(o => o.id === orderId);
		if (!order) {
			throw new Error('Pedido não encontrado');
		}
		if (!['pending', 'processing'].includes(order.status)) {
			throw new Error('Este pedido não pode ser cancelado');
		}
		order.status = 'cancelled';
		order.cancelledAt = new Date().toISOString();
		return;
	}

	return apiRequest(`/orders/${orderId}/cancel`, {
		method: 'POST',
	}, token);
}

export async function requestRefund(token: string, orderId: string): Promise<void> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 500));
		const order = MOCK_ORDERS.find(o => o.id === orderId);
		if (!order) {
			throw new Error('Pedido não encontrado');
		}
		if (order.status !== 'delivered') {
			throw new Error('Apenas pedidos entregues podem solicitar reembolso');
		}
		return;
	}

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

// Store profile data for mock mode
let mockProfile: CustomerProfile = {
	id: TEST_USER.id,
	name: TEST_USER.name,
	email: TEST_USER.email,
	phone: TEST_USER.phone,
	cpf: TEST_USER.cpf,
	address: {
		name: TEST_USER.name,
		street: 'Rua das Flores',
		number: '123',
		complement: 'Apto 45',
		neighborhood: 'Centro',
		city: 'São Paulo',
		state: 'SP',
		zipCode: '01234-567',
	},
};

export async function getProfile(token: string): Promise<CustomerProfile> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));
		return { ...mockProfile };
	}

	return apiRequest<CustomerProfile>('/customer/profile', {}, token);
}

export async function updateProfile(
	token: string,
	data: UpdateProfileRequest
): Promise<CustomerProfile> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 500));

		// Update mock profile
		mockProfile = {
			...mockProfile,
			...data,
			address: data.address ? { ...mockProfile.address, ...data.address } as Address : mockProfile.address,
		};

		return { ...mockProfile };
	}

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

// Mutable copy for mock mode
let mockPaymentMethods = [...MOCK_PAYMENT_METHODS];

export async function getPaymentMethods(token: string): Promise<PaymentMethod[]> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));
		return [...mockPaymentMethods];
	}

	return apiRequest<PaymentMethod[]>('/customer/payment-methods', {}, token);
}

export async function removePaymentMethod(
	token: string,
	paymentMethodId: string
): Promise<void> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 500));
		const index = mockPaymentMethods.findIndex(pm => pm.id === paymentMethodId);
		if (index === -1) {
			throw new Error('Método de pagamento não encontrado');
		}
		mockPaymentMethods.splice(index, 1);
		return;
	}

	return apiRequest(`/customer/payment-methods/${paymentMethodId}`, {
		method: 'DELETE',
	}, token);
}

// ============================================
// Products & Catalog
// ============================================

export interface ProductVariant {
	id: string;
	sku: string;                    // Unique code: PBN-3MM-200X60
	thickness: string;              // "3mm", "5mm"
	size: string;                   // "200x60cm", "100x60cm"
	price: number;
	compareAtPrice?: number;        // Original price for discounts
	stock: number;
	weight: number;                 // kg - for shipping calculation
	dimensions: {
		length: number;             // cm
		width: number;              // cm
		height: number;             // cm (thickness)
	};
}

export interface Product {
	id: string;
	slug: string;
	name: string;
	shortName: string;
	description: string;
	features: string[];
	images: string[];
	category: string;
	variants: ProductVariant[];
	active: boolean;
}

// Mock product catalog
const MOCK_PRODUCTS: Product[] = [
	{
		id: 'prod-001',
		slug: 'painel-bambu-natural',
		name: 'Painel de Bambu Natural',
		shortName: 'Natural',
		description: 'Painel de bambu com acabamento natural, ideal para revestimentos e decoração. Fibras naturais que trazem elegância e sustentabilidade ao seu ambiente.',
		features: [
			'100% bambu natural',
			'Tratamento anti-cupim',
			'Fácil instalação',
			'Sustentável e ecológico',
		],
		images: ['/images/painel-bambu.jpg'],
		category: 'paineis',
		active: true,
		variants: [
			{
				id: 'var-001',
				sku: 'PBN-3MM-200X60',
				thickness: '3mm',
				size: '200x60cm',
				price: 137.00,
				stock: 50,
				weight: 2.5,
				dimensions: { length: 200, width: 60, height: 0.3 },
			},
			{
				id: 'var-002',
				sku: 'PBN-3MM-100X60',
				thickness: '3mm',
				size: '100x60cm',
				price: 80.00,
				stock: 75,
				weight: 1.3,
				dimensions: { length: 100, width: 60, height: 0.3 },
			},
			{
				id: 'var-003',
				sku: 'PBN-5MM-200X60',
				thickness: '5mm',
				size: '200x60cm',
				price: 165.00,
				stock: 30,
				weight: 4.0,
				dimensions: { length: 200, width: 60, height: 0.5 },
			},
			{
				id: 'var-004',
				sku: 'PBN-5MM-100X60',
				thickness: '5mm',
				size: '100x60cm',
				price: 95.00,
				stock: 45,
				weight: 2.0,
				dimensions: { length: 100, width: 60, height: 0.5 },
			},
		],
	},
	{
		id: 'prod-002',
		slug: 'painel-bambu-premium',
		name: 'Painel de Bambu Premium',
		shortName: 'Premium',
		description: 'Painel premium com seleção especial de bambus, acabamento superior e maior durabilidade. Perfeito para projetos de alto padrão.',
		features: [
			'Seleção premium de bambus',
			'Acabamento especial',
			'Maior durabilidade',
			'Garantia estendida',
		],
		images: ['/images/painel-bambu.jpg'],
		category: 'paineis',
		active: true,
		variants: [
			{
				id: 'var-005',
				sku: 'PBP-3MM-200X60',
				thickness: '3mm',
				size: '200x60cm',
				price: 185.00,
				compareAtPrice: 210.00,
				stock: 25,
				weight: 2.5,
				dimensions: { length: 200, width: 60, height: 0.3 },
			},
			{
				id: 'var-006',
				sku: 'PBP-3MM-100X60',
				thickness: '3mm',
				size: '100x60cm',
				price: 105.00,
				compareAtPrice: 120.00,
				stock: 40,
				weight: 1.3,
				dimensions: { length: 100, width: 60, height: 0.3 },
			},
			{
				id: 'var-007',
				sku: 'PBP-5MM-200X60',
				thickness: '5mm',
				size: '200x60cm',
				price: 220.00,
				compareAtPrice: 250.00,
				stock: 20,
				weight: 4.0,
				dimensions: { length: 200, width: 60, height: 0.5 },
			},
			{
				id: 'var-008',
				sku: 'PBP-5MM-100X60',
				thickness: '5mm',
				size: '100x60cm',
				price: 125.00,
				compareAtPrice: 145.00,
				stock: 35,
				weight: 2.0,
				dimensions: { length: 100, width: 60, height: 0.5 },
			},
		],
	},
];

export async function getProducts(): Promise<Product[]> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));
		return MOCK_PRODUCTS.filter(p => p.active);
	}

	return apiRequest<Product[]>('/products');
}

export async function getProduct(slug: string): Promise<Product | null> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));
		return MOCK_PRODUCTS.find(p => p.slug === slug && p.active) || null;
	}

	return apiRequest<Product>(`/products/${slug}`);
}

export async function getProductBySku(sku: string): Promise<{ product: Product; variant: ProductVariant } | null> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));
		for (const product of MOCK_PRODUCTS) {
			const variant = product.variants.find(v => v.sku === sku);
			if (variant) {
				return { product, variant };
			}
		}
		return null;
	}

	return apiRequest<{ product: Product; variant: ProductVariant }>(`/products/sku/${sku}`);
}

// ============================================
// Cart (for AI Chat integration)
// ============================================

export interface CartItem {
	sku: string;
	productId: string;
	productName: string;
	variantName: string;      // "3mm - 200x60cm"
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	image?: string;
}

export interface Cart {
	id: string;
	items: CartItem[];
	subtotal: number;
	itemCount: number;
}

// This is the data format sent to AI Chat when adding products
export interface AddToCartPayload {
	sku: string;
	quantity: number;
	productName: string;
	variantName: string;
	unitPrice: number;
	image?: string;
}

// Helper function to create cart payload from product selection
export function createCartPayload(
	product: Product,
	variant: ProductVariant,
	quantity: number = 1
): AddToCartPayload {
	return {
		sku: variant.sku,
		quantity,
		productName: product.name,
		variantName: `${variant.thickness} - ${variant.size}`,
		unitPrice: variant.price,
		image: product.images[0],
	};
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

// ============================================
// Admin Authentication
// ============================================

export interface AdminUser {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'super_admin';
}

// Mock admin users
const MOCK_ADMIN_USERS = [
	{
		id: 'admin-001',
		email: 'dev@murilo.design',
		password: 'meubambu2024',
		name: 'Murilo',
		role: 'super_admin' as const,
	},
];

export async function adminLogin(credentials: { email: string; password: string }): Promise<{ token: string; user: AdminUser }> {
	if (USE_REAL_AUTH) {
		// Use real database authentication
		const { loginAdmin } = await import('./auth');
		const result = await loginAdmin(credentials);
		return {
			token: result.token,
			user: {
				id: result.user.id,
				email: result.user.email,
				name: result.user.name,
				role: result.user.role as 'admin' | 'super_admin',
			},
		};
	}

	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 500));

		const admin = MOCK_ADMIN_USERS.find(
			u => u.email === credentials.email && u.password === credentials.password
		);

		if (!admin) {
			throw new Error('E-mail ou senha inválidos');
		}

		const { password, ...user } = admin;
		return {
			token: `admin_mock_token_${admin.id}_${Date.now()}`,
			user,
		};
	}

	return apiRequest<{ token: string; user: AdminUser }>('/admin/auth/login', {
		method: 'POST',
		body: JSON.stringify(credentials),
	});
}

export async function getAdminUser(token: string): Promise<AdminUser> {
	if (USE_REAL_AUTH) {
		// Verify JWT token
		const { verifyToken } = await import('./auth');
		const user = verifyToken(token);

		if (!user || user.type !== 'admin') {
			throw new Error('Token inválido');
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: (user.role as 'admin' | 'super_admin') || 'admin',
		};
	}

	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 100));

		if (!token.startsWith('admin_mock_token_')) {
			throw new Error('Token inválido');
		}

		const adminId = token.split('_')[3];
		const admin = MOCK_ADMIN_USERS.find(u => u.id === adminId);

		if (!admin) {
			throw new Error('Usuário não encontrado');
		}

		const { password, ...user } = admin;
		return user;
	}

	return apiRequest<AdminUser>('/admin/auth/me', {}, token);
}

// ============================================
// Admin Dashboard Stats
// ============================================

export interface DashboardStats {
	totalSales: number;
	salesTrend: number;
	totalOrders: number;
	ordersTrend: number;
	totalProducts: number;
	activeProducts: number;
	totalCustomers: number;
	customersTrend: number;
}

export async function getDashboardStats(token: string): Promise<DashboardStats> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));

		return {
			totalSales: 45680.00,
			salesTrend: 12.5,
			totalOrders: 156,
			ordersTrend: 8.3,
			totalProducts: 8,
			activeProducts: 8,
			totalCustomers: 89,
			customersTrend: 15.2,
		};
	}

	return apiRequest<DashboardStats>('/admin/dashboard/stats', {}, token);
}

export interface RecentOrder {
	id: string;
	orderNumber: string;
	customerName: string;
	total: number;
	status: string;
	createdAt: string;
}

export async function getRecentOrders(token: string, limit: number = 5): Promise<RecentOrder[]> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));

		return [
			{ id: 'order-010', orderNumber: 'MB-2024-0010', customerName: 'Ana Costa', total: 495.00, status: 'pending', createdAt: '2024-12-07T14:30:00Z' },
			{ id: 'order-009', orderNumber: 'MB-2024-0009', customerName: 'Carlos Lima', total: 274.00, status: 'processing', createdAt: '2024-12-06T11:20:00Z' },
			{ id: 'order-008', orderNumber: 'MB-2024-0008', customerName: 'Maria Santos', total: 685.00, status: 'shipped', createdAt: '2024-12-05T09:15:00Z' },
			{ id: 'order-007', orderNumber: 'MB-2024-0007', customerName: 'João Oliveira', total: 330.00, status: 'delivered', createdAt: '2024-12-04T16:45:00Z' },
			{ id: 'order-006', orderNumber: 'MB-2024-0006', customerName: 'Fernanda Silva', total: 411.00, status: 'delivered', createdAt: '2024-12-03T10:00:00Z' },
		].slice(0, limit);
	}

	return apiRequest<RecentOrder[]>(`/admin/dashboard/recent?limit=${limit}`, {}, token);
}

export interface TopProduct {
	id: string;
	name: string;
	sku: string;
	image: string;
	salesCount: number;
	revenue: number;
}

export async function getTopProducts(token: string, limit: number = 5): Promise<TopProduct[]> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));

		return [
			{ id: 'prod-001', name: 'Painel Natural 3mm', sku: 'PBN-3MM-200X60', image: '/images/painel-bambu.jpg', salesCount: 45, revenue: 6165.00 },
			{ id: 'prod-002', name: 'Painel Natural 5mm', sku: 'PBN-5MM-200X60', image: '/images/painel-bambu.jpg', salesCount: 32, revenue: 5280.00 },
			{ id: 'prod-003', name: 'Painel Premium 3mm', sku: 'PBP-3MM-200X60', image: '/images/painel-bambu.jpg', salesCount: 28, revenue: 5180.00 },
			{ id: 'prod-004', name: 'Painel Natural 3mm (100cm)', sku: 'PBN-3MM-100X60', image: '/images/painel-bambu.jpg', salesCount: 22, revenue: 1760.00 },
			{ id: 'prod-005', name: 'Painel Premium 5mm', sku: 'PBP-5MM-200X60', image: '/images/painel-bambu.jpg', salesCount: 18, revenue: 3960.00 },
		].slice(0, limit);
	}

	return apiRequest<TopProduct[]>(`/admin/dashboard/top-products?limit=${limit}`, {}, token);
}

export interface LowStockItem {
	id: string;
	name: string;
	sku: string;
	stock: number;
	minStock: number;
}

export async function getLowStockItems(token: string): Promise<LowStockItem[]> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 200));

		return [
			{ id: 'var-007', name: 'Painel Premium 5mm 200x60cm', sku: 'PBP-5MM-200X60', stock: 5, minStock: 10 },
			{ id: 'var-005', name: 'Painel Premium 3mm 200x60cm', sku: 'PBP-3MM-200X60', stock: 8, minStock: 10 },
		];
	}

	return apiRequest<LowStockItem[]>('/admin/dashboard/low-stock', {}, token);
}

// ============================================
// Admin Orders Management
// ============================================

export interface AdminOrder {
	id: string;
	orderNumber: string;
	customer: {
		id: string;
		name: string;
		email: string;
	};
	items: Array<{
		id: string;
		name: string;
		sku: string;
		variantName: string;
		quantity: number;
		unitPrice: number;
		totalPrice: number;
		image?: string;
	}>;
	subtotal: number;
	shipping: number;
	discount: number;
	total: number;
	status: string;
	paymentMethod: string;
	paymentDetails?: string;
	shippingAddress: {
		name: string;
		street: string;
		number: string;
		complement?: string;
		neighborhood: string;
		city: string;
		state: string;
		zipCode: string;
	};
	trackingCode?: string;
	trackingUrl?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export async function getAdminOrders(
	token: string,
	params?: { status?: string; search?: string; page?: number; limit?: number }
): Promise<{ orders: AdminOrder[]; total: number; page: number; totalPages: number }> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));

		const allOrders: AdminOrder[] = [
			{
				id: 'order-010',
				orderNumber: 'MB-2024-0010',
				customer: { id: 'cust-003', name: 'Ana Costa', email: 'ana@email.com' },
				items: [
					{ id: 'item-1', name: 'Painel de Bambu Natural', sku: 'PBN-3MM-200X60', variantName: '3mm - 200x60cm', quantity: 3, unitPrice: 137.00, totalPrice: 411.00, image: '/images/painel-bambu.jpg' },
				],
				subtotal: 411.00,
				shipping: 84.00,
				discount: 0,
				total: 495.00,
				status: 'pending',
				paymentMethod: 'pix',
				shippingAddress: { name: 'Ana Costa', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01234-567' },
				createdAt: '2024-12-07T14:30:00Z',
				updatedAt: '2024-12-07T14:30:00Z',
			},
			{
				id: 'order-009',
				orderNumber: 'MB-2024-0009',
				customer: { id: 'cust-004', name: 'Carlos Lima', email: 'carlos@email.com' },
				items: [
					{ id: 'item-2', name: 'Painel de Bambu Natural', sku: 'PBN-3MM-200X60', variantName: '3mm - 200x60cm', quantity: 2, unitPrice: 137.00, totalPrice: 274.00, image: '/images/painel-bambu.jpg' },
				],
				subtotal: 274.00,
				shipping: 0,
				discount: 0,
				total: 274.00,
				status: 'processing',
				paymentMethod: 'credit_card',
				paymentDetails: '**** 4242',
				shippingAddress: { name: 'Carlos Lima', street: 'Av. Brasil', number: '456', complement: 'Apto 12', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP', zipCode: '04567-890' },
				createdAt: '2024-12-06T11:20:00Z',
				updatedAt: '2024-12-06T12:00:00Z',
			},
			{
				id: 'order-008',
				orderNumber: 'MB-2024-0008',
				customer: { id: 'cust-005', name: 'Maria Santos', email: 'maria@email.com' },
				items: [
					{ id: 'item-3', name: 'Painel de Bambu Premium', sku: 'PBP-5MM-200X60', variantName: '5mm - 200x60cm', quantity: 3, unitPrice: 220.00, totalPrice: 660.00, image: '/images/painel-bambu.jpg' },
				],
				subtotal: 660.00,
				shipping: 25.00,
				discount: 0,
				total: 685.00,
				status: 'shipped',
				paymentMethod: 'credit_card',
				paymentDetails: '**** 1234',
				trackingCode: 'BR123456789CD',
				trackingUrl: 'https://rastreamento.correios.com.br/?objetos=BR123456789CD',
				shippingAddress: { name: 'Maria Santos', street: 'Rua do Comércio', number: '789', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ', zipCode: '20000-123' },
				createdAt: '2024-12-05T09:15:00Z',
				updatedAt: '2024-12-06T08:00:00Z',
			},
			{
				id: 'order-007',
				orderNumber: 'MB-2024-0007',
				customer: { id: 'cust-006', name: 'João Oliveira', email: 'joao@email.com' },
				items: [
					{ id: 'item-4', name: 'Painel de Bambu Natural', sku: 'PBN-5MM-200X60', variantName: '5mm - 200x60cm', quantity: 2, unitPrice: 165.00, totalPrice: 330.00, image: '/images/painel-bambu.jpg' },
				],
				subtotal: 330.00,
				shipping: 0,
				discount: 0,
				total: 330.00,
				status: 'delivered',
				paymentMethod: 'pix',
				trackingCode: 'BR987654321CD',
				shippingAddress: { name: 'João Oliveira', street: 'Rua dos Bambus', number: '100', neighborhood: 'Vila Verde', city: 'Curitiba', state: 'PR', zipCode: '80000-456' },
				createdAt: '2024-12-04T16:45:00Z',
				updatedAt: '2024-12-07T10:00:00Z',
			},
		];

		let filtered = allOrders;

		if (params?.status && params.status !== 'all') {
			filtered = filtered.filter(o => o.status === params.status);
		}

		if (params?.search) {
			const search = params.search.toLowerCase();
			filtered = filtered.filter(o =>
				o.orderNumber.toLowerCase().includes(search) ||
				o.customer.name.toLowerCase().includes(search) ||
				o.customer.email.toLowerCase().includes(search)
			);
		}

		const page = params?.page || 1;
		const limit = params?.limit || 10;
		const total = filtered.length;
		const totalPages = Math.ceil(total / limit);
		const start = (page - 1) * limit;
		const orders = filtered.slice(start, start + limit);

		return { orders, total, page, totalPages };
	}

	const queryParams = new URLSearchParams();
	if (params?.status) queryParams.set('status', params.status);
	if (params?.search) queryParams.set('search', params.search);
	if (params?.page) queryParams.set('page', params.page.toString());
	if (params?.limit) queryParams.set('limit', params.limit.toString());

	return apiRequest(`/admin/orders?${queryParams}`, {}, token);
}

export async function getAdminOrder(token: string, orderId: string): Promise<AdminOrder> {
	if (MOCK_MODE) {
		const { orders } = await getAdminOrders(token);
		const order = orders.find(o => o.id === orderId);
		if (!order) throw new Error('Pedido não encontrado');
		return order;
	}

	return apiRequest<AdminOrder>(`/admin/orders/${orderId}`, {}, token);
}

export async function updateOrderStatus(
	token: string,
	orderId: string,
	status: string,
	note?: string
): Promise<AdminOrder> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));
		const { orders } = await getAdminOrders(token);
		const order = orders.find(o => o.id === orderId);
		if (!order) throw new Error('Pedido não encontrado');
		return { ...order, status, updatedAt: new Date().toISOString() };
	}

	return apiRequest<AdminOrder>(`/admin/orders/${orderId}/status`, {
		method: 'PUT',
		body: JSON.stringify({ status, note }),
	}, token);
}

export async function addTrackingCode(
	token: string,
	orderId: string,
	trackingCode: string,
	trackingUrl?: string
): Promise<AdminOrder> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));
		const { orders } = await getAdminOrders(token);
		const order = orders.find(o => o.id === orderId);
		if (!order) throw new Error('Pedido não encontrado');
		return {
			...order,
			trackingCode,
			trackingUrl: trackingUrl || `https://rastreamento.correios.com.br/?objetos=${trackingCode}`,
			status: 'shipped',
			updatedAt: new Date().toISOString(),
		};
	}

	return apiRequest<AdminOrder>(`/admin/orders/${orderId}/tracking`, {
		method: 'POST',
		body: JSON.stringify({ trackingCode, trackingUrl }),
	}, token);
}

// ============================================
// Admin Customers Management
// ============================================

export interface AdminCustomer {
	id: string;
	name: string;
	email: string;
	phone?: string;
	ordersCount: number;
	totalSpent: number;
	lastOrderDate?: string;
	createdAt: string;
}

export async function getAdminCustomers(
	token: string,
	params?: { search?: string; page?: number; limit?: number }
): Promise<{ customers: AdminCustomer[]; total: number; page: number; totalPages: number }> {
	if (MOCK_MODE) {
		await new Promise(resolve => setTimeout(resolve, 300));

		const allCustomers: AdminCustomer[] = [
			{ id: 'cust-001', name: 'Teste Usuario', email: 'teste@meubambu.com.br', phone: '(11) 99999-9999', ordersCount: 3, totalSpent: 1250.00, lastOrderDate: '2024-12-01T10:00:00Z', createdAt: '2024-10-15T08:00:00Z' },
			{ id: 'cust-003', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 98888-8888', ordersCount: 1, totalSpent: 495.00, lastOrderDate: '2024-12-07T14:30:00Z', createdAt: '2024-11-20T12:00:00Z' },
			{ id: 'cust-004', name: 'Carlos Lima', email: 'carlos@email.com', phone: '(11) 97777-7777', ordersCount: 2, totalSpent: 548.00, lastOrderDate: '2024-12-06T11:20:00Z', createdAt: '2024-11-18T09:00:00Z' },
			{ id: 'cust-005', name: 'Maria Santos', email: 'maria@email.com', phone: '(21) 96666-6666', ordersCount: 4, totalSpent: 2740.00, lastOrderDate: '2024-12-05T09:15:00Z', createdAt: '2024-09-10T14:00:00Z' },
			{ id: 'cust-006', name: 'João Oliveira', email: 'joao@email.com', phone: '(41) 95555-5555', ordersCount: 1, totalSpent: 330.00, lastOrderDate: '2024-12-04T16:45:00Z', createdAt: '2024-12-01T11:00:00Z' },
		];

		let filtered = allCustomers;

		if (params?.search) {
			const search = params.search.toLowerCase();
			filtered = filtered.filter(c =>
				c.name.toLowerCase().includes(search) ||
				c.email.toLowerCase().includes(search)
			);
		}

		const page = params?.page || 1;
		const limit = params?.limit || 10;
		const total = filtered.length;
		const totalPages = Math.ceil(total / limit);
		const start = (page - 1) * limit;
		const customers = filtered.slice(start, start + limit);

		return { customers, total, page, totalPages };
	}

	const queryParams = new URLSearchParams();
	if (params?.search) queryParams.set('search', params.search);
	if (params?.page) queryParams.set('page', params.page.toString());
	if (params?.limit) queryParams.set('limit', params.limit.toString());

	return apiRequest(`/admin/customers?${queryParams}`, {}, token);
}
