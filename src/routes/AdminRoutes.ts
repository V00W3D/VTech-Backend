import { Router } from "express";
import { AdminController } from "@controllers/private";
const router = Router();

router.get("/fetchSolicitudes", AdminController.Requests.fetchSolicitudes);
router.put("/aceptarSolicitud/:id", AdminController.Requests.aceptarSolicitud);
router.put(
  "/rechazarSolicitud/:id",
  AdminController.Requests.rechazarSolicitud
);
router.put(
  "/finalizarSolicitud/:id",
  AdminController.Requests.finalizarSolicitud
);

router.get("/fetchUsuarios", AdminController.Users.fetchUsuarios);
router.post("/crearUsuario", AdminController.Users.crearUsuario);
router.put("/editarUsuario/:id", AdminController.Users.editarUsuario);
router.patch("/banearUsuario/:id", AdminController.Users.banearUsuario);

router.get("/fetchServices", AdminController.Services.fetchServices);
router.post("/createService", AdminController.Services.createService);
router.put("/editService/:id", AdminController.Services.editService);
router.patch("/blockService/:id", AdminController.Services.blockService);

export default router;
