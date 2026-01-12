import { pgTable, varchar, integer, text, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const workoutCompletions = pgTable("workout_completions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  week: integer("week").notNull(),
  day: varchar("day", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("incomplete"),
  distance: varchar("distance", { length: 50 }),
  duration: varchar("duration", { length: 50 }),
  pace: varchar("pace", { length: 50 }),
  elevation: varchar("elevation", { length: 50 }),
  heartRate: varchar("heart_rate", { length: 50 }),
  effort: integer("effort"),
  weather: varchar("weather", { length: 100 }),
  notes: text("notes"),
  date: varchar("date", { length: 20 }),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const stravaTokens = pgTable("strava_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: integer("expires_at").notNull(),
  athleteId: integer("athlete_id").notNull(),
  athleteName: varchar("athlete_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dismissedInsights = pgTable("dismissed_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  insightId: varchar("insight_id", { length: 100 }).notNull(),
  dismissedAt: timestamp("dismissed_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
