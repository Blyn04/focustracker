import { Request, Response } from "express";
import Task from "../models/Task";

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // let TS infer type
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, priority } = req.body;
    const task = new Task({ name, priority });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
