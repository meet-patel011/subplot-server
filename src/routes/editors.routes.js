import express from "express";
import { getEditorsPicks } from "../controllers/editors.controller.js";

const router = express.Router();

router.get("/", getEditorsPicks);

export default router;
