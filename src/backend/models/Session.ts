import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  taskId: string;
  minutes: number;
  focusLevel?: number;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  minutes: { type: Number, required: true },
  focusLevel: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISession>("Session", SessionSchema);
