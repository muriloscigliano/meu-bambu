/**
 * Authentication Service
 * Handles customer and admin authentication with Neon DB
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, isDatabaseAvailable, customers, adminUsers, sessions, passwordResets } from '../db';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail, sendPasswordResetEmail } from './email';
import crypto from 'crypto';

// Use process.env for serverless compatibility
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 12;

// Helper to ensure DB is available
function requireDatabase() {
	if (!db || !isDatabaseAvailable()) {
		throw new Error('Serviço temporariamente indisponível. Tente novamente mais tarde.');
	}
	return db;
}

// ============================================
// Types
// ============================================

export interface AuthUser {
	id: string;
	email: string;
	name: string;
	type: 'customer' | 'admin';
	role?: string;
}

export interface AuthResponse {
	token: string;
	user: AuthUser;
}

// ============================================
// Customer Authentication
// ============================================

export async function registerCustomer(data: {
	name: string;
	email: string;
	password: string;
	phone?: string;
}): Promise<AuthResponse> {
	const database = requireDatabase();

	// Check if email already exists
	const existing = await database.query.customers.findFirst({
		where: eq(customers.email, data.email.toLowerCase()),
	});

	if (existing) {
		throw new Error('Este e-mail já está cadastrado');
	}

	// Hash password
	const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

	// Create customer
	const [customer] = await database
		.insert(customers)
		.values({
			name: data.name,
			email: data.email.toLowerCase(),
			passwordHash,
			phone: data.phone,
		})
		.returning();

	// Generate JWT
	const token = generateToken({
		id: customer.id,
		email: customer.email,
		name: customer.name,
		type: 'customer',
	});

	// Send welcome email (don't await - fire and forget)
	sendWelcomeEmail({
		customerName: customer.name,
		customerEmail: customer.email,
	}).catch(console.error);

	return {
		token,
		user: {
			id: customer.id,
			email: customer.email,
			name: customer.name,
			type: 'customer',
		},
	};
}

export async function loginCustomer(data: {
	email: string;
	password: string;
}): Promise<AuthResponse> {
	const database = requireDatabase();

	// Find customer
	const customer = await database.query.customers.findFirst({
		where: eq(customers.email, data.email.toLowerCase()),
	});

	if (!customer) {
		throw new Error('E-mail ou senha inválidos');
	}

	// Verify password
	const validPassword = await bcrypt.compare(data.password, customer.passwordHash);
	if (!validPassword) {
		throw new Error('E-mail ou senha inválidos');
	}

	// Generate JWT
	const token = generateToken({
		id: customer.id,
		email: customer.email,
		name: customer.name,
		type: 'customer',
	});

	return {
		token,
		user: {
			id: customer.id,
			email: customer.email,
			name: customer.name,
			type: 'customer',
		},
	};
}

// ============================================
// Admin Authentication
// ============================================

export async function loginAdmin(data: {
	email: string;
	password: string;
}): Promise<AuthResponse> {
	const database = requireDatabase();

	// Find admin
	const admin = await database.query.adminUsers.findFirst({
		where: eq(adminUsers.email, data.email.toLowerCase()),
	});

	if (!admin || !admin.active) {
		throw new Error('E-mail ou senha inválidos');
	}

	// Verify password
	const validPassword = await bcrypt.compare(data.password, admin.passwordHash);
	if (!validPassword) {
		throw new Error('E-mail ou senha inválidos');
	}

	// Update last login
	await database
		.update(adminUsers)
		.set({ lastLogin: new Date() })
		.where(eq(adminUsers.id, admin.id));

	// Generate JWT
	const token = generateToken({
		id: admin.id,
		email: admin.email,
		name: admin.name,
		type: 'admin',
		role: admin.role,
	});

	return {
		token,
		user: {
			id: admin.id,
			email: admin.email,
			name: admin.name,
			type: 'admin',
			role: admin.role,
		},
	};
}

// ============================================
// Password Reset
// ============================================

export async function requestPasswordReset(email: string): Promise<void> {
	const database = requireDatabase();

	// Find customer
	const customer = await database.query.customers.findFirst({
		where: eq(customers.email, email.toLowerCase()),
	});

	if (!customer) {
		// Don't reveal if email exists - just return silently
		return;
	}

	// Generate reset token
	const token = crypto.randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	// Save token
	await database.insert(passwordResets).values({
		email: email.toLowerCase(),
		token,
		expiresAt,
	});

	// Send reset email
	const resetUrl = `https://meubambu.com.br/redefinir-senha?token=${token}`;
	await sendPasswordResetEmail({
		customerName: customer.name,
		customerEmail: customer.email,
		resetToken: token,
		resetUrl,
	});
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
	const database = requireDatabase();

	// Find valid token
	const resetRecord = await database.query.passwordResets.findFirst({
		where: eq(passwordResets.token, token),
	});

	if (!resetRecord) {
		throw new Error('Token inválido ou expirado');
	}

	if (resetRecord.usedAt) {
		throw new Error('Este link já foi utilizado');
	}

	if (new Date() > resetRecord.expiresAt) {
		throw new Error('Token expirado. Solicite um novo link.');
	}

	// Find customer
	const customer = await database.query.customers.findFirst({
		where: eq(customers.email, resetRecord.email),
	});

	if (!customer) {
		throw new Error('Usuário não encontrado');
	}

	// Update password
	const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
	await database
		.update(customers)
		.set({ passwordHash, updatedAt: new Date() })
		.where(eq(customers.id, customer.id));

	// Mark token as used
	await database
		.update(passwordResets)
		.set({ usedAt: new Date() })
		.where(eq(passwordResets.id, resetRecord.id));
}

// ============================================
// Token Utilities
// ============================================

function generateToken(user: AuthUser): string {
	return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthUser | null {
	try {
		return jwt.verify(token, JWT_SECRET) as AuthUser;
	} catch {
		return null;
	}
}

export function getTokenFromHeader(authHeader: string | null): string | null {
	if (!authHeader?.startsWith('Bearer ')) {
		return null;
	}
	return authHeader.slice(7);
}

// ============================================
// Profile Management
// ============================================

export async function getCustomerProfile(customerId: string) {
	const database = requireDatabase();

	const customer = await database.query.customers.findFirst({
		where: eq(customers.id, customerId),
	});

	if (!customer) {
		throw new Error('Usuário não encontrado');
	}

	const { passwordHash, ...profile } = customer;
	return profile;
}

export async function updateCustomerProfile(
	customerId: string,
	data: { name?: string; phone?: string; cpf?: string }
) {
	const database = requireDatabase();

	const [updated] = await database
		.update(customers)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(customers.id, customerId))
		.returning();

	if (!updated) {
		throw new Error('Usuário não encontrado');
	}

	const { passwordHash, ...profile } = updated;
	return profile;
}

// ============================================
// Admin User Management (for initial setup)
// ============================================

export async function createAdminUser(data: {
	name: string;
	email: string;
	password: string;
	role?: 'admin' | 'super_admin';
}): Promise<void> {
	const database = requireDatabase();
	const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

	await database.insert(adminUsers).values({
		name: data.name,
		email: data.email.toLowerCase(),
		passwordHash,
		role: data.role || 'admin',
	});
}
