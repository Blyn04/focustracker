import { Request, Response } from "express";
import Session, { ISession } from "../models/Session";

// Get all sessions
export const getSessions = async (req: Request, res: Response) => {
  try {
    const sessions: ISession[] = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a session
export const createSession = async (req: Request, res: Response) => {
  try {
    const { taskId, minutes, focusLevel } = req.body;
    const session = new Session({ taskId, minutes, focusLevel });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
