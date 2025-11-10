import { Request, Response } from "express";
import Task, { ITask } from "../models/Task";

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks: ITask[] = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { name, priority } = req.body;
    const task = new Task({ name, priority });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
