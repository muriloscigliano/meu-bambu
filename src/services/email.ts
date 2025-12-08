/**
 * Email Service using Resend
 * Handles all transactional emails for the e-commerce platform
 */

import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM_EMAIL = 'Meu Bambu <noreply@meubambu.com.br>';

interface OrderEmailData {
	customerName: string;
	customerEmail: string;
	orderNumber: string;
	items: Array<{
		name: string;
		variant: string;
		quantity: number;
		price: number;
	}>;
	subtotal: number;
	shipping: number;
	total: number;
	shippingAddress: {
		street: string;
		number: string;
		complement?: string;
		neighborhood: string;
		city: string;
		state: string;
		zipCode: string;
	};
}

interface ShippingEmailData {
	customerName: string;
	customerEmail: string;
	orderNumber: string;
	trackingCode: string;
	trackingUrl: string;
	carrier?: string;
}

interface WelcomeEmailData {
	customerName: string;
	customerEmail: string;
}

interface PasswordResetEmailData {
	customerName: string;
	customerEmail: string;
	resetToken: string;
	resetUrl: string;
}

interface EmailVerificationData {
	customerName: string;
	customerEmail: string;
	verificationUrl: string;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(data: OrderEmailData) {
	const itemsHtml = data.items
		.map(
			(item) => `
			<tr>
				<td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">
					<strong>${item.name}</strong><br>
					<span style="color: #666; font-size: 14px;">${item.variant}</span>
				</td>
				<td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
				<td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">R$ ${item.price.toFixed(2)}</td>
			</tr>
		`
		)
		.join('');

	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #62533e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
					<h1 style="color: #fff; margin: 0; font-size: 24px;">Meu Bambu</h1>
				</div>

				<div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
					<h2 style="color: #333; margin-top: 0;">Pedido Confirmado!</h2>
					<p style="color: #666;">Olá ${data.customerName},</p>
					<p style="color: #666;">Recebemos seu pedido <strong>#${data.orderNumber}</strong> e ele já está sendo processado.</p>

					<div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<h3 style="margin-top: 0; color: #333;">Itens do Pedido</h3>
						<table style="width: 100%; border-collapse: collapse;">
							<thead>
								<tr style="background-color: #62533e; color: #fff;">
									<th style="padding: 12px; text-align: left;">Produto</th>
									<th style="padding: 12px; text-align: center;">Qtd</th>
									<th style="padding: 12px; text-align: right;">Preço</th>
								</tr>
							</thead>
							<tbody>
								${itemsHtml}
							</tbody>
						</table>

						<div style="margin-top: 20px; text-align: right;">
							<p style="margin: 5px 0; color: #666;">Subtotal: <strong>R$ ${data.subtotal.toFixed(2)}</strong></p>
							<p style="margin: 5px 0; color: #666;">Frete: <strong>R$ ${data.shipping.toFixed(2)}</strong></p>
							<p style="margin: 10px 0; font-size: 18px; color: #333;">Total: <strong>R$ ${data.total.toFixed(2)}</strong></p>
						</div>
					</div>

					<div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<h3 style="margin-top: 0; color: #333;">Endereço de Entrega</h3>
						<p style="color: #666; margin: 0;">
							${data.shippingAddress.street}, ${data.shippingAddress.number}
							${data.shippingAddress.complement ? `, ${data.shippingAddress.complement}` : ''}<br>
							${data.shippingAddress.neighborhood}<br>
							${data.shippingAddress.city} - ${data.shippingAddress.state}<br>
							CEP: ${data.shippingAddress.zipCode}
						</p>
					</div>

					<p style="color: #666;">Você receberá outro e-mail quando seu pedido for enviado, com o código de rastreamento.</p>

					<div style="text-align: center; margin-top: 30px;">
						<a href="https://meubambu.com.br/minha-conta" style="display: inline-block; background-color: #62533e; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">Acompanhar Pedido</a>
					</div>
				</div>

				<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
					<p>Meu Bambu - Painéis de Bambu Premium</p>
					<p>Joanópolis, SP - Brasil</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return resend.emails.send({
		from: FROM_EMAIL,
		to: data.customerEmail,
		subject: `Pedido #${data.orderNumber} confirmado - Meu Bambu`,
		html,
	});
}

/**
 * Send shipping notification with tracking
 */
export async function sendShippingNotification(data: ShippingEmailData) {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #62533e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
					<h1 style="color: #fff; margin: 0; font-size: 24px;">Meu Bambu</h1>
				</div>

				<div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
					<h2 style="color: #333; margin-top: 0;">Seu pedido foi enviado! 📦</h2>
					<p style="color: #666;">Olá ${data.customerName},</p>
					<p style="color: #666;">Boas notícias! Seu pedido <strong>#${data.orderNumber}</strong> acabou de ser enviado e está a caminho.</p>

					<div style="background-color: #f0f9e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
						<h3 style="margin-top: 0; color: #333;">Rastreamento</h3>
						<p style="color: #666; margin: 5px 0;">
							${data.carrier ? `<strong>Transportadora:</strong> ${data.carrier}<br>` : ''}
							<strong>Código:</strong> ${data.trackingCode}
						</p>
					</div>

					<div style="text-align: center; margin-top: 30px;">
						<a href="${data.trackingUrl}" style="display: inline-block; background-color: #62533e; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">Rastrear Pedido</a>
						<a href="https://meubambu.com.br/minha-conta/pedidos" style="display: inline-block; background-color: #fff; color: #62533e; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; border: 2px solid #62533e;">Ver Detalhes</a>
					</div>

					<p style="color: #999; font-size: 14px; margin-top: 30px;">O prazo de entrega pode variar de acordo com a região. Você pode acompanhar a entrega pelo código de rastreamento acima.</p>
				</div>

				<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
					<p>Meu Bambu - Painéis de Bambu Premium</p>
					<p>Joanópolis, SP - Brasil</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return resend.emails.send({
		from: FROM_EMAIL,
		to: data.customerEmail,
		subject: `Pedido #${data.orderNumber} enviado - Rastreie sua entrega`,
		html,
	});
}

/**
 * Send welcome email after registration
 */
export async function sendWelcomeEmail(data: WelcomeEmailData) {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #62533e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
					<h1 style="color: #fff; margin: 0; font-size: 24px;">Meu Bambu</h1>
				</div>

				<div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
					<h2 style="color: #333; margin-top: 0;">Bem-vindo ao Meu Bambu! 🎋</h2>
					<p style="color: #666;">Olá ${data.customerName},</p>
					<p style="color: #666;">Obrigado por criar sua conta! Agora você pode:</p>

					<ul style="color: #666; line-height: 1.8;">
						<li>Acompanhar seus pedidos em tempo real</li>
						<li>Salvar endereços de entrega</li>
						<li>Ver histórico de compras</li>
						<li>Receber ofertas exclusivas</li>
					</ul>

					<p style="color: #666;">Nossos painéis de bambu são únicos no Brasil - com núcleo vertical para maior resistência e durabilidade.</p>

					<div style="text-align: center; margin-top: 30px;">
						<a href="https://meubambu.com.br" style="display: inline-block; background-color: #62533e; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">Ver Produtos</a>
					</div>
				</div>

				<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
					<p>Meu Bambu - Painéis de Bambu Premium</p>
					<p>Joanópolis, SP - Brasil</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return resend.emails.send({
		from: FROM_EMAIL,
		to: data.customerEmail,
		subject: `Bem-vindo ao Meu Bambu, ${data.customerName}!`,
		html,
	});
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #62533e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
					<h1 style="color: #fff; margin: 0; font-size: 24px;">Meu Bambu</h1>
				</div>

				<div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
					<h2 style="color: #333; margin-top: 0;">Redefinir Senha</h2>
					<p style="color: #666;">Olá ${data.customerName},</p>
					<p style="color: #666;">Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:</p>

					<div style="text-align: center; margin: 30px 0;">
						<a href="${data.resetUrl}" style="display: inline-block; background-color: #62533e; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">Redefinir Senha</a>
					</div>

					<p style="color: #999; font-size: 14px;">Este link expira em 1 hora. Se você não solicitou a redefinição de senha, ignore este e-mail.</p>

					<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

					<p style="color: #999; font-size: 12px;">Se o botão não funcionar, copie e cole este link no navegador:<br>
					<a href="${data.resetUrl}" style="color: #62533e; word-break: break-all;">${data.resetUrl}</a></p>
				</div>

				<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
					<p>Meu Bambu - Painéis de Bambu Premium</p>
					<p>Joanópolis, SP - Brasil</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return resend.emails.send({
		from: FROM_EMAIL,
		to: data.customerEmail,
		subject: 'Redefinir sua senha - Meu Bambu',
		html,
	});
}

/**
 * Send email verification after registration
 */
export async function sendEmailVerification(data: EmailVerificationData) {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #62533e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
					<h1 style="color: #fff; margin: 0; font-size: 24px;">Meu Bambu</h1>
				</div>

				<div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
					<h2 style="color: #333; margin-top: 0;">Confirme seu e-mail</h2>
					<p style="color: #666;">Olá ${data.customerName},</p>
					<p style="color: #666;">Obrigado por criar sua conta no Meu Bambu! Para começar a usar sua conta, confirme seu e-mail clicando no botão abaixo:</p>

					<div style="text-align: center; margin: 30px 0;">
						<a href="${data.verificationUrl}" style="display: inline-block; background-color: #62533e; color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Confirmar E-mail</a>
					</div>

					<p style="color: #999; font-size: 14px;">Este link expira em 24 horas.</p>

					<hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

					<p style="color: #999; font-size: 12px;">Se o botão não funcionar, copie e cole este link no navegador:<br>
					<a href="${data.verificationUrl}" style="color: #62533e; word-break: break-all;">${data.verificationUrl}</a></p>

					<p style="color: #999; font-size: 12px; margin-top: 20px;">Se você não criou uma conta no Meu Bambu, ignore este e-mail.</p>
				</div>

				<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
					<p>Meu Bambu - Painéis de Bambu Premium</p>
					<p>Joanópolis, SP - Brasil</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return resend.emails.send({
		from: FROM_EMAIL,
		to: data.customerEmail,
		subject: 'Confirme seu e-mail - Meu Bambu',
		html,
	});
}

/**
 * Send order delivered confirmation
 */
export async function sendOrderDelivered(data: { customerName: string; customerEmail: string; orderNumber: string }) {
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #62533e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
					<h1 style="color: #fff; margin: 0; font-size: 24px;">Meu Bambu</h1>
				</div>

				<div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
					<div style="text-align: center; margin-bottom: 20px;">
						<span style="font-size: 48px;">✅</span>
					</div>
					<h2 style="color: #333; margin-top: 0; text-align: center;">Pedido Entregue!</h2>
					<p style="color: #666;">Olá ${data.customerName},</p>
					<p style="color: #666;">Seu pedido <strong>#${data.orderNumber}</strong> foi entregue com sucesso!</p>

					<p style="color: #666;">Esperamos que você aproveite seus painéis de bambu. Se tiver alguma dúvida sobre instalação ou uso, estamos à disposição.</p>

					<div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
						<p style="color: #666; margin: 0 0 10px 0;">Gostou dos produtos?</p>
						<p style="color: #666; margin: 0;">Compartilhe sua experiência nas redes sociais com <strong style="color: #62533e;">#MeuBambu</strong></p>
					</div>

					<div style="text-align: center; margin-top: 30px;">
						<a href="https://meubambu.com.br" style="display: inline-block; background-color: #62533e; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">Ver Mais Produtos</a>
					</div>
				</div>

				<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">
					<p>Meu Bambu - Painéis de Bambu Premium</p>
					<p>Joanópolis, SP - Brasil</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return resend.emails.send({
		from: FROM_EMAIL,
		to: data.customerEmail,
		subject: `Pedido #${data.orderNumber} entregue! - Meu Bambu`,
		html,
	});
}
