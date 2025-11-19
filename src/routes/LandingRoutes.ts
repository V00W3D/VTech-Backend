import { Router } from "express";
import { AuthMiddleware } from "@middleware/context";
import { LandingController } from "@controllers/public";
import { RequestsController } from "@controllers/public/LandingController/requestscontroller";
const router = Router();

router.get("/getServices", LandingController.getAllServices);
router.post("/sendRequest", AuthMiddleware, LandingController.createRequest);
router.get("/historial/:userId", RequestsController.historial);
router.put("/cancel/:userId/:requestId", RequestsController.cancelar);

export default router;
