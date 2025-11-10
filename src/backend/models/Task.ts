import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  name: string;
  priority: "High" | "Medium" | "Low";
  createdAt: Date;
}

const TaskSchema = new Schema({
  name: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", TaskSchema) as unknown as Model<ITask>;

export default Task;
