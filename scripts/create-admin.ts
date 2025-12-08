/**
 * Script to create the initial admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import * as schema from '../src/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('DATABASE_URL not set');
	process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function createAdmin() {
	const email = 'dev@murilo.design';
	const password = 'meubambu2024';
	const name = 'Murilo';

	console.log('Creating admin user...');
	console.log(`Email: ${email}`);

	const passwordHash = await bcrypt.hash(password, 12);

	try {
		await db.insert(schema.adminUsers).values({
			email,
			passwordHash,
			name,
			role: 'super_admin',
		});

		console.log('✓ Admin user created successfully!');
		console.log('\nLogin credentials:');
		console.log(`  Email: ${email}`);
		console.log(`  Password: ${password}`);
	} catch (error: any) {
		if (error.message?.includes('unique constraint')) {
			console.log('Admin user already exists');
		} else {
			console.error('Error creating admin:', error);
		}
	}
}

createAdmin();
