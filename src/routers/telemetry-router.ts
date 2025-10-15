// src/routes/telemetryRouter.ts
import express from "express";
import { db } from "../db/db";
import { TelemetryEventType } from "@prisma/client";
import { BadRequest } from "../errors/server_errors";

export const telemetryRouter = express.Router();

telemetryRouter.post("/", async (req, res,next) => {
  try {
    const { eventType, userId, metadata } = req.body;

    if (!eventType) {
      throw new BadRequest("Missing eventType");
    }

    const event = await db.telemetryEvent.create({
      data: {
        eventType,
        userId,
        metadata,
      },
    });

    res.status(201).json({ success: true, id: event.id });
  } catch (error) {
    console.error("Telemetry error:", error);
    next(error);
  }
});