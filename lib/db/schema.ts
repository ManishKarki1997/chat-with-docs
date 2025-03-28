import { pgTable, text, timestamp, serial, integer, pgEnum, varchar } from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system_enum", ['user', 'system'])

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: text("user_id").notNull(),
  fileKey: text("file_key").notNull(),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chats.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id").notNull(),
  role: userSystemEnum("role").notNull(),
})

export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }).notNull().unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
})


export type ChatSchema = typeof chats.$inferSelect;