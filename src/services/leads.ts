/**
 * Lead Capture Service
 * Handles abandoned cart leads for remarketing
 */

import { db, isDatabaseAvailable, abandonedCarts, customers } from '../db';
import { eq, and } from 'drizzle-orm';
import { sendAbandonedCartEmail } from './email';

// Helper to ensure DB is available
function requireDatabase() {
	if (!db || !isDatabaseAvailable()) {
		throw new Error('Serviço temporariamente indisponível.');
	}
	return db;
}

export interface CartItem {
	id: string;
	name: string;
	variant: string;
	price: number;
	quantity: number;
	image?: string;
}

export interface LeadData {
	email: string;
	name: string;
	phone?: string;
	cartItems: CartItem[];
	cartTotal: number;
}

/**
 * Capture a lead when user starts checkout
 * Updates existing lead if email exists, or creates new one
 */
export async function captureCheckoutLead(data: LeadData): Promise<{ id: string; isNewLead: boolean }> {
	const database = requireDatabase();
	const email = data.email.toLowerCase();

	// Check if this email already exists as a customer
	const existingCustomer = await database.query.customers.findFirst({
		where: eq(customers.email, email),
	});

	if (existingCustomer) {
		// Already a customer, no need to capture as lead
		return { id: existingCustomer.id, isNewLead: false };
	}

	// Check if lead already exists
	const existingLead = await database.query.abandonedCarts.findFirst({
		where: and(
			eq(abandonedCarts.email, email),
			eq(abandonedCarts.status, 'abandoned')
		),
	});

	const cartData = JSON.stringify(data.cartItems);
	const cartTotal = data.cartTotal.toFixed(2);

	if (existingLead) {
		// Update existing lead with new cart data
		await database
			.update(abandonedCarts)
			.set({
				name: data.name,
				phone: data.phone,
				cartData,
				cartTotal,
				updatedAt: new Date(),
			})
			.where(eq(abandonedCarts.id, existingLead.id));

		return { id: existingLead.id, isNewLead: false };
	}

	// Create new lead
	const [newLead] = await database
		.insert(abandonedCarts)
		.values({
			email,
			name: data.name,
			phone: data.phone,
			cartData,
			cartTotal,
			status: 'abandoned',
		})
		.returning();

	return { id: newLead.id, isNewLead: true };
}

/**
 * Mark a lead as converted when they create an account or complete purchase
 */
export async function markLeadAsConverted(email: string, customerId?: string): Promise<void> {
	const database = requireDatabase();

	await database
		.update(abandonedCarts)
		.set({
			status: 'converted',
			convertedToCustomerId: customerId,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(abandonedCarts.email, email.toLowerCase()),
				eq(abandonedCarts.status, 'abandoned')
			)
		);
}

/**
 * Mark a lead as recovered (came back but hasn't converted yet)
 */
export async function markLeadAsRecovered(email: string): Promise<void> {
	const database = requireDatabase();

	await database
		.update(abandonedCarts)
		.set({
			status: 'recovered',
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(abandonedCarts.email, email.toLowerCase()),
				eq(abandonedCarts.status, 'abandoned')
			)
		);
}

/**
 * Get abandoned leads that need reminder emails
 * Returns leads that:
 * - Status is 'abandoned'
 * - Created more than 1 hour ago
 * - Have received less than 3 reminders
 * - Last reminder was more than 24 hours ago (if any sent)
 */
export async function getLeadsForReminder(): Promise<typeof abandonedCarts.$inferSelect[]> {
	const database = requireDatabase();

	const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

	// Get all abandoned leads
	const leads = await database.query.abandonedCarts.findMany({
		where: eq(abandonedCarts.status, 'abandoned'),
	});

	// Filter in JS (Drizzle doesn't support complex date comparisons easily)
	return leads.filter(lead => {
		const reminderCount = parseInt(lead.remindersSent || '0', 10);
		const createdAt = new Date(lead.createdAt);
		const lastReminder = lead.lastReminderAt ? new Date(lead.lastReminderAt) : null;

		// Must be created more than 1 hour ago
		if (createdAt > oneHourAgo) return false;

		// Must have sent less than 3 reminders
		if (reminderCount >= 3) return false;

		// If reminders were sent, last one must be more than 24 hours ago
		if (lastReminder && lastReminder > oneDayAgo) return false;

		return true;
	});
}

/**
 * Send reminder email to a lead and update reminder count
 */
export async function sendLeadReminder(leadId: string): Promise<boolean> {
	const database = requireDatabase();

	const lead = await database.query.abandonedCarts.findFirst({
		where: eq(abandonedCarts.id, leadId),
	});

	if (!lead || lead.status !== 'abandoned') {
		return false;
	}

	const reminderCount = parseInt(lead.remindersSent || '0', 10);
	const cartItems: CartItem[] = lead.cartData ? JSON.parse(lead.cartData) : [];

	try {
		// Send email
		await sendAbandonedCartEmail({
			customerName: lead.name,
			customerEmail: lead.email,
			cartItems,
			cartTotal: parseFloat(lead.cartTotal || '0'),
			reminderNumber: reminderCount + 1,
		});

		// Update reminder count
		await database
			.update(abandonedCarts)
			.set({
				remindersSent: String(reminderCount + 1),
				lastReminderAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(abandonedCarts.id, leadId));

		return true;
	} catch (error) {
		console.error('Failed to send reminder email:', error);
		return false;
	}
}

/**
 * Get lead statistics for admin dashboard
 */
export async function getLeadStats(): Promise<{
	total: number;
	abandoned: number;
	recovered: number;
	converted: number;
	conversionRate: number;
}> {
	const database = requireDatabase();

	const allLeads = await database.query.abandonedCarts.findMany();

	const total = allLeads.length;
	const abandoned = allLeads.filter(l => l.status === 'abandoned').length;
	const recovered = allLeads.filter(l => l.status === 'recovered').length;
	const converted = allLeads.filter(l => l.status === 'converted').length;
	const conversionRate = total > 0 ? (converted / total) * 100 : 0;

	return {
		total,
		abandoned,
		recovered,
		converted,
		conversionRate: Math.round(conversionRate * 10) / 10,
	};
}
