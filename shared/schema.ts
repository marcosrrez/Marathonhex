import { z } from "zod";
import { pgTable, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Database Tables
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
  completedAt: varchar("completed_at", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const stravaTokensTable = pgTable("strava_tokens", {
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

export const workoutCategories = ['speed', 'recovery', 'aerobic', 'tempo', 'long', 'rest', 'race'] as const;
export type WorkoutCategory = typeof workoutCategories[number];

export const workoutTypes = ['intervals', 'fartlek', 'hills', 'tempo', 'recovery', 'aerobic', 'jog', 'long', 'rest', 'race'] as const;
export type WorkoutType = typeof workoutTypes[number];

export const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export type DayName = typeof dayNames[number];

export const completionStatuses = ['incomplete', 'partial', 'complete'] as const;
export type CompletionStatus = typeof completionStatuses[number];

export interface Workout {
  type: WorkoutType;
  title: string;
  details: string;
  category: WorkoutCategory;
}

export interface WeekPlan {
  monday: Workout;
  tuesday: Workout;
  wednesday: Workout;
  thursday: Workout;
  friday: Workout;
  saturday: Workout;
  sunday: Workout;
}

export type TrainingPlan = Record<number, WeekPlan>;

export const workoutCompletionSchema = z.object({
  id: z.string().optional(),
  week: z.number().min(1).max(16),
  day: z.enum(dayNames),
  status: z.enum(completionStatuses),
  distance: z.string().optional(),
  duration: z.string().optional(),
  pace: z.string().optional(),
  elevation: z.string().optional(),
  heartRate: z.string().optional(),
  effort: z.number().min(1).max(10).optional(),
  weather: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
  completedAt: z.string().optional(),
});

export type WorkoutCompletion = z.infer<typeof workoutCompletionSchema>;

export const insertWorkoutCompletionSchema = workoutCompletionSchema.omit({ id: true });
export type InsertWorkoutCompletion = z.infer<typeof insertWorkoutCompletionSchema>;

// User schema (kept for compatibility)
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: string };

// Strava integration
export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athleteId: number;
  athleteName: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  startDate: string;
  averageSpeed: number;
  maxSpeed: number;
  averageHeartrate?: number;
  maxHeartrate?: number;
  totalElevationGain: number;
}

// Analytics Types
export const insightSeverities = ['info', 'success', 'warning', 'critical'] as const;
export type InsightSeverity = typeof insightSeverities[number];

export const insightCategories = ['consistency', 'performance', 'recovery', 'milestone', 'trend', 'recommendation'] as const;
export type InsightCategory = typeof insightCategories[number];

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  message: string;
  metric?: string;
  value?: number;
  change?: number;
  week?: number;
  createdAt: string;
  dismissed?: boolean;
}

export interface WeeklySummary {
  week: number;
  plannedWorkouts: number;
  completedWorkouts: number;
  adherenceRate: number;
  totalDistance: number;
  totalDuration: number;
  avgPace: number;
  avgHeartRate?: number;
  avgEffort?: number;
  intensityScore: number;
  recoveryDays: number;
}

export interface TrainingMetrics {
  currentStreak: number;
  longestStreak: number;
  totalDistance: number;
  totalDuration: number;
  totalWorkouts: number;
  avgWeeklyDistance: number;
  avgWeeklyDuration: number;
  adherenceRate: number;
  paceImprovement: number;
  consistencyScore: number;
  weeklyTrend: 'improving' | 'stable' | 'declining';
}

export interface RollingStats {
  last7Days: { distance: number; duration: number; workouts: number };
  last14Days: { distance: number; duration: number; workouts: number };
  last28Days: { distance: number; duration: number; workouts: number };
}
