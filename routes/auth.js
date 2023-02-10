import express from "express";
import { login } from "../controllers/auth.js";

// Allows express to identify that routes are configured in seperate files
const router = express.Router();

router.post("/login", login);

export default router;
