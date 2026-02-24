import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();
const controller = new SubscriptionController();

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.list);
router.patch("/:id/deactive", controller.deactivate);

export { router as SubscriptionRoutes }
