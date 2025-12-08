/**
 * Database Connection
 * Uses Neon serverless Postgres with Drizzle ORM
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Get DATABASE_URL - check both import.meta.env and process.env
const DATABASE_URL = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('DATABASE_URL is not set. Database features will not work.');
}

// Create the connection (only if DATABASE_URL is available)
const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

// Create drizzle instance with schema
export const db = sql ? drizzle(sql, { schema }) : null;

// Helper to check if DB is available
export function isDatabaseAvailable(): boolean {
	return db !== null;
}

// Re-export schema for convenience
export * from './schema';
