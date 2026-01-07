import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { workoutCompletionSchema } from "@shared/schema";
import { z } from "zod";
import { fromError } from "zod-validation-error";

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

  return httpServer;
}
