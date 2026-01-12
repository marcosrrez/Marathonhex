import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { workoutCompletionSchema, dayNames, type StravaActivity, type DayName } from "@shared/schema";
import { z } from "zod";
import { fromError } from "zod-validation-error";

import { randomBytes } from "crypto";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

const oauthStates = new Map<string, number>();

function generateOAuthState(): string {
  const state = randomBytes(32).toString("hex");
  oauthStates.set(state, Date.now());
  setTimeout(() => oauthStates.delete(state), 10 * 60 * 1000);
  return state;
}

function validateOAuthState(state: string): boolean {
  if (oauthStates.has(state)) {
    oauthStates.delete(state);
    return true;
  }
  return false;
}

function getStravaAuthUrl(redirectUri: string, state: string): string {
  const scope = "read,activity:read_all";
  return `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
}

async function exchangeStravaCode(code: string, redirectUri: string) {
  const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to exchange Strava code");
  }
  
  return response.json();
}

async function refreshStravaToken(refreshToken: string) {
  const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to refresh Strava token");
  }
  
  return response.json();
}

async function getValidAccessToken(): Promise<string | null> {
  const tokens = await storage.getStravaTokens();
  if (!tokens) return null;
  
  const now = Math.floor(Date.now() / 1000);
  if (tokens.expiresAt > now + 300) {
    return tokens.accessToken;
  }
  
  const refreshed = await refreshStravaToken(tokens.refreshToken);
  await storage.setStravaTokens({
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token,
    expiresAt: refreshed.expires_at,
    athleteId: tokens.athleteId,
    athleteName: tokens.athleteName,
  });
  
  return refreshed.access_token;
}

async function fetchStravaActivities(accessToken: string, after?: number): Promise<StravaActivity[]> {
  const params = new URLSearchParams({
    per_page: "30",
  });
  if (after) {
    params.set("after", after.toString());
  }
  
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch Strava activities");
  }
  
  const activities = await response.json();
  return activities
    .filter((a: any) => a.type === "Run")
    .map((a: any) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      distance: a.distance,
      movingTime: a.moving_time,
      elapsedTime: a.elapsed_time,
      startDate: a.start_date_local,
      averageSpeed: a.average_speed,
      maxSpeed: a.max_speed,
      averageHeartrate: a.average_heartrate,
      maxHeartrate: a.max_heartrate,
      totalElevationGain: a.total_elevation_gain,
    }));
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/completions", async (req, res) => {
    try {
      const completions = await storage.getCompletions();
      res.json(completions);
    } catch (error) {
      console.error("Error fetching completions:", error);
      res.status(500).json({ error: "Failed to fetch completions" });
    }
  });

  app.get("/api/completions/:week/:day", async (req, res) => {
    try {
      const week = parseInt(req.params.week, 10);
      const day = req.params.day;

      if (isNaN(week) || week < 1 || week > 16) {
        return res.status(400).json({ error: "Invalid week number" });
      }

      const completion = await storage.getCompletion(week, day);
      if (!completion) {
        return res.status(404).json({ error: "Completion not found" });
      }

      res.json(completion);
    } catch (error) {
      console.error("Error fetching completion:", error);
      res.status(500).json({ error: "Failed to fetch completion" });
    }
  });

  app.post("/api/completions", async (req, res) => {
    try {
      const validationResult = workoutCompletionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromError(validationResult.error).message;
        return res.status(400).json({ error: errorMessage });
      }

      const completion = await storage.upsertCompletion(validationResult.data);
      res.status(201).json(completion);
    } catch (error) {
      console.error("Error saving completion:", error);
      res.status(500).json({ error: "Failed to save completion" });
    }
  });

  app.delete("/api/completions/:week/:day", async (req, res) => {
    try {
      const week = parseInt(req.params.week, 10);
      const day = req.params.day;

      if (isNaN(week) || week < 1 || week > 16) {
        return res.status(400).json({ error: "Invalid week number" });
      }

      await storage.deleteCompletion(week, day);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting completion:", error);
      res.status(500).json({ error: "Failed to delete completion" });
    }
  });

  app.get("/api/strava/status", async (req, res) => {
    try {
      if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
        return res.json({ connected: false, configured: false });
      }
      
      const tokens = await storage.getStravaTokens();
      if (!tokens) {
        return res.json({ connected: false, configured: true });
      }
      
      res.json({
        connected: true,
        configured: true,
        athleteName: tokens.athleteName,
        athleteId: tokens.athleteId,
      });
    } catch (error) {
      console.error("Error checking Strava status:", error);
      res.status(500).json({ error: "Failed to check Strava status" });
    }
  });

  app.get("/api/strava/auth-url", async (req, res) => {
    try {
      if (!STRAVA_CLIENT_ID) {
        return res.status(400).json({ error: "Strava not configured" });
      }
      
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
      const host = req.headers.host;
      const redirectUri = `${protocol}://${host}/api/strava/callback`;
      const state = generateOAuthState();
      
      res.json({ url: getStravaAuthUrl(redirectUri, state) });
    } catch (error) {
      console.error("Error generating Strava auth URL:", error);
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  });

  app.get("/api/strava/callback", async (req, res) => {
    try {
      const { code, error: stravaError, state } = req.query;
      
      if (stravaError) {
        return res.redirect("/?strava_error=denied");
      }
      
      if (!state || typeof state !== "string" || !validateOAuthState(state)) {
        return res.redirect("/?strava_error=invalid_state");
      }
      
      if (!code || typeof code !== "string") {
        return res.redirect("/?strava_error=no_code");
      }
      
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
      const host = req.headers.host;
      const redirectUri = `${protocol}://${host}/api/strava/callback`;
      
      const tokenData = await exchangeStravaCode(code, redirectUri);
      
      await storage.setStravaTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_at,
        athleteId: tokenData.athlete.id,
        athleteName: `${tokenData.athlete.firstname} ${tokenData.athlete.lastname}`,
      });
      
      res.redirect("/?strava_connected=true");
    } catch (error) {
      console.error("Error in Strava callback:", error);
      res.redirect("/?strava_error=auth_failed");
    }
  });

  app.post("/api/strava/disconnect", async (req, res) => {
    try {
      await storage.clearStravaTokens();
      res.json({ success: true });
    } catch (error) {
      console.error("Error disconnecting Strava:", error);
      res.status(500).json({ error: "Failed to disconnect Strava" });
    }
  });

  app.post("/api/strava/sync", async (req, res) => {
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        return res.status(401).json({ error: "Not connected to Strava" });
      }
      
      const trainingStartStr = req.body.trainingStart;
      if (!trainingStartStr) {
        return res.status(400).json({ error: "Training start date required" });
      }
      
      const trainingStart = new Date(trainingStartStr);
      const afterTimestamp = Math.floor(trainingStart.getTime() / 1000);
      
      const activities = await fetchStravaActivities(accessToken, afterTimestamp);
      
      let synced = 0;
      for (const activity of activities) {
        const activityDate = new Date(activity.startDate);
        const daysSinceStart = Math.floor(
          (activityDate.getTime() - trainingStart.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceStart < 0 || daysSinceStart >= 16 * 7) continue;
        
        const week = Math.floor(daysSinceStart / 7) + 1;
        const dayIndex = daysSinceStart % 7;
        const day = dayNames[dayIndex];
        
        const distanceKm = (activity.distance / 1000).toFixed(2);
        const durationMins = Math.floor(activity.movingTime / 60);
        const durationSecs = activity.movingTime % 60;
        const pacePerKm = activity.distance > 0 
          ? activity.movingTime / (activity.distance / 1000) 
          : 0;
        const paceMin = Math.floor(pacePerKm / 60);
        const paceSec = Math.floor(pacePerKm % 60);
        
        await storage.upsertCompletion({
          week,
          day,
          status: "complete",
          distance: `${distanceKm} km`,
          duration: `${durationMins}:${durationSecs.toString().padStart(2, "0")}`,
          pace: `${paceMin}:${paceSec.toString().padStart(2, "0")} /km`,
          elevation: `${Math.round(activity.totalElevationGain)} m`,
          heartRate: activity.averageHeartrate 
            ? `${Math.round(activity.averageHeartrate)} bpm` 
            : undefined,
          notes: `Synced from Strava: ${activity.name}`,
          date: activityDate.toISOString().split("T")[0],
          completedAt: activity.startDate,
        });
        
        synced++;
      }
      
      res.json({ synced, total: activities.length });
    } catch (error) {
      console.error("Error syncing Strava activities:", error);
      res.status(500).json({ error: "Failed to sync activities" });
    }
  });

  return httpServer;
}
