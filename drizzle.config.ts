import { config } from 'dotenv';

import type { Config } from 'drizzle-kit'

config()
console.log("config ", process.env.NEXT_PUBLIC_SUPABASE_CONNECTION_URL)
export default {
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./supabase/migrations",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_SUPABASE_CONNECTION_URL!
  }


} satisfies Config