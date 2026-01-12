import type { WorkoutCompletion, InsertWorkoutCompletion, StravaTokens } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCompletions(): Promise<Record<string, WorkoutCompletion>>;
  getCompletion(week: number, day: string): Promise<WorkoutCompletion | undefined>;
  upsertCompletion(data: InsertWorkoutCompletion): Promise<WorkoutCompletion>;
  deleteCompletion(week: number, day: string): Promise<void>;
  getStravaTokens(): Promise<StravaTokens | null>;
  setStravaTokens(tokens: StravaTokens): Promise<void>;
  clearStravaTokens(): Promise<void>;
}

export class MemStorage implements IStorage {
  private completions: Map<string, WorkoutCompletion>;
  private stravaTokens: StravaTokens | null = null;

  constructor() {
    this.completions = new Map();
  }

  private getKey(week: number, day: string): string {
    return `${week}-${day}`;
  }

  async getCompletions(): Promise<Record<string, WorkoutCompletion>> {
    const result: Record<string, WorkoutCompletion> = {};
    this.completions.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  async getCompletion(week: number, day: string): Promise<WorkoutCompletion | undefined> {
    return this.completions.get(this.getKey(week, day));
  }

  async upsertCompletion(data: InsertWorkoutCompletion): Promise<WorkoutCompletion> {
    const key = this.getKey(data.week, data.day);
    const existing = this.completions.get(key);
    
    const completion: WorkoutCompletion = {
      id: existing?.id || randomUUID(),
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
    };

    this.completions.set(key, completion);
    return completion;
  }

  async deleteCompletion(week: number, day: string): Promise<void> {
    this.completions.delete(this.getKey(week, day));
  }

  async getStravaTokens(): Promise<StravaTokens | null> {
    return this.stravaTokens;
  }

  async setStravaTokens(tokens: StravaTokens): Promise<void> {
    this.stravaTokens = tokens;
  }

  async clearStravaTokens(): Promise<void> {
    this.stravaTokens = null;
  }
}

export const storage = new MemStorage();
