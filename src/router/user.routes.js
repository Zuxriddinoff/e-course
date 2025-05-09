import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { UserGuard } from "../middleware/user.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";

const router = Router();
const controller = new UserController();

router
  .post("/", JwtAuthGuard, UserGuard, controller.createUser)
  .post("/signin", controller.login)
  .post("/confirm-signin", controller.confirmsignIn)
  .post("/signout", controller.signout)
  .post("/token", controller.accessToken)
  .get("/", JwtAuthGuard, AdminGuard, controller.getAllUsers)
  .get("/:id", JwtAuthGuard, UserGuard, controller.getById)
  .put("/:id", JwtAuthGuard, UserGuard, controller.updateById)
  .delete("/:id", JwtAuthGuard, AdminGuard, controller.deleteById);

export { router as userRouter };
