import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import sessionRoutes from "./routes/sessions";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);

// Connect MongoDB and start server
mongoose.connect("mongodb://127.0.0.1:27017/focustracker")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
