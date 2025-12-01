import { Router } from "express";
import {
  verifyHandler,
  settleHandler,
  statusHandler,
  supportedHandler,
  healthHandler,
} from "../controllers/facilitatorController";

const router = Router();
router.post("/verify", verifyHandler);
router.post("/settle", settleHandler);
router.post("/status", statusHandler);
router.get("/supported", supportedHandler);
router.get("/health", healthHandler);

export default router;
