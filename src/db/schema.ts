/**
 * Database Schema using Drizzle ORM
 * Tables for authentication and customer data
 * Products/Orders come from external shopping API
 */

import { pgTable, text, timestamp, uuid, boolean, varchar } from 'drizzle-orm/pg-core';

// ============================================
// Customers (for login/profile)
// ============================================
export const customers = pgTable('customers', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 20 }),
	cpf: varchar('cpf', { length: 14 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// Customer Addresses
// ============================================
export const customerAddresses = pgTable('customer_addresses', {
	id: uuid('id').primaryKey().defaultRandom(),
	customerId: uuid('customer_id').references(() => customers.id).notNull(),
	label: varchar('label', { length: 50 }), // "Casa", "Trabalho"
	name: varchar('name', { length: 255 }).notNull(),
	street: varchar('street', { length: 255 }).notNull(),
	number: varchar('number', { length: 20 }).notNull(),
	complement: varchar('complement', { length: 100 }),
	neighborhood: varchar('neighborhood', { length: 100 }).notNull(),
	city: varchar('city', { length: 100 }).notNull(),
	state: varchar('state', { length: 2 }).notNull(),
	zipCode: varchar('zip_code', { length: 9 }).notNull(),
	isDefault: boolean('is_default').default(false),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// Admin Users
// ============================================
export const adminUsers = pgTable('admin_users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	role: varchar('role', { length: 20 }).default('admin').notNull(), // admin, super_admin
	active: boolean('active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	lastLogin: timestamp('last_login'),
});

// ============================================
// Sessions (JWT refresh tokens)
// ============================================
export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull(), // Can be customer or admin
	userType: varchar('user_type', { length: 20 }).notNull(), // 'customer' or 'admin'
	refreshToken: text('refresh_token').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// Password Reset Tokens
// ============================================
export const passwordResets = pgTable('password_resets', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull(),
	token: varchar('token', { length: 64 }).notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	usedAt: timestamp('used_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// Abandoned Carts / Leads
// Captures potential customers who start checkout but don't complete
// ============================================
export const abandonedCarts = pgTable('abandoned_carts', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 20 }),
	cartData: text('cart_data'), // JSON string of cart items
	cartTotal: varchar('cart_total', { length: 20 }),
	status: varchar('status', { length: 20 }).default('abandoned').notNull(), // abandoned, recovered, converted
	convertedToCustomerId: uuid('converted_to_customer_id').references(() => customers.id),
	remindersSent: varchar('reminders_sent', { length: 10 }).default('0'), // Count of reminder emails sent
	lastReminderAt: timestamp('last_reminder_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for use in application
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type NewCustomerAddress = typeof customerAddresses.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type PasswordReset = typeof passwordResets.$inferSelect;
export type AbandonedCart = typeof abandonedCarts.$inferSelect;
export type NewAbandonedCart = typeof abandonedCarts.$inferInsert;
