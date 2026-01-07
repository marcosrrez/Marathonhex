import { z } from "zod";

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
