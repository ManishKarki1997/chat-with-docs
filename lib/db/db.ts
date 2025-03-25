import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config();

const client = postgres(process.env.NEXT_PUBLIC_SUPABASE_CONNECTION_URL!);
export const db = drizzle({ client });
