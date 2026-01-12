import type { WorkoutCompletion, InsertWorkoutCompletion, StravaTokens } from "@shared/schema";
import { workoutCompletions, stravaTokensTable } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getCompletions(): Promise<Record<string, WorkoutCompletion>>;
  getCompletion(week: number, day: string): Promise<WorkoutCompletion | undefined>;
  upsertCompletion(data: InsertWorkoutCompletion): Promise<WorkoutCompletion>;
  deleteCompletion(week: number, day: string): Promise<void>;
  getStravaTokens(): Promise<StravaTokens | null>;
  setStravaTokens(tokens: StravaTokens): Promise<void>;
  clearStravaTokens(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCompletions(): Promise<Record<string, WorkoutCompletion>> {
    const rows = await db.select().from(workoutCompletions);
    const result: Record<string, WorkoutCompletion> = {};
    
    for (const row of rows) {
      const key = `${row.week}-${row.day}`;
      result[key] = {
        id: row.id,
        week: row.week,
        day: row.day as any,
        status: row.status as any,
        distance: row.distance || undefined,
        duration: row.duration || undefined,
        pace: row.pace || undefined,
        elevation: row.elevation || undefined,
        heartRate: row.heartRate || undefined,
        effort: row.effort || undefined,
        weather: row.weather || undefined,
        notes: row.notes || undefined,
        date: row.date || undefined,
        completedAt: row.completedAt || undefined,
      };
    }
    return result;
  }

  async getCompletion(week: number, day: string): Promise<WorkoutCompletion | undefined> {
    const rows = await db
      .select()
      .from(workoutCompletions)
      .where(and(eq(workoutCompletions.week, week), eq(workoutCompletions.day, day)));
    
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      week: row.week,
      day: row.day as any,
      status: row.status as any,
      distance: row.distance || undefined,
      duration: row.duration || undefined,
      pace: row.pace || undefined,
      elevation: row.elevation || undefined,
      heartRate: row.heartRate || undefined,
      effort: row.effort || undefined,
      weather: row.weather || undefined,
      notes: row.notes || undefined,
      date: row.date || undefined,
      completedAt: row.completedAt || undefined,
    };
  }

  async upsertCompletion(data: InsertWorkoutCompletion): Promise<WorkoutCompletion> {
    const existing = await this.getCompletion(data.week, data.day);
    
    if (existing) {
      await db
        .update(workoutCompletions)
        .set({
          status: data.status,
          distance: data.distance,
          duration: data.duration,
          pace: data.pace,
          elevation: data.elevation,
          heartRate: data.heartRate,
          effort: data.effort,
          weather: data.weather,
          notes: data.notes,
          date: data.date,
          completedAt: data.completedAt,
          updatedAt: new Date(),
        })
        .where(eq(workoutCompletions.id, existing.id!));
      
      return { ...existing, ...data };
    }

    const [inserted] = await db
      .insert(workoutCompletions)
      .values({
        week: data.week,
        day: data.day,
        status: data.status,
        distance: data.distance,
        duration: data.duration,
        pace: data.pace,
        elevation: data.elevation,
        heartRate: data.heartRate,
        effort: data.effort,
        weather: data.weather,
        notes: data.notes,
        date: data.date,
        completedAt: data.completedAt,
      })
      .returning();

    return {
      id: inserted.id,
      week: inserted.week,
      day: inserted.day as any,
      status: inserted.status as any,
      distance: inserted.distance || undefined,
      duration: inserted.duration || undefined,
      pace: inserted.pace || undefined,
      elevation: inserted.elevation || undefined,
      heartRate: inserted.heartRate || undefined,
      effort: inserted.effort || undefined,
      weather: inserted.weather || undefined,
      notes: inserted.notes || undefined,
      date: inserted.date || undefined,
      completedAt: inserted.completedAt || undefined,
    };
  }

  async deleteCompletion(week: number, day: string): Promise<void> {
    await db
      .delete(workoutCompletions)
      .where(and(eq(workoutCompletions.week, week), eq(workoutCompletions.day, day)));
  }

  async getStravaTokens(): Promise<StravaTokens | null> {
    const rows = await db.select().from(stravaTokensTable).limit(1);
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      accessToken: row.accessToken,
      refreshToken: row.refreshToken,
      expiresAt: row.expiresAt,
      athleteId: row.athleteId,
      athleteName: row.athleteName,
    };
  }

  async setStravaTokens(tokens: StravaTokens): Promise<void> {
    await db.delete(stravaTokensTable);
    await db.insert(stravaTokensTable).values({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      athleteId: tokens.athleteId,
      athleteName: tokens.athleteName,
    });
  }

  async clearStravaTokens(): Promise<void> {
    await db.delete(stravaTokensTable);
  }
}

export const storage = new DatabaseStorage();
