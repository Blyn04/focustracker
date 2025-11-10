import express from "express";
import { getSessions, createSession } from "../controllers/sessionController";

const router = express.Router();

router.get("/", getSessions);
router.post("/", createSession);

export default router;
