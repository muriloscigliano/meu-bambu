/**
 * API Endpoint: Capture Lead
 * POST /api/leads/capture
 *
 * Called when user starts checkout to capture their contact info
 */

import type { APIRoute } from 'astro';
import { captureCheckoutLead } from '../../../services/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();

		const { email, name, phone, cartItems, cartTotal } = body;

		// Validate required fields
		if (!email || !name) {
			return new Response(
				JSON.stringify({ error: 'Email e nome são obrigatórios' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return new Response(
				JSON.stringify({ error: 'Email inválido' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Capture lead
		const result = await captureCheckoutLead({
			email,
			name,
			phone,
			cartItems: cartItems || [],
			cartTotal: cartTotal || 0,
		});

		return new Response(
			JSON.stringify({
				success: true,
				leadId: result.id,
				isNewLead: result.isNewLead,
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error: any) {
		console.error('Lead capture error:', error);

		return new Response(
			JSON.stringify({ error: error.message || 'Erro ao salvar dados' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
