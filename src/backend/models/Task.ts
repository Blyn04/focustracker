import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ Define interface
export interface ITask extends Document {
  name: string;
  priority: "High" | "Medium" | "Low";
  createdAt: Date;
}

// 2️⃣ Schema
const TaskSchema = new Schema({
  name: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  createdAt: { type: Date, default: Date.now },
});

// 3️⃣ Model — cast via unknown first
const Task = mongoose.model("Task", TaskSchema) as unknown as Model<ITask>;

export default Task;
